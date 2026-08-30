import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './config/logger.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { requestIdMiddleware, mongoSanitizeMiddleware } from './middlewares/security.middleware.js';

const app: Express = express();

// 1. Request tracing & Security HTTP headers
app.use(requestIdMiddleware);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS configuration
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request parsing & NoSQL Sanitization
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitizeMiddleware);

// 4. Request logging
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// 5. Rate limiting
app.use('/api', apiRateLimiter);

// 6. Mount REST API Version 1
app.use('/api/v1', apiRouter);

// 7. Fallback for unhandled routes
app.use(notFoundHandler);

// 8. Centralized error handling middleware
app.use(errorHandler);

// Server startup & graceful shutdown
let server: any;

async function startServer() {
  try {
    // Connect to MongoDB Atlas
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📡 API endpoint: http://localhost:${env.PORT}/api/v1`);
      logger.info(`🩺 Health check: http://localhost:${env.PORT}/api/v1/health`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error: any) {
    logger.error('❌ Failed to start server:', { message: error.message });
    process.exit(1);
  }
}

// Graceful shutdown handling
async function handleShutdown(signal: string) {
  logger.info(`⚠️ Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
    });
  }

  try {
    await disconnectDatabase();
    logger.info('Graceful shutdown completed successfully.');
    process.exit(0);
  } catch (err: any) {
    logger.error('Error during shutdown:', { message: err.message });
    process.exit(1);
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
