import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PAGE_SIZE = 20;

export class MaterialService {
  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.material.count(),
    ]);

    return {
      status: 200,
      message: "Materials fetched successfully",
      data: {
        items: materials,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async search(name: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        skip,
        take: pageSize,
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.material.count({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      }),
    ]);

    return {
      status: 200,
      message: "Materials searched successfully",
      data: {
        items: materials,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async findOne(id: string) {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });

    if (!material) {
      return {
        status: 404,
        message: "Material not found",
      };
    }

    return {
      status: 200,
      message: "Material fetched successfully",
      data: {
        item: material,
      },
    };
  }

  async create(data: { name: string }) {
    const newMaterial = await prisma.material.create({
      data,
    });

    return {
      status: 201,
      message: "Material created successfully",
      data: {
        item: newMaterial,
      },
    };
  }

  async update(id: string, data: { name: string }) {
    const updatedMaterial = await prisma.material.update({
      where: { id },
      data,
    });

    return {
      status: 200,
      message: "Material updated successfully",
      data: {
        item: updatedMaterial,
      },
    };
  }

  async delete(id: string) {
    const deletedMaterial = await prisma.material.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Material deleted successfully",
      data: {
        item: deletedMaterial,
      },
    };
  }
}
