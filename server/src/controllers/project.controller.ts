import type { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ProgressService } from '../services/progress.service.js';

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { careerId, difficulty } = req.query;
      const query: Record<string, any> = {};

      if (careerId) query.careerIds = careerId;
      if (difficulty) query.difficulty = difficulty;

      const projects = await Project.find(query).sort({ phase: 1 });
      const user = req.user;

      const enhanced = projects.map((project) => {
        const json: any = project.toJSON();
        if (user) {
          const isCompleted = user.progress.completedProjectIds.includes(project.id);
          json.status = isCompleted ? 'completed' : project.status;
        }
        return json;
      });

      return ApiResponse.success(res, enhanced, 'Projects retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { projectId } = req.params;
      const { status, githubUrl, liveUrl } = req.body;

      const project = await Project.findOne({ id: projectId });
      if (!project) {
        throw ApiError.notFound(`Project not found with ID: ${projectId}`);
      }

      if (githubUrl !== undefined) project.githubUrl = githubUrl;
      if (liveUrl !== undefined) project.liveUrl = liveUrl;
      await project.save();

      const { user: updatedUser, unlockedAchievements } = await ProgressService.updateProjectStatus(
        user,
        projectId,
        status
      );

      return ApiResponse.success(
        res,
        {
          project,
          user: updatedUser,
          unlockedAchievements,
        },
        `Project status updated to ${status}`
      );
    } catch (error) {
      next(error);
    }
  }
}
