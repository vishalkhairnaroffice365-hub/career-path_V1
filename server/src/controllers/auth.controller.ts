import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const { token, user } = await AuthService.register(name, email, password);

      return ApiResponse.created(
        res,
        {
          token,
          user,
        },
        'Account registered successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);

      return ApiResponse.success(
        res,
        {
          token,
          user,
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is populated by requireAuth middleware
      return ApiResponse.success(res, req.user, 'Current user profile');
    } catch (error) {
      next(error);
    }
  }
}
