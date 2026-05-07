/**
 * Node modules
 */

import type { NextFunction, Request, Response } from 'express';

import type { ZodType } from 'zod';

/**
 * Generic request validation middleware
 */

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    /**
     * Replace request body with validated data
     */

    req.body = result.data;

    next();
  };
