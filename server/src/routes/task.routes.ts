import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:nodeId', optionalAuth, TaskController.getTaskByNodeId);
router.post('/:nodeId/start', requireAuth, TaskController.startTask);
router.post('/:nodeId/submit', requireAuth, TaskController.submitTask);

export default router;
