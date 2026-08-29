import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
}
