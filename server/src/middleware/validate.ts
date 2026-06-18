import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ParsedQs } from 'qs';
import { z } from 'zod';
import { ApiError } from './errorHandler.js';

/**
 * Middleware factory that validates req.body or req.query against a Zod schema.
 * On failure, calls next() with a 400 ApiError containing field-level messages.
 */
export function validate<T extends z.ZodType>(
  schema: T,
  target: 'body' | 'query' = 'body',
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const raw: unknown = target === 'body' ? req.body : req.query;
    const result = schema.safeParse(raw);

    if (!result.success) {
      const details: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.') || '_root';
        if (!(path in details)) {
          details[path] = issue.message;
        }
      }
      next(new ApiError('Validation failed', 400, details));
      return;
    }

    if (target === 'body') {
      req.body = result.data as Record<string, unknown>;
    } else {
      req.query = result.data as ParsedQs;
    }

    next();
  };
}
