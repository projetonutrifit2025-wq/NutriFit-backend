import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { hash, compare } from 'bcryptjs';
import { calculateUserLevel } from '../services/UserService';
import { sign } from 'jsonwebtoken';
import { AuthRequest } from '../types/AuthRequest';
import { z, ZodError } from 'zod'; // Importe ZodError

export class UserController {
  
  async register(req: Request, res: Response) {
    const registerSchema = z.object({
      name: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
      age: z.number().min(12, "Idade mínima é 12 anos"),
      weight: z.number().positive("Peso deve ser positivo"),
      height: z.number().positive("Altura deve ser positiva"),
      goal: z.enum(["PERDER_PESO", "GANHAR_MASSA", "MANTER_SAUDE"]),
    });

    try {
      const data = registerSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email: data.email } });
      if (userExists) return res.status(400).json({ error: 'E-mail já cadastrado.' });

      const passwordHash = await hash(data.password, 8);
      const level = calculateUserLevel(data.age, data.weight, data.height);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: passwordHash,
          level: level,
          goal: data.goal
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);

    } catch (error: any) {
      // CORREÇÃO DO ERRO DO ZOD AQUI:
      if (error instanceof ZodError) {
        // Usamos .issues[0].message em vez de .errors
        return res.status(400).json({ error: error.issues[0].message });
      }
      // Log do erro real para ajudar no debug
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token });
  }

  async followUser(req: AuthRequest, res: Response) {
    const followerId = req.userId!;
    const { id: followingId } = req.params;

    if (followerId === followingId) return res.status(400).json({ error: 'Não pode seguir a si mesmo.' });

    try {
      await prisma.follows.create({
        data: { followerId, followingId }
      });
      return res.status(201).json({ message: 'Seguindo.' });
    } catch {
      return res.status(400).json({ error: 'Erro ao seguir.' });
    }
  }

  async unfollowUser(req: AuthRequest, res: Response) {
    const followerId = req.userId!;
    const { id: followingId } = req.params;

    try {
      await prisma.follows.delete({
        where: { followerId_followingId: { followerId, followingId } }
      });
      return res.status(200).json({ message: 'Deixou de seguir.' });
    } catch {
      return res.status(400).json({ error: 'Erro ao deixar de seguir.' });
    }
  }
}