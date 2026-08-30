import { Router } from 'express';
import { DomainController } from '../controllers/domain.controller.js';

const router = Router();

router.get('/', DomainController.getDomains);
router.get('/:id', DomainController.getDomainById);

export default router;
