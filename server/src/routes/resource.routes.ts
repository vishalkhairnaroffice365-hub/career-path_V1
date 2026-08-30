import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, ResourceController.getResources);
router.post('/:resourceId/complete', requireAuth, ResourceController.completeResource);

export default router;
