import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import { authMiddleware } from '../middlewares/authMiddleware';

const feedRoutes = Router();
const feedController = new FeedController();

feedRoutes.post('/', authMiddleware, feedController.createPost);
feedRoutes.get('/', authMiddleware, feedController.getFeed);
feedRoutes.delete('/:id', authMiddleware, feedController.deletePost);
feedRoutes.get('/user/:id', authMiddleware, feedController.getUserPosts);
feedRoutes.post('/:id/like', authMiddleware, feedController.likePost);
feedRoutes.delete('/:id/like', authMiddleware, feedController.unlikePost);
feedRoutes.post('/:id/comment', authMiddleware, feedController.commentPost);
feedRoutes.get('/:id', authMiddleware, feedController.getPostDetails);

export { feedRoutes };