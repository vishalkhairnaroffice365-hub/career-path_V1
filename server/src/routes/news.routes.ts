import { Router } from 'express';
import { NewsController } from '../controllers/news.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, NewsController.getNews);

export default router;
