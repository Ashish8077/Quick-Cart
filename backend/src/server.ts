/**
 * Node modules
 */

import express from 'express';

import compression from 'compression';

import cookieParser from 'cookie-parser';

import cors from 'cors';

import helmet from 'helmet';

/**
 * Custom modules
 */

import config from './config';

import limiter from './lib/express_rate_limit';

import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';

import { logger } from './lib/winston';

import { errorMiddleware } from './core/middleware/error.middleware';

import { setupSwagger } from './config/swagger';

/**
 * Routes
 */

import { authRoutes } from './modules/auth';

import { AUTH_ROUTES } from './constants/routes';

/**
 * Types
 */

import type { CorsOptions } from 'cors';

import type { Server } from 'node:http';

/**
 * Express application
 */

const app = express();

/**
 * CORS configuration
 */

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    /**
     * Allow:
     * - development environment
     * - server-to-server requests
     * - whitelisted origins
     */

    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);

      return;
    }

    /**
     * Reject non-whitelisted origins
     */

    const corsError = new Error(`CORS error: ${origin} is not allowed`);

    logger.warn(corsError.message);

    callback(corsError);
  },
};

/**
 * Global middlewares
 */

app.use(cors(corsOptions));

app.use(helmet());

app.use(
  compression({
    threshold: 1024,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: '10kb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

app.use(limiter);

/**
 * API routes
 */

app.use(AUTH_ROUTES.AUTH.SIGNUP, authRoutes);

/**
 * Health check route
 */

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

/**
 * Swagger API documentation
 *
 * Only mounted in non-production environments.
 * Available at: http://localhost:<PORT>/docs
 */

if (config.NODE_ENV !== 'production') {
  setupSwagger(app);
}

/**
 * Global error middleware
 *
 * IMPORTANT:
 * Must be registered after routes
 */

app.use(errorMiddleware);

/**
 * HTTP server instance
 */

let server: Server;

/**
 * Bootstrap application
 *
 * - Connects database
 * - Starts HTTP server
 */

const bootstrap = async (): Promise<void> => {
  try {
    /**
     * Connect database
     */

    await connectToDatabase();

    /**
     * Start server
     */

    server = app.listen(config.PORT, () => {
      logger.info(`Server started on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap application', {
      error,
    });

    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 *
 * - Stops accepting new connections
 * - Disconnects database
 * - Exits process safely
 */

const shutdown = async (): Promise<void> => {
  try {
    logger.info('Graceful shutdown initiated');

    /**
     * Close HTTP server
     */

    if (server) {
      server.close();
    }

    /**
     * Disconnect database
     */

    await disconnectFromDatabase();

    logger.info('Application shutdown completed');

    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', {
      error,
    });

    process.exit(1);
  }
};

/**
 * Process signal listeners
 */

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

/**
 * Start application
 */

void bootstrap();
