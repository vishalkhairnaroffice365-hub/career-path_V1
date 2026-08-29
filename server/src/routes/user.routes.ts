import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema, onboardingSchema } from '../validators/user.validator.js';

const router = Router();

// All user routes are protected
router.use(requireAuth);

router.get('/me', UserController.getProfile);
router.get('/profile', UserController.getProfile);
router.put('/me', validate(updateProfileSchema), UserController.updateProfile);
router.put('/profile', validate(updateProfileSchema), UserController.updateProfile);
router.post('/onboarding', validate(onboardingSchema), UserController.saveOnboarding);
router.post('/onboarding/complete', UserController.completeOnboarding);
router.get('/progress', UserController.getProgress);

export default router;
