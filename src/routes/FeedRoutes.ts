import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import { authMiddleware } from '../middlewares/authMiddleware';

const feedRoutes = Router();
const feedController = new FeedController();

feedRoutes.post('/', authMiddleware, feedController.createPost);
feedRoutes.get('/', authMiddleware, feedController.getFeed);

export { feedRoutes };