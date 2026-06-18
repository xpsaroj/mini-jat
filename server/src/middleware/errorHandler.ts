import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    details?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: true,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
    return;
  }

  if (err instanceof Error) {
    const status =
      (err as Error & { status?: number; statusCode?: number }).status ??
      (err as Error & { status?: number; statusCode?: number }).statusCode ??
      500;

    res.status(status).json({
      error: true,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : err.message,
    });
    return;
  }

  res.status(500).json({ error: true, message: 'Internal Server Error' });
};
