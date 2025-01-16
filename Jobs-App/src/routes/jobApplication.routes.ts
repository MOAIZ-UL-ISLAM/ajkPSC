import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as jobApplicationController from '../controllers/jobApplicationController';

const router = Router();

// All routes require authentication
router.use('/', authMiddleware);

router.post('/personal-info', jobApplicationController.createPersonalInfo);
router.post('/:applicationId/education', jobApplicationController.addEducation);
router.post('/:applicationId/experience', jobApplicationController.addExperience);
router.post('/:applicationId/submit', jobApplicationController.submitApplication);
router.get('/:applicationId', jobApplicationController.getApplication);

export default router;