import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedDatabase } from '../services/seed.service.js';
import { logger } from '../config/logger.js';

async function runSeed() {
  try {
    await connectDatabase();
    const result = await seedDatabase();
    logger.info('Seed Summary:', result);
    await disconnectDatabase();
    process.exit(0);
  } catch (error: any) {
    logger.error('Database seeding failed:', { message: error.message, stack: error.stack });
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
}

runSeed();
