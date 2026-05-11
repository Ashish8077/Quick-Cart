/**
 * Node modules
 */

import type { NextFunction, Request, Response } from 'express';

import { ZodError } from 'zod';

/**
 * Custom modules
 */

import { logger } from '../../lib/winston';

import { AppError } from '../errors/app-error';

/**
 * Mongoose duplicate key error shape (code 11000)
 */

interface MongooseDuplicateKeyError {
  code: number;
  keyValue: Record<string, unknown>;
}

function isMongooseDuplicateKeyError(err: unknown): err is MongooseDuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as MongooseDuplicateKeyError).code === 11000 &&
    'keyValue' in err
  );
}

/**
 * Global error handling middleware.
 *
 * Handles (in priority order):
 *  1. Zod validation errors  → 400
 *  2. Mongoose duplicate key → 409
 *  3. Operational AppErrors  → AppError.statusCode
 *  4. Unknown / programmer errors → 500 (message never leaked)
 */

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  /**
   * Always log the full error with stack trace so nothing is invisible in prod.
   */

  logger.error('Unhandled application error', {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    error,
  });

  /**
   * Handle Zod validation errors.
   * Only expose field path + message — never raw internals.
   */

  if (error instanceof ZodError) {
    console.log(error);
    console.log(ZodError);
    const fieldErrors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: fieldErrors,
    });

    return;
  }

  /**
   * Handle Mongoose duplicate key errors (e.g. duplicate email on signup).
   */

  if (isMongooseDuplicateKeyError(error)) {
    const field = Object.keys(error.keyValue)[0];

    res.status(409).json({
      success: false,
      message: `${field} is already in use`,
      errors: [{ field, message: `${field} is already in use` }],
    });

    return;
  }

  /**
   * Handle known operational AppErrors.
   * Only expose the message if the error is intentionally operational.
   */

  if (error instanceof AppError && error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: [],
    });

    return;
  }

  /**
   * Fallback: unknown / programmer error.
   * Never leak internal details to the client.
   */

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: [],
  });
};
