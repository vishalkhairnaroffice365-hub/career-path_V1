import { Router } from 'express';
import { CareerController } from '../controllers/career.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { selectCareerSchema, compareCareerSchema } from '../validators/progress.validator.js';

const router = Router();

// Public / Optional Auth routes
router.get('/', optionalAuth, CareerController.getCareers);

// Comparison & Selection (Protected)
router.get('/compare', requireAuth, CareerController.getComparedCareers);
router.post('/compare', requireAuth, validate(compareCareerSchema), CareerController.addToCompare);
router.delete('/compare/:careerId', requireAuth, CareerController.removeFromCompare);
router.delete('/compare', requireAuth, CareerController.clearCompare);
router.post('/select', requireAuth, validate(selectCareerSchema), CareerController.selectCareer);
router.post('/deselect', requireAuth, CareerController.deselectCareer);

// Single career detail
router.get('/:id', optionalAuth, CareerController.getCareerById);

export default router;
