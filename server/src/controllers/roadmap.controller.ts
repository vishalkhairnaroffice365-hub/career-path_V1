import type { Request, Response, NextFunction } from 'express';
import { Roadmap, type IRoadmapNode } from '../models/Roadmap.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ProgressService } from '../services/progress.service.js';

export class RoadmapController {
  static async getRoadmapByCareerId(req: Request, res: Response, next: NextFunction) {
    try {
      const { careerId } = req.params;
      const roadmap = await Roadmap.findOne({ careerId });

      if (!roadmap) {
        throw ApiError.notFound(`Roadmap not found for career: ${careerId}`);
      }

      const json: any = roadmap.toJSON();
      const user = req.user;

      // Enhance node statuses with user's progress
      if (user) {
        const completedNodeIds = user.progress.completedNodeIds || [];
        const inProgressNodeIds = user.progress.inProgressNodeIds || [];

        json.nodes = json.nodes.map((node: IRoadmapNode) => {
          let status = node.defaultStatus;
          if (completedNodeIds.includes(node.id)) {
            status = 'completed';
          } else if (inProgressNodeIds.includes(node.id)) {
            status = 'in-progress';
          } else if (node.prerequisites.every((prereq) => completedNodeIds.includes(prereq))) {
            status = 'available';
          } else {
            status = 'locked';
          }
          return { ...node, status };
        });
      }

      return ApiResponse.success(res, json, 'Roadmap retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUserRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const careerId = user.selectedCareerId || 'android-developer';

      const roadmap = await Roadmap.findOne({ careerId });
      if (!roadmap) {
        throw ApiError.notFound(`Roadmap not found for career: ${careerId}`);
      }

      const json: any = roadmap.toJSON();
      const completedNodeIds = user.progress.completedNodeIds || [];
      const inProgressNodeIds = user.progress.inProgressNodeIds || [];

      json.nodes = json.nodes.map((node: IRoadmapNode) => {
        let status = node.defaultStatus;
        if (completedNodeIds.includes(node.id)) {
          status = 'completed';
        } else if (inProgressNodeIds.includes(node.id)) {
          status = 'in-progress';
        } else if (node.prerequisites.every((prereq) => completedNodeIds.includes(prereq))) {
          status = 'available';
        } else {
          status = 'locked';
        }
        return { ...node, status };
      });

      return ApiResponse.success(res, json, 'User roadmap retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async completeNode(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId } = req.params;

      const { user: updatedUser, unlockedAchievements } = await ProgressService.completeRoadmapNode(user, nodeId);

      return ApiResponse.success(
        res,
        {
          nodeId,
          user: updatedUser,
          unlockedAchievements,
        },
        'Roadmap node marked as completed'
      );
    } catch (error) {
      next(error);
    }
  }
}
