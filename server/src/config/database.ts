import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

// Configure reliable DNS servers for MongoDB Atlas SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Graceful fallback if environment restricts DNS configuration
}

export async function connectDatabase(): Promise<typeof mongoose> {
  const uri = env.MONGODB_URI;

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ Successfully connected to MongoDB Atlas database');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', { message: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB connection lost. Reconnecting...');
    });

    return connection;
  } catch (error: any) {
    logger.error('❌ Failed to connect to MongoDB:', {
      message: error.message,
    });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed successfully');
  }
}
