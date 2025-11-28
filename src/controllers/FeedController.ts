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
          author: { select: { id: true, name: true, profileImage: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: userId }, select: { userId: true } }
        }
      });

      const formattedPosts = posts.map(post => ({
        ...post,
        liked: post.likes.length > 0,
        likes: post._count.likes,
        comments: post._count.comments,
      }));

      return res.status(200).json(formattedPosts);
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

  async getUserPosts(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      const posts = await prisma.post.findMany({
        where: { authorId: id },
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, profileImage: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: userId }, select: { userId: true } }
        }
      });

      const formattedPosts = posts.map(post => ({
        ...post,
        liked: post.likes.length > 0,
        likes: post._count.likes,
        comments: post._count.comments
      }));

      return res.json(formattedPosts);
    } catch (error) {
      console.error('Get User Posts Error:', error);
      return res.status(500).json({ error: 'Erro ao buscar posts do usuário.' });
    }
  }

  async likePost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId: id
          }
        }
      });

      if (existingLike) {
        return res.status(400).json({ error: 'Post já curtido.' });
      }

      await prisma.like.create({
        data: {
          userId,
          postId: id
        }
      });

      return res.status(201).send();
    } catch (error) {
      console.error('Like Error:', error);
      return res.status(500).json({ error: 'Erro ao curtir post.' });
    }
  }

  async unlikePost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: id
          }
        }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(204).send();
    }
  }

  async commentPost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Conteúdo do comentário é obrigatório.' });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId,
          postId: id
        },
        include: {
          user: { select: { id: true, name: true, profileImage: true } }
        }
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error('Comment Error:', error);
      return res.status(500).json({ error: 'Erro ao comentar no post.' });
    }
  }

  async getPostDetails(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, profileImage: true } },
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: userId }, select: { userId: true } },
          comments: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: { select: { id: true, name: true, profileImage: true } }
            }
          }
        }
      });

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado.' });
      }

      const formattedPost = {
        ...post,
        liked: post.likes.length > 0,
        likes: post._count.likes,
        commentsCount: post._count.comments,
      };

      return res.json(formattedPost);
    } catch (error) {
      console.error('Get Post Details Error:', error);
      return res.status(500).json({ error: 'Erro ao buscar detalhes do post.' });
    }
  }
}