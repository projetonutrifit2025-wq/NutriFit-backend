import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types/AuthRequest';

export class ProgressController {
  async addProgress(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const { weight } = req.body;

    try {
      const newProgress = await prisma.userProgress.create({
        data: { weight: Number(weight), userId }
      });
      return res.status(201).json(newProgress);
    } catch {
      return res.status(500).json({ error: 'Erro ao salvar progresso.' });
    }
  }

  async getProgressHistory(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const history = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(history);
  }
}