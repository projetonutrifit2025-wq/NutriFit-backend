import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { hash, compare } from 'bcryptjs';
import { calculateUserLevel } from '../services/UserService';
import { sign } from 'jsonwebtoken';
import { AuthRequest } from '../types/AuthRequest';
import { z, ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      console.log('Register Request Body:', req.body); // DEBUG

      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        birthDate: z.string(), // ISO string
        weight: z.number(),
        height: z.number(),
        goal: z.string(),
        profileImage: z.string().optional(),
      });

      const { name, email, password, birthDate, weight, height, goal, profileImage } = schema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) return res.status(400).json({ error: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 6);
      const birthDateObj = new Date(birthDate);

      if (isNaN(birthDateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid birthDate format' });
      }

      const level = calculateUserLevel(birthDateObj, weight, height);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          birthDate: birthDateObj,
          weight,
          height,
          goal,
          level,
          profileImage,
        },
      });

      // Registrar peso inicial
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          weight: user.weight,
        }
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

      return res.json({ user, token });
    } catch (error: any) {
      console.error('Register Error:', error); // DEBUG
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
      }
      return res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return res.status(400).json({ error: 'User not found' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  async followUser(req: AuthRequest, res: Response) {
    const followerId = req.userId!;
    const { id: followingId } = req.params;
    if (followerId === followingId) return res.status(400).json({ error: 'Não pode seguir a si mesmo.' });
    try {
      await prisma.follows.create({ data: { followerId, followingId } });
      return res.status(201).json({ message: 'Seguindo.' });
    } catch {
      return res.status(400).json({ error: 'Erro ao seguir.' });
    }
  }

  async unfollowUser(req: AuthRequest, res: Response) {
    const followerId = req.userId!;
    const { id: followingId } = req.params;
    try {
      await prisma.follows.delete({ where: { followerId_followingId: { followerId, followingId } } });
      return res.status(200).json({ message: 'Deixou de seguir.' });
    } catch {
      return res.status(400).json({ error: 'Erro ao deixar de seguir.' });
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      console.log('Me Endpoint - UserID:', userId); // DEBUG

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: { followers: true }
          }
        }
      });

      console.log('Me Endpoint - User Found:', user ? 'Yes' : 'No'); // DEBUG

      if (!user) return res.status(404).json({ error: 'User not found' });

      const treinos = await prisma.workoutTemplate.count({
        where: {
          goal: user.goal,
          level: user.level
        }
      });
      console.log('Me Endpoint - Treinos Count:', treinos); // DEBUG

      // Calcular idade
      const today = new Date();
      const birthDate = new Date(user.birthDate);
      console.log('Me Endpoint - BirthDate:', birthDate); // DEBUG

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      console.log('Me Endpoint - Calculated Age:', age); // DEBUG

      return res.json({
        ...user,
        age, // Retorna idade calculada para o frontend
        stats: {
          treinos,
          seguidores: user._count.followers,
          peso: `${user.weight}kg`
        }
      });
    } catch (error: any) {
      console.error('Me Endpoint Error:', error); // DEBUG
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { name, goal, height, birthDate, profileImage } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          goal,
          height: Number(height),
          birthDate: birthDate ? new Date(birthDate) : undefined,
          profileImage
        }
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating profile' });
    }
  }

  async addWeight(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { weight } = req.body;

      if (!weight) return res.status(400).json({ error: 'Weight is required' });

      const user = await prisma.user.update({
        where: { id: userId },
        data: { weight: Number(weight) }
      });

      await prisma.userProgress.create({
        data: {
          userId: userId!,
          weight: Number(weight)
        }
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error adding weight' });
    }
  }

  async getWeightHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const history = await prisma.userProgress.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      });

      return res.json(history);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching history' });
    }
  }
}