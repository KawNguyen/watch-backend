import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 10;

export class QuantityService {
  async findAll(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [quantities, total] = await Promise.all([
      prisma.quantity.findMany({
        skip,
        take: limit,
        include: {
          watch: {
            include: {
              brand: true,
              images: true,
              movement:true,
              material:true,
              bandMaterial:true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.quantity.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Quantities fetched successfully",
      data: {
        items: quantities
      },
      meta: {
        total,
        page,
        totalPages,
        lastPage: totalPages,
        itemsPerPage: limit
      }
    };
  }

  async findOne(id: string) {
    const quantity = await prisma.quantity.findUnique({
      where: { id },
      include: {
        watch: {
          include: {
            brand: true,
            images: true
          }
        }
      }
    });

    if (!quantity) {
      return {
        status: 404,
        message: "Quantity not found"
      };
    }

    return {
      status: 200,
      message: "Quantity fetched successfully",
      data: {
        item: quantity
      }
    };
  }

  async findByWatch(watchId: string) {
    const quantity = await prisma.quantity.findFirst({
      where: { watchId },
      include: {
        watch: {
          include: {
            brand: true,
            images: true
          }
        }
      }
    });

    if (!quantity) {
      return {
        status: 404,
        message: "Quantity not found for this watch"
      };
    }

    return {
      status: 200,
      message: "Quantity fetched successfully",
      data: {
        item: quantity
      }
    };
  }

  async search(filters: {
    search?: string;
    minQuantity?: number;
    maxQuantity?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      minQuantity,
      maxQuantity,
      page = 1,
      limit = DEFAULT_PAGE_SIZE
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.watch = {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            brand: {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }
          }
        ]
      };
    }

    if (minQuantity !== undefined) {
      where.quantity = {
        ...where.quantity,
        gte: minQuantity
      };
    }

    if (maxQuantity !== undefined) {
      where.quantity = {
        ...where.quantity,
        lte: maxQuantity
      };
    }

    const [quantities, total] = await Promise.all([
      prisma.quantity.findMany({
        where,
        skip,
        take: limit,
        include: {
          watch: {
            include: {
              brand: true,
              images: true,
              movement:true,
              material:true,
              bandMaterial:true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.quantity.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Quantities searched successfully",
      data: {
        items: quantities
      },
      meta: {
        total,
        page,
        totalPages,
        lastPage: totalPages,
        itemsPerPage: limit
      }
    };
  }
}