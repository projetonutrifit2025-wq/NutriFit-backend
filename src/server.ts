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
app.use(express.json({ limit: '50mb' }));
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feed', feedRoutes);

app.get('/', (req, res) => {
  res.send(`
    <h1>Backend NutriFit Online 🚀</h1>
    <p>O servidor está a funcionar corretamente.</p>
    <p>Use os endpoints /api/users, /api/workouts, etc.</p>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

export default app;