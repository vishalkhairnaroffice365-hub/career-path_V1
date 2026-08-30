import type { Request, Response, NextFunction } from 'express';
import { Career } from '../models/Career.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { ScoringService } from '../services/scoring.service.js';
import { ProgressService } from '../services/progress.service.js';

export class CareerController {
  static async getCareers(req: Request, res: Response, next: NextFunction) {
    try {
      const { domainId, subDomainId } = req.query;
      const query: Record<string, any> = {};

      if (domainId) query.domainId = domainId;
      if (subDomainId) query.subDomainId = subDomainId;

      const careers = await Career.find(query);
      const user = req.user;

      // Enhance with personalized matchScore if user onboarding data exists
      const enhancedCareers = careers.map((career) => {
        const json: any = career.toJSON();
        if (user && user.onboardingData) {
          json.matchScore = ScoringService.calculateCareerMatchScore(career, user.onboardingData);
        } else {
          json.matchScore = career.defaultMatchScore;
        }
        return json;
      });

      return ApiResponse.success(res, enhancedCareers, 'Careers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCareerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const career = await Career.findOne({ id });

      if (!career) {
        throw ApiError.notFound(`Career not found with ID: ${id}`);
      }

      const json: any = career.toJSON();
      if (req.user && req.user.onboardingData) {
        json.matchScore = ScoringService.calculateCareerMatchScore(career, req.user.onboardingData);
      } else {
        json.matchScore = career.defaultMatchScore;
      }

      return ApiResponse.success(res, json, 'Career retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async selectCareer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { careerId } = req.body;

      const career = await Career.findOne({ id: careerId });
      if (!career) {
        throw ApiError.notFound(`Career not found with ID: ${careerId}`);
      }

      user.selectedCareerId = careerId;
      user.stats.careerReadinessScore = await ScoringService.calculateCareerReadinessScore(user);

      const unlocked = ProgressService.checkAchievements(user);
      await user.save();

      return ApiResponse.success(
        res,
        {
          selectedCareer: career,
          user,
          unlockedAchievements: unlocked,
        },
        `Selected ${career.title} as active career path`
      );
    } catch (error) {
      next(error);
    }
  }

  static async deselectCareer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      user.selectedCareerId = null;
      await user.save();

      return ApiResponse.success(res, user, 'Deselected active career path');
    } catch (error) {
      next(error);
    }
  }

  static async getComparedCareers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const comparedIds = user.comparedCareerIds || [];
      const careers = await Career.find({ id: { $in: comparedIds } });

      const enhanced = careers.map((career) => {
        const json: any = career.toJSON();
        if (user.onboardingData) {
          json.matchScore = ScoringService.calculateCareerMatchScore(career, user.onboardingData);
        }
        return json;
      });

      return ApiResponse.success(res, enhanced, 'Compared careers retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async addToCompare(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { careerId } = req.body;

      const career = await Career.findOne({ id: careerId });
      if (!career) {
        throw ApiError.notFound(`Career not found with ID: ${careerId}`);
      }

      if (user.comparedCareerIds.length >= 3) {
        throw ApiError.badRequest('You can compare a maximum of 3 careers at once.');
      }

      if (!user.comparedCareerIds.includes(careerId)) {
        user.comparedCareerIds.push(careerId);
        await user.save();
      }

      const comparedCareers = await Career.find({ id: { $in: user.comparedCareerIds } });
      return ApiResponse.success(res, comparedCareers, `${career.title} added to comparison`);
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCompare(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { careerId } = req.params;

      user.comparedCareerIds = user.comparedCareerIds.filter((id) => id !== careerId);
      await user.save();

      const comparedCareers = await Career.find({ id: { $in: user.comparedCareerIds } });
      return ApiResponse.success(res, comparedCareers, 'Career removed from comparison');
    } catch (error) {
      next(error);
    }
  }

  static async clearCompare(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      user.comparedCareerIds = [];
      await user.save();

      return ApiResponse.success(res, [], 'Comparison list cleared');
    } catch (error) {
      next(error);
    }
  }
}
