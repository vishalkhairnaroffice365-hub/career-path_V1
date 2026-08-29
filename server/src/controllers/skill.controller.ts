import type { Request, Response, NextFunction } from 'express';
import { Skill } from '../models/Skill.model.js';
import { Career } from '../models/Career.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ScoringService } from '../services/scoring.service.js';

export class SkillController {
  static async getSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const query = category ? { category } : {};
      const skills = await Skill.find(query).sort({ name: 1 });

      return ApiResponse.success(res, skills, 'Skills retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getSkillGap(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { careerId } = req.params;

      const career = await Career.findOne({ id: careerId });
      if (!career) {
        throw ApiError.notFound(`Career not found with ID: ${careerId}`);
      }

      const gapAnalysis = await ScoringService.calculateSkillGap(user, career);
      return ApiResponse.success(res, gapAnalysis, 'Skill gap analysis computed successfully');
    } catch (error) {
      next(error);
    }
  }
}
