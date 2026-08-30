import { Router } from 'express';
import { CodingChallengeController } from '../controllers/codingChallenge.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:nodeId', optionalAuth, CodingChallengeController.getChallengeByNodeId);
router.post('/:nodeId/run', requireAuth, CodingChallengeController.runCode);
router.post('/:nodeId/submit', requireAuth, CodingChallengeController.submitSolution);

export default router;
