import type { Request, Response, NextFunction } from 'express';
import { Achievement } from '../models/Achievement.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AchievementController {
  static async getAchievements(req: Request, res: Response, next: NextFunction) {
    try {
      const allAchievements = await Achievement.find().sort({ id: 1 });
      const user = req.user;

      if (!user) {
        return ApiResponse.success(res, allAchievements, 'Achievements catalog retrieved');
      }

      // Merge with user's earned states
      const merged = allAchievements.map((item) => {
        const userState = user.achievements.find((a) => a.id === item.id);
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          emoji: item.emoji,
          category: item.category,
          isEarned: userState?.isEarned || false,
          earnedAt: userState?.earnedAt || null,
        };
      });

      return ApiResponse.success(res, merged, 'User achievements retrieved');
    } catch (error) {
      next(error);
    }
  }
}
