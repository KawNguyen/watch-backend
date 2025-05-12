import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PAGE_SIZE = 20;

export class MovementService {
  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [movements, total] = await Promise.all([
      prisma.movement.findMany({
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
      prisma.movement.count(),
    ]);

    return {
      status: 200,
      message: "Movements fetched successfully",
      data: {
        items: movements,
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

    const [movements, total] = await Promise.all([
      prisma.movement.findMany({
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
      prisma.movement.count({
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
      message: "Movements searched successfully",
      data: {
        items: movements,
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
    const movement = await prisma.movement.findUnique({
      where: { id },
    });

    if (!movement) {
      return {
        status: 404,
        message: "Movement not found",
      };
    }

    return {
      status: 200,
      message: "Movement fetched successfully",
      data: {
        item: movement,
      },
    };
  }

  async create(data: { name: string }) {
    const newMovement = await prisma.movement.create({
      data,
    });

    return {
      status: 201,
      message: "Movement created successfully",
      data: {
        item: newMovement,
      },
    };
  }

  async update(id: string, data: { name: string }) {
    const updatedMovement = await prisma.movement.update({
      where: { id },
      data,
    });

    return {
      status: 200,
      message: "Movement updated successfully",
      data: {
        item: updatedMovement,
      },
    };
  }

  async delete(id: string) {
    const deletedMovement = await prisma.movement.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Movement deleted successfully",
      data: {
        item: deletedMovement,
      },
    };
  }
}
