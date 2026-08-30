import { Router } from 'express';
import { RoadmapController } from '../controllers/roadmap.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Get current user roadmap
router.get('/user/current', requireAuth, RoadmapController.getCurrentUserRoadmap);

// Complete node
router.post('/nodes/:nodeId/complete', requireAuth, RoadmapController.completeNode);

// Get roadmap by careerId
router.get('/:careerId', optionalAuth, RoadmapController.getRoadmapByCareerId);

export default router;
