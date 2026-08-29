import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import domainRoutes from './domain.routes.js';
import careerRoutes from './career.routes.js';
import roadmapRoutes from './roadmap.routes.js';
import skillRoutes from './skill.routes.js';
import projectRoutes from './project.routes.js';
import resourceRoutes from './resource.routes.js';
import achievementRoutes from './achievement.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/domains', domainRoutes);
apiRouter.use('/careers', careerRoutes);
apiRouter.use('/roadmaps', roadmapRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/resources', resourceRoutes);
apiRouter.use('/achievements', achievementRoutes);

export default apiRouter;
