import type { Server } from 'node:http';

import app from './app';

import config from './config';

import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';

import { logger } from './lib/winston';

/**
 * HTTP server instance
 */

let server: Server;

/**
 *
 * Bootstrap application
 */

const bootstrap = async (): Promise<void> => {
  try {
    /**
     * Connect database
     */

    await connectToDatabase();

    /**
     * Start HTTP server
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
 * Graceful shutdown
 */

const shutdown = async (): Promise<void> => {
  try {
    logger.info('Graceful shutdown initiated');

    if (server) {
      server.close();
    }

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
 * Process listeners
 */

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

/**
 * Start application
 */

void bootstrap();
