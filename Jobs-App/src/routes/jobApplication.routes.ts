import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as jobApplicationController from '../controllers/jobApplicationController';

const router = Router();

// All routes require authentication
// router.use('/', authMiddleware);

router.post('/personal-info', authMiddleware,jobApplicationController.createPersonalInfo);
router.post('/:applicationId/education',authMiddleware, jobApplicationController.addEducation);
router.post('/:applicationId/experience',authMiddleware, jobApplicationController.addExperience);
router.post('/:applicationId/submit', authMiddleware, jobApplicationController.submitApplication);
router.get('/:applicationId',authMiddleware, jobApplicationController.getApplication);

export default router;