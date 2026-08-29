import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `An account with this ${field} already exists.`;
    error = ApiError.conflict(message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation error', messages);
  }

  // Handle Mongoose CastError (invalid ObjectId / type)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (statusCode >= 500) {
    logger.error('Unhandled Server Error:', {
      message: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('Client Error:', {
      statusCode,
      message,
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && env.NODE_ENV === 'production' ? 'Internal server error' : message,
    ...(error.errors ? { errors: error.errors } : {}),
    ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};
