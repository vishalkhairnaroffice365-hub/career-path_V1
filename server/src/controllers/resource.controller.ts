import type { Request, Response, NextFunction } from 'express';
import { Resource } from '../models/Resource.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ProgressService } from '../services/progress.service.js';

export class ResourceController {
  static async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, level, isFree, careerId, skillId } = req.query;
      const query: Record<string, any> = {};

      if (type && type !== 'all') query.type = type;
      if (level) query.level = level;
      if (isFree !== undefined) query.isFree = isFree === 'true';
      if (careerId) query.careerIds = careerId;
      if (skillId) query.skillIds = skillId;

      const resources = await Resource.find(query).sort({ rating: -1 });
      const user = req.user;

      const enhanced = resources.map((resource) => {
        const json: any = resource.toJSON();
        if (user) {
          json.isCompleted = user.progress.completedResourceIds.includes(resource.id);
        }
        return json;
      });

      return ApiResponse.success(res, enhanced, 'Resources retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async completeResource(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { resourceId } = req.params;

      const resource = await Resource.findOne({ id: resourceId });
      if (!resource) {
        throw ApiError.notFound(`Resource not found with ID: ${resourceId}`);
      }

      const { user: updatedUser, unlockedAchievements } = await ProgressService.completeResource(user, resourceId);

      return ApiResponse.success(
        res,
        {
          resource,
          user: updatedUser,
          unlockedAchievements,
        },
        `Marked resource ${resource.title} as completed`
      );
    } catch (error) {
      next(error);
    }
  }
}
