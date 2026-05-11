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

import limiter from './lib/express-rate-limit';

import { logger } from './lib/winston';

import { errorMiddleware } from './core/middleware/error.middleware';

import { setupSwagger } from './docs/swagger';

/**
 * Routes
 */

import { ROUTES } from './constants/routes';

import authRoutes from './modules/auth/routes/auth.routes';

/**
 * Types
 */

import type { CorsOptions } from 'cors';

/**
 * Express application
 */

const app = express();

/**
 * CORS configuration
 */

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

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
app.use(compression({ threshold: 1024 }));
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

app.use(ROUTES.AUTH_BASE, authRoutes);

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
 */

if (config.NODE_ENV !== 'production') {
  setupSwagger(app);
}

/**
 * Global error middleware
 */

app.use(errorMiddleware);

export default app;
