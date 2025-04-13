import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BrandService {
  async create(data: any) {
    return await prisma.brand.create({
      data,
    });
  }

  async findAll() {
    return await prisma.brand.findMany({
      include: {
        watches: {
          include: {
            material: true,
            bandMaterial: true,
            movement: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}
