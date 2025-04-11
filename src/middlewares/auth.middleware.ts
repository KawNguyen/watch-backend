import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check token from cookie first
    const cookieToken = req.cookies.accessToken;
    // Then check Authorization header
    const headerToken = req.headers.authorization?.split(' ')[1];
    
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};