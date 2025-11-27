import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types/AuthRequest';
import { z } from 'zod';

export class FeedController {
  async createPost(req: AuthRequest, res: Response) {
    const schema = z.object({
      imageUrl: z.string(),
      caption: z.string().optional(),
    });

    try {
      const { imageUrl, caption } = schema.parse(req.body);
      const userId = req.userId!;

      const post = await prisma.post.create({
        data: { imageUrl, caption, authorId: userId }
      });
      return res.status(201).json(post);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Erro ao criar post.' });
    }
  }

  async getFeed(req: AuthRequest, res: Response) {
    const userId = req.userId!;
    const page = Number(req.query.page) || 1;
    const take = 10;
    const skip = (page - 1) * take;

    try {
      const following = await prisma.follows.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });

      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Inclui o próprio usuário

      const posts = await prisma.post.findMany({
        where: { authorId: { in: followingIds } },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } }
        }
      });

      return res.status(200).json(posts);
    } catch {
      return res.status(500).json({ error: 'Erro ao carregar feed.' });
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado.' });
      }

      if (post.authorId !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para deletar este post.' });
      }

      await prisma.post.delete({ where: { id } });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar post.' });
    }
  }
}