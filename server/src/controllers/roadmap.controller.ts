import type { Request, Response, NextFunction } from 'express';
import { Roadmap, type IRoadmapNode } from '../models/Roadmap.model.js';
import { rawRoadmaps } from '../services/seedData/roadmaps.data.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ProgressService } from '../services/progress.service.js';

export class RoadmapController {
  static async getRoadmapByCareerId(req: Request, res: Response, next: NextFunction) {
    try {
      const { careerId } = req.params;
      let roadmap = await Roadmap.findOne({
        $or: [{ careerId }, { id: careerId }, { id: `${careerId}-roadmap` }],
      });

      // If not yet in MongoDB, find from rawRoadmaps seed and upsert immediately
      const raw =
        rawRoadmaps.find(
          (r) => r.careerId === careerId || r.id === careerId || r.id === `${careerId}-roadmap`
        ) || rawRoadmaps[0];

      if (!roadmap) {
        roadmap = await Roadmap.findOneAndUpdate(
          { id: raw.id },
          { ...raw, careerId },
          { upsert: true, new: true }
        );
      }

      const json: any = roadmap?.toJSON ? roadmap.toJSON() : (roadmap || raw);
      const user = req.user;

      // Enhance node statuses dynamically with user's specific progress
      const completedNodeIds = user?.progress?.completedNodeIds || [];
      const inProgressNodeIds = user?.progress?.inProgressNodeIds || [];

      json.nodes = (json.nodes || []).map((node: IRoadmapNode) => {
        let status = node.defaultStatus || 'locked';
        if (completedNodeIds.includes(node.id)) {
          status = 'completed';
        } else if (inProgressNodeIds.includes(node.id)) {
          status = 'in-progress';
        } else if (
          !node.prerequisites ||
          node.prerequisites.length === 0 ||
          node.prerequisites.every((prereq) => completedNodeIds.includes(prereq))
        ) {
          status = 'available';
        } else {
          status = 'locked';
        }
        return { ...node, status };
      });

      return ApiResponse.success(res, json, 'Roadmap retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUserRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const careerId = user.selectedCareerId || 'android-developer';

      let roadmap = await Roadmap.findOne({
        $or: [{ careerId }, { id: careerId }, { id: `${careerId}-roadmap` }],
      });

      const raw =
        rawRoadmaps.find(
          (r) => r.careerId === careerId || r.id === careerId || r.id === `${careerId}-roadmap`
        ) || rawRoadmaps[0];

      if (!roadmap) {
        roadmap = await Roadmap.findOneAndUpdate(
          { id: raw.id },
          { ...raw, careerId },
          { upsert: true, new: true }
        );
      }

      const json: any = roadmap?.toJSON ? roadmap.toJSON() : (roadmap || raw);
      const completedNodeIds = user.progress?.completedNodeIds || [];
      const inProgressNodeIds = user.progress?.inProgressNodeIds || [];

      json.nodes = (json.nodes || []).map((node: IRoadmapNode) => {
        let status = node.defaultStatus || 'locked';
        if (completedNodeIds.includes(node.id)) {
          status = 'completed';
        } else if (inProgressNodeIds.includes(node.id)) {
          status = 'in-progress';
        } else if (
          !node.prerequisites ||
          node.prerequisites.length === 0 ||
          node.prerequisites.every((prereq) => completedNodeIds.includes(prereq))
        ) {
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

      const { user: updatedUser, unlockedAchievements } =
        await ProgressService.completeRoadmapNode(user, nodeId);

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

  static async startRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { user: updatedUser, unlockedAchievements } =
        await ProgressService.startRoadmap(user);

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          unlockedAchievements,
        },
        'Roadmap started successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}
