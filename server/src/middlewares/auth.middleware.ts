import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.model.js';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token is required.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token is required.');
    }

    const payload = AuthService.verifyToken(token);
    const user = await User.findById(payload.id);

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const payload = AuthService.verifyToken(token);
          const user = await User.findById(payload.id);
          if (user) {
            req.user = user;
          }
        } catch {
          // Ignore invalid token in optionalAuth
        }
      }
    }
    next();
  } catch {
    next();
  }
}
