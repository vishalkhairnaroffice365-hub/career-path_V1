import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Recommendations require authenticated user profile
router.use(requireAuth);

router.get('/', RecommendationController.getRecommendations);
router.get('/explain/:careerId', RecommendationController.explainCareer);

export default router;
