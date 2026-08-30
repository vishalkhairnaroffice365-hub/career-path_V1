import { Router } from 'express';
import { AchievementController } from '../controllers/achievement.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, AchievementController.getAchievements);

export default router;
