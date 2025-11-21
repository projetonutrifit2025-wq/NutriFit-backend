import { Router } from 'express';
import { ProgressController } from '../controllers/ProgressController';
import { authMiddleware } from '../middlewares/authMiddleware';

const progressRoutes = Router();
const progressController = new ProgressController();

progressRoutes.post('/', authMiddleware, progressController.addProgress);
progressRoutes.get('/', authMiddleware, progressController.getProgressHistory);

export { progressRoutes };