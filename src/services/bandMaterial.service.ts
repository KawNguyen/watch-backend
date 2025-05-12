import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 20;

export class BandMaterialService {
  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [bandMaterials, total] = await Promise.all([
      prisma.bandMaterial.findMany({
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
      prisma.bandMaterial.count(),
    ]);

    return {
      status: 200,
      message: "Band materials fetched successfully",
      data: {
        items: bandMaterials,
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

    const [bandMaterials, total] = await Promise.all([
      prisma.bandMaterial.findMany({
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
      prisma.bandMaterial.count({
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
      message: "Band materials fetched successfully",
      data: {
        items: bandMaterials,
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
    const bandMaterial = await prisma.bandMaterial.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });

    if (!bandMaterial) {
      return {
        status: 404,
        message: "Band material not found",
      };
    }

    return {
      status: 200,
      message: "Band material fetched successfully",
      data: {
        item: bandMaterial,
      },
    };
  }

  async create(data: { name: string }) {
    const newBandMaterial = await prisma.bandMaterial.create({ data });

    return {
      status: 201,
      message: "Band material created successfully",
      data: {
        item: newBandMaterial,
      },
    };
  }

  async update(id: string, data: { name: string }) {
    const updated = await prisma.bandMaterial.update({
      where: { id },
      data,
    });

    return {
      status: 200,
      message: "Band material updated successfully",
      data: {
        item: updated,
      },
    };
  }

  async delete(id: string) {
    const deleted = await prisma.bandMaterial.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Band material deleted successfully",
      data: {
        item: deleted,
      },
    };
  }
}
