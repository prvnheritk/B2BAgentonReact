import type { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import { logger } from '../utils/logger.js';

export interface HttpError extends Error {
  status?: number;
  details?: unknown;
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'not_found' });
}

export function errorHandler(
  err: HttpError | AxiosError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    logger.warn(
      {
        url: err.config?.url,
        method: err.config?.method,
        status,
        data: err.response?.data,
      },
      'upstream Salesforce error',
    );
    res.status(status).json({
      error: 'salesforce_error',
      status,
      details: err.response?.data ?? err.message,
    });
    return;
  }

  const status = err.status ?? 500;
  logger.error({ err, path: req.path }, 'unhandled server error');
  res.status(status).json({
    error: err.name || 'internal_error',
    message: err.message,
    details: err.details,
  });
}
