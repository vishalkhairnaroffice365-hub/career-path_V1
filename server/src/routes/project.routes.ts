import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProjectStatusSchema } from '../validators/progress.validator.js';

const router = Router();

router.get('/', optionalAuth, ProjectController.getProjects);
router.post('/:projectId/status', requireAuth, validate(updateProjectStatusSchema), ProjectController.updateStatus);

export default router;
