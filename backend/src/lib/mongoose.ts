/**
 * Node modules
 */

import mongoose from 'mongoose';

/**
 * Custom modules
 */

import config from '../config';

/**
 * Custom modules
 */

import type { ConnectOptions } from 'mongoose';
import { logger } from './winston';

/**
 * Global Mongoose plugin
 *
 * Applies to every schema automatically — no per-model config needed.
 *
 * - Renames _id → id (string form via Mongoose's built-in id virtual)
 * - Removes __v (internal version key)
 *
 * Schema-specific sensitive fields (password, tokens, etc.)
 * are handled individually per schema using select: false
 * and a schema-level toJSON transform where needed.
 */

mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true, // enables the built-in 'id' virtual (string of _id)
    versionKey: false, // removes __v
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret['_id']; // id is already present via virtuals: true
      return ret;
    },
  });
});

const clientOptions: ConnectOptions = {
  dbName: 'quickcart-db',
  appName: 'quickcart',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * - Uses `MONGO_URI` as the connection string.
 * - `clientOptions` contains additional configuration for Mongoose.
 * - If an error occurs during the connection process, it is caught and rethrown
 *   with a descriptive message for easier debugging.
 * - Ensures connection errors are properly handled and rethrown for better debugging.
 */

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to the database successfully.', {
      uri: config.MONGO_URI,
      Options: clientOptions,
    });
  } catch (error: unknown) {
    logger.error('Error connecting to the database', { error });
    throw new Error('Failed to connect to the database', { cause: error });
  }
};

/**
 * Disconnects from the MongoDB database using Mongoose
 *
 * - This function attempts to disconnect from the database asynchronously.
 * - If the disconnection is successful, a success message is logged.
 * - If an error occurs, it is either rethrown as a new Error (if it's an instance of Error) or logged to the console.
 * - Ensures connection errors are properly handled and rethrown for better debugging.
 */

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from the database successfully.', {
      uri: config.MONGO_URI,
      Options: clientOptions,
    });
  } catch (error: unknown) {
    logger.error('Error disconnecting from the database', { error });
    throw new Error('Failed to disconnect from the database', { cause: error });
  }
};
