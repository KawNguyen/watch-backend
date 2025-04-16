import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MaterialService {
  async findAll() {
    return await prisma.material.findMany({
      include: {
        watches: true,
      },
    });
  }

  async findOne(id: string) {
    return await prisma.material.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });
  }

  async create(data: { name: string }) {
    return await prisma.material.create({
      data,
    });
  }

  async update(id: string, data: { name: string }) {
    return await prisma.material.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.material.delete({
      where: { id },
    });
  }
}
