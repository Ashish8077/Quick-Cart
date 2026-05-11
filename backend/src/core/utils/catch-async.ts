import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async Express controller to forward any unhandled promise
 * rejections to the Express global error handler via `next(err)`.
 *
 * @example
 * router.get('/resource', catchAsync(async (req, res) => {
 *   const data = await someService.fetch();
 *   res.json(data);
 * }));
 */

export type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const catchAsync =
  (fn: AsyncController): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
