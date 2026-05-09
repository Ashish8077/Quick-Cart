/**
 * Node modules
 */

import type { NextFunction, Request, Response } from 'express';

import type { ZodType } from 'zod';

/**
 * Schemas object for multi-source validation.
 *
 * Each key is optional — only provided sources are validated.
 *
 * - body   → req.body   (POST/PUT/PATCH payloads)
 * - params → req.params (route parameters e.g. /users/:id)
 * - query  → req.query  (query strings e.g. ?page=1&limit=20)
 *
 * NOTE: For query params, use z.coerce.* in your schema since
 * Express always parses query values as strings.
 *
 * @example
 * // Body only
 * router.post('/signup', validate({ body: signupSchema }), signup);
 *
 * // Params only
 * router.get('/users/:id', validate({ params: userIdSchema }), getUser);
 *
 * // Query only
 * router.get('/products', validate({ query: paginationSchema }), list);
 *
 * // Multiple sources at once
 * router.put('/users/:id', validate({ params: userIdSchema, body: updateSchema }), update);
 */

type ValidationSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

/**
 * Generic request validation middleware
 *
 * Validates one or more request sources against Zod schemas.
 * Fails fast on the first invalid source (in body → params → query order).
 * On failure → passes ZodError to the centralized error middleware.
 * On success → replaces each validated source with clean, transformed data.
 */

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const sources = ['body', 'params', 'query'] as const;

    for (const source of sources) {
      const schema = schemas[source];

      if (!schema) continue;

      const result = schema.safeParse(req[source]);

      if (!result.success) {
        next(result.error);
        return;
      }

      /**
       * Replace the source with validated and Zod-transformed data.
       * The cast is required because Express's req.params and req.query
       * have specific incompatible types (ParamsDictionary, ParsedQs).
       */

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[source] = result.data;
    }

    next();
  };
