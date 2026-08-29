import type { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200, meta?: Record<string, any>) {
    const payload: ApiResponseData<T> = {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
