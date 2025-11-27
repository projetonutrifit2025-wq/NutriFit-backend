import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/:id/follow', authMiddleware, userController.followUser);
userRoutes.delete('/:id/unfollow', authMiddleware, userController.unfollowUser);
userRoutes.get('/me', authMiddleware, userController.me);
userRoutes.put('/me', authMiddleware, userController.updateProfile);
userRoutes.post('/weight', authMiddleware, userController.addWeight);
userRoutes.get('/weight/history', authMiddleware, userController.getWeightHistory);

export { userRoutes };