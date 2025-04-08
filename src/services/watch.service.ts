import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WatchService {
  async create(data: any) {
    const { images, ...watchData } = data;
    
    return await prisma.watch.create({
      data: {
        ...watchData,
        images: {
          create: images
        }
      },
      include: {
        brand: true,
        images: true
      }
    });
  }
  
  async findAll() {
    return await prisma.watch.findMany({
      include: {
        brand: true,
        images: true
      }
    });
  }

  async findOne(id: string) {
    return await prisma.watch.findUnique({
      where: { id },
      include: {
        brand: true,
        images: true
      }
    });
  }

  async update(id: string, data: any) {
    return await prisma.watch.update({
      where: { id },
      data,
      include: {
        brand: true,
        images: true
      }
    });
  }

  async delete(id: string) {
    return await prisma.watch.delete({
      where: { id }
    });
  }
}