import type { Request, Response, NextFunction } from 'express';
import { Domain } from '../models/Domain.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class DomainController {
  static async getDomains(_req: Request, res: Response, next: NextFunction) {
    try {
      const domains = await Domain.find().sort({ name: 1 });
      return ApiResponse.success(res, domains, 'Domains retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDomainById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const domain = await Domain.findOne({ id });

      if (!domain) {
        throw ApiError.notFound(`Domain not found with ID: ${id}`);
      }

      return ApiResponse.success(res, domain, 'Domain retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
