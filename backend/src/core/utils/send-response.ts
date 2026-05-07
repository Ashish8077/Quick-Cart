/**
 * Node modules
 */

import type { Response } from 'express';

/**
 * Types
 */

type SendResponseParams<T> = {
  res: Response;

  statusCode: number;

  success: boolean;

  message: string;

  data?: T;
};

/**
 * Reusable API response helper
 */

export const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
}: SendResponseParams<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
