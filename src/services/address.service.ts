import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AddressService {
  async create(userId: string, data: any) {
    return await prisma.address.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async findAllByUser(userId: string) {
    return await prisma.address.findMany({
      where: { userId }
    });
  }

  async findOne(id: string) {
    return await prisma.address.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: any) {
    return await prisma.address.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return await prisma.address.delete({
      where: { id }
    });
  }
}