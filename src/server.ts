import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/UserRoutes';
import { workoutRoutes } from './routes/WorkoutRoutes';
import { progressRoutes } from './routes/ProgressRoutes';
import { feedRoutes } from './routes/FeedRoutes';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feed', feedRoutes);

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

export default app;