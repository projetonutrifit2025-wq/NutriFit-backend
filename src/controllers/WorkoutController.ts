import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types/AuthRequest';

export class WorkoutController {
  async getMyWorkouts(req: AuthRequest, res: Response) {
    const userId = req.userId!;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { goal: true, level: true }
      });

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      const workouts = await prisma.workoutTemplate.findMany({
        where: { goal: user.goal, level: user.level },
        include: {
          exercises: {
            include: { exercise: true }
          }
        }
      });

      return res.status(200).json(workouts);
    } catch {
      return res.status(500).json({ error: 'Erro ao buscar treinos.' });
    }
  }
}