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
 * Global error handling middleware
 */

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  /**
   * Log error
   */

  logger.error('Unhandled application error', {
    error,
  });

  /**
   * Handle Zod validation errors
   */

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues,
    });

    return;
  }

  /**
   * Handle custom application errors
   */

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  /**
   * Handle unknown server errors
   */

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
