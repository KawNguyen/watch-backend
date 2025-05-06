import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(403).json({ message: "Access denied - No user ID" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(403).json({ message: "Access denied - User not found" });
      return;
    }

    if (user.role !== "ADMIN") {
      res.status(403).json({
        message: `Access denied. Admin rights required. Current role: ${user.role}`,
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(403).json({ message: "Access denied - Server error" });
    return;
  }
};
