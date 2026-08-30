import type { Request, Response, NextFunction } from 'express';
import { PracticalTask } from '../models/Task.model.js';
import { ProgressService } from '../services/progress.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class TaskController {
  static async getTaskByNodeId(req: Request, res: Response, next: NextFunction) {
    try {
      const { nodeId } = req.params;
      const task = await PracticalTask.findOne({ nodeId });

      if (!task) {
        throw ApiError.notFound(`Practical task not found for node ID: ${nodeId}`);
      }

      const user = req.user;
      const submission = user?.learning?.taskSubmissions?.[nodeId] || {
        nodeId,
        status: 'not-started',
      };

      return ApiResponse.success(
        res,
        {
          task,
          submission,
        },
        'Practical task retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async startTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId } = req.params;

      const task = await PracticalTask.findOne({ nodeId });
      if (!task) {
        throw ApiError.notFound(`Practical task not found for node ID: ${nodeId}`);
      }

      const { user: updatedUser, taskSubmission } = await ProgressService.startTask(
        user,
        nodeId,
        task.durationHours
      );

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          submission: taskSubmission,
        },
        `Task "${task.title}" started. Good luck!`
      );
    } catch (error) {
      next(error);
    }
  }

  static async submitTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId } = req.params;
      const { githubUrl, liveUrl } = req.body;

      if (!githubUrl || !githubUrl.trim()) {
        throw ApiError.badRequest('GitHub repository URL is required for milestone submission');
      }

      const task = await PracticalTask.findOne({ nodeId });
      if (!task) {
        throw ApiError.notFound(`Practical task not found for node ID: ${nodeId}`);
      }

      const { user: updatedUser, taskSubmission, unlockedAchievements } =
        await ProgressService.submitTask(user, nodeId, githubUrl.trim(), liveUrl?.trim());

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          submission: taskSubmission,
          unlockedAchievements,
        },
        `🎉 Milestone project "${task.title}" submitted successfully!`
      );
    } catch (error) {
      next(error);
    }
  }
}
