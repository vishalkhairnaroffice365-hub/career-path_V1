import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export class HealthController {
  static getHealth(_req: Request, res: Response) {
    const isDbConnected = mongoose.connection.readyState === 1;

    const healthData = {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      database: isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    };

    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Service Unavailable: Database disconnected',
        data: healthData,
      });
    }

    return ApiResponse.success(res, healthData, 'System is healthy');
  }
}
