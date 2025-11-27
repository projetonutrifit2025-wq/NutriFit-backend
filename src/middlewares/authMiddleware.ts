import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthRequest } from '../types/AuthRequest';

interface TokenPayload {
  id: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não enviado.' });
  }

  const [, token] = authorization.split(' ');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido');

    const decoded = verify(token, secret);
    const { id } = decoded as TokenPayload;

    req.userId = id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}