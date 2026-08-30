import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:nodeId', optionalAuth, AssessmentController.getAssessmentByNodeId);
router.post('/:nodeId/submit', requireAuth, AssessmentController.submitAssessment);

export default router;
