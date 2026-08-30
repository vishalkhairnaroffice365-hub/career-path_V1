import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, CourseController.getCourses);
router.get('/:nodeId', optionalAuth, CourseController.getCourseByNodeId);
router.post('/:nodeId/lessons/:lessonId/toggle', requireAuth, CourseController.toggleLesson);
router.post('/:nodeId/complete', requireAuth, CourseController.completeCourse);

export default router;
