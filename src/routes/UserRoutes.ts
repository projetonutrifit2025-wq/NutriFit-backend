import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/:id/follow', authMiddleware, userController.followUser);
userRoutes.delete('/:id/unfollow', authMiddleware, userController.unfollowUser);

export { userRoutes };