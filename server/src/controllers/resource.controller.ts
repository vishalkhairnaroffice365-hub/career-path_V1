import type { Request, Response, NextFunction } from 'express';
import { Resource } from '../models/Resource.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ProgressService } from '../services/progress.service.js';

export class ResourceController {
  static async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, level, isFree, careerId, skillId, search } = req.query;
      const query: Record<string, any> = {};

      if (type && type !== 'all') query.type = type;
      if (level && level !== 'all') query.level = level;
      if (isFree !== undefined && isFree !== 'all') query.isFree = isFree === 'true';
      if (careerId && careerId !== 'all') query.careerIds = careerId;
      if (skillId && skillId !== 'all') query.skillIds = skillId;

      if (search && typeof search === 'string' && search.trim()) {
        const s = search.trim();
        const searchRegex = new RegExp(s, 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { provider: searchRegex },
          { type: searchRegex },
          { level: searchRegex },
          { skillIds: searchRegex },
          { careerIds: searchRegex },
          { tags: searchRegex },
        ];
      }

      const resources = await Resource.find(query).sort({ rating: -1 });
      const user = req.user;

      const enhanced = resources.map((resource) => {
        const json: any = resource.toJSON();
        if (user) {
          json.isCompleted = user.progress?.completedResourceIds?.includes(resource.id) || false;
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
