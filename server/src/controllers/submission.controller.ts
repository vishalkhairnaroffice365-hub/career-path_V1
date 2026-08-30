import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Submission, type SubmissionType } from '../models/Submission.model.js';
import { ProgressService } from '../services/progress.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class SubmissionController {
  /**
   * Submit a coding challenge or practical task
   */
  static async createSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { nodeId, careerId, type, githubUrl, liveUrl, notes, fileName, fileData, fileSize, score } = req.body;

      if (!nodeId || !type || !githubUrl) {
        throw ApiError.badRequest('nodeId, type, and githubUrl are required fields');
      }

      // Validate GitHub URL format
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i;
      if (!githubRegex.test(githubUrl.trim())) {
        throw ApiError.badRequest('Invalid GitHub repository URL. Must be in format https://github.com/username/repository');
      }

      const randomSuffix = crypto.randomBytes(4).toString('hex');
      const submissionId = `sub_${Date.now()}_${randomSuffix}`;
      const submission = await Submission.create({
        id: submissionId,
        userId: user._id || user.id,
        userEmail: user.email,
        nodeId,
        careerId: careerId || user.selectedCareerId,
        type: type as SubmissionType,
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl ? liveUrl.trim() : undefined,
        notes: notes ? notes.trim() : undefined,
        fileName: fileName ? fileName.trim() : undefined,
        fileData: fileData || undefined,
        fileSize: fileSize || undefined,
        score: score !== undefined ? score : 100,
        status: 'submitted',
        submittedAt: new Date(),
      });

      // Update user learning state
      if (type === 'practical-task') {
        await ProgressService.submitTask(user, nodeId, githubUrl.trim(), liveUrl?.trim());
      } else if (type === 'coding-challenge') {
        await ProgressService.recordCodingScore(user, nodeId, score !== undefined ? score : 85);
      }

      return ApiResponse.created(
        res,
        {
          submission,
        },
        'Submission created successfully! Milestone recorded.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all submissions by the authenticated user
   */
  static async getMySubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const userId = user._id || user.id;

      const submissions = await Submission.find({
        $or: [{ userId }, { userEmail: user.email }],
      }).sort({ submittedAt: -1 });

      return ApiResponse.success(
        res,
        {
          submissions,
          total: submissions.length,
        },
        'User submissions retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get authenticated user's submission for a specific roadmap node
   */
  static async getSubmissionByNodeId(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const userId = user._id || user.id;
      const { nodeId } = req.params;

      const submission = await Submission.findOne({
        nodeId,
        $or: [{ userId }, { userEmail: user.email }],
      }).sort({ submittedAt: -1 });

      return ApiResponse.success(
        res,
        {
          submission: submission || null,
        },
        'Node submission retrieved'
      );
    } catch (error) {
      next(error);
    }
  }
}
