import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

/**
 * Attaches a unique X-Request-ID header to every request for log correlation.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

/**
 * Sanitizes incoming request bodies, params, and queries by stripping any keys
 * that begin with '$' or contain '.' to prevent MongoDB operator injection.
 */
export function mongoSanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.params) req.params = sanitizeObject(req.params);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys starting with '$' or containing dots (MongoDB operators/path injection)
    if (!key.startsWith('$') && !key.includes('.')) {
      clean[key] = typeof value === 'object' && value !== null ? sanitizeObject(value) : value;
    }
  }
  return clean;
}
