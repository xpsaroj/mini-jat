import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';
import { ApiError } from './errorHandler.js';

// Express 5 / Node IncomingMessage: req.query is a getter-only property.
// We store validated data in a custom property instead of overwriting req.query.
declare module 'express-serve-static-core' {
  interface Request {
    validatedBody?: Record<string, unknown>;
    validatedQuery?: Record<string, unknown>;
  }
}

/**
 * Middleware factory that validates req.body or req.query against a Zod schema.
 * Validated (and coerced) data is stored in req.validatedBody / req.validatedQuery.
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
      // req.query is read-only in Express 5 — store in custom property
      req.validatedQuery = result.data as Record<string, unknown>;
    }

    next();
  };
}
