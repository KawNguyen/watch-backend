import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    // Add debug logs to check the request object
    console.log('Request user:', (req as any).user);
    console.log('Request headers:', req.headers);

    const userId = (req as any).user?.id;

    if (!userId) {
      console.log('No user ID found in request');
      res.status(403).json({ message: 'Access denied - No user ID' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('Found user:', user);

    if (!user) {
      console.log('No user found in database');
      res.status(403).json({ message: 'Access denied - User not found' });
      return;
    }

    if (user.role !== 'ADMIN') {
      console.log(`User role: ${user.role}`);
      res.status(403).json({ message: `Access denied. Admin rights required. Current role: ${user.role}` });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({ message: 'Access denied - Server error' });
    return;
  }
};