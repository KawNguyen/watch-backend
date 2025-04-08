import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserLogin, IUserRegister } from '../@types/user.types';

const prisma = new PrismaClient();

export class AuthService {
  async register(userData: IUserRegister) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: (userData as any).name,
        email: userData.email,
        password: hashedPassword,
        role: {
          connect: {
            name: "CUSTOMER"  
          }
        }
      }
    });

    return { ...user, password: undefined };
  }

  async login(credentials: IUserLogin) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.roleId },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return { token, user: { ...user, password: undefined } };
  }
}