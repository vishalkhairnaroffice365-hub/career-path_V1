import type { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.model.js';
import { ProgressService } from '../services/progress.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class CourseController {
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { domain } = req.query;
      const query = domain ? { domain } : {};
      const courses = await Course.find(query);

      return ApiResponse.success(res, courses, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCourseByNodeId(req: Request, res: Response, next: NextFunction) {
    try {
      const { nodeId } = req.params;
      const course = await Course.findOne({ nodeId });

      if (!course) {
        throw ApiError.notFound(`Course not found for node ID: ${nodeId}`);
      }

      const user = req.user;
      const progress = user?.learning?.courseProgress?.[nodeId] || null;

      return ApiResponse.success(
        res,
        {
          course,
          progress,
        },
        'Course retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async toggleLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId, lessonId } = req.params;
      const { completed } = req.body;

      const { user: updatedUser, courseProgress, unlockedAchievements } =
        await ProgressService.updateLessonProgress(
          user,
          nodeId,
          lessonId,
          completed !== undefined ? Boolean(completed) : true
        );

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          courseProgress,
          unlockedAchievements,
        },
        'Lesson progress updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async completeCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId } = req.params;

      const { user: updatedUser, unlockedAchievements } = await ProgressService.completeCourse(
        user,
        nodeId
      );

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          unlockedAchievements,
        },
        'Course completed successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}
