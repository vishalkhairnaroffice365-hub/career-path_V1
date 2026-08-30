import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ScoringService } from '../services/scoring.service.js';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      return ApiResponse.success(res, user, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { name, avatar } = req.body;

      if (name) user.name = name.trim();
      if (avatar) user.avatar = avatar;

      await user.save();
      return ApiResponse.success(res, user, 'User profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async saveOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      user.onboardingData = {
        ...user.onboardingData,
        ...req.body,
      };

      // If user provided skills during onboarding, add them to known skills count
      if (req.body.currentSkills && Array.isArray(req.body.currentSkills)) {
        user.stats.skillsAcquired = Math.max(user.stats.skillsAcquired, req.body.currentSkills.length);
      }

      await user.save();
      return ApiResponse.success(res, user, 'Onboarding data saved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      user.onboardingCompleted = true;

      // Update career readiness baseline
      user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);

      await user.save();
      return ApiResponse.success(res, user, 'Onboarding marked as completed');
    } catch (error) {
      next(error);
    }
  }

  static async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const data = {
        progress: user.progress,
        stats: user.stats,
        achievements: user.achievements,
      };
      return ApiResponse.success(res, data, 'User progress retrieved');
    } catch (error) {
      next(error);
    }
  }
}
