import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
      return
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
};