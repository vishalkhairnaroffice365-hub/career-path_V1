import type { Request, Response, NextFunction } from 'express';
import { Career } from '../models/Career.model.js';
import { AIRecommendationService } from '../services/aiRecommendation.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class RecommendationController {
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const careers = await Career.find();

      const recommendations = AIRecommendationService.computeRecommendations(user, careers);

      return ApiResponse.success(
        res,
        recommendations,
        'Personalized AI career recommendations generated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async explainCareer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { careerId } = req.params;

      const career = await Career.findOne({ id: careerId });
      if (!career) {
        throw ApiError.notFound(`Career not found with ID: ${careerId}`);
      }

      const explanation = await AIRecommendationService.explainCareerFit(user, career);

      return ApiResponse.success(
        res,
        explanation,
        `AI Fit explanation for ${career.title} generated successfully`
      );
    } catch (error) {
      next(error);
    }
  }
}
