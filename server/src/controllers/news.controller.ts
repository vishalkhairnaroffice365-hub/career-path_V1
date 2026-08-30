import type { Request, Response, NextFunction } from 'express';
import { News } from '../models/News.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class NewsController {
  static async getNews(req: Request, res: Response, next: NextFunction) {
    try {
      const { careerId, domain } = req.query;
      const query: Record<string, any> = {};

      if (careerId) {
        query.careerIds = careerId;
      }

      let news = await News.find(query).sort({ publishedAt: -1 });

      // Fallback to general news if no career-specific news
      if (news.length === 0 && careerId) {
        news = await News.find().sort({ publishedAt: -1 }).limit(6);
      }

      return ApiResponse.success(res, news, 'Industry tech news retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
