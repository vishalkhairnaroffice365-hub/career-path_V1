import { Router } from 'express';
import { SkillController } from '../controllers/skill.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', SkillController.getSkills);
router.get('/gap/:careerId', requireAuth, SkillController.getSkillGap);

export default router;
