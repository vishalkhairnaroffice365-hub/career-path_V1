import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// All submission routes require authentication
router.post('/', requireAuth, SubmissionController.createSubmission);
router.get('/my', requireAuth, SubmissionController.getMySubmissions);
router.get('/:nodeId', requireAuth, SubmissionController.getSubmissionByNodeId);

export default router;
