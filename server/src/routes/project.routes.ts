import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, ProjectController.getProjects);
router.get('/search', optionalAuth, ProjectController.getProjects);
router.patch('/:projectId/status', requireAuth, ProjectController.updateStatus);

export default router;
