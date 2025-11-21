import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';
import { authMiddleware } from '../middlewares/authMiddleware';

const workoutRoutes = Router();
const workoutController = new WorkoutController();

workoutRoutes.get('/my-workouts', authMiddleware, workoutController.getMyWorkouts);

export { workoutRoutes };