import { PrismaClient, WatchGender } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 20;

export class WatchService {
  async create(data: any) {
    const { images, gender, ...watchData } = data;

    const newWatch = await prisma.watch.create({
      data: {
        ...watchData,
        gender: gender as WatchGender,
        images: {
          create: images,
        },
      },
      include: {
        brand: true,
        images: true,
      },
    });

    return {
      status: 201,
      message: "Watch created successfully",
      data: {
        item: newWatch,
      },
    };
  }

  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        skip,
        take: pageSize,
        include: {
          brand: true,
          material: true,
          bandMaterial: true,
          movement: true,
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.watch.count(),
    ]);

    return {
      status: 200,
      message: "Watches fetched successfully",
      data: {
        items: watches,
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
    const watch = await prisma.watch.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        brand: true,
        bandMaterial: true,
        material: true,
        movement: true,
        description: true,
        gender: true,
        diameter: true,
        warranty: true,
        waterResistance: true,
        price: true,
        videoUrl: true,
        images: true,
      },
    });

    if (!watch) {
      return {
        status: 404,
        message: "Watch not found",
      };
    }

    return {
      status: 200,
      message: "Watch fetched successfully",
      data: {
        item: watch,
      },
    };
  }

  async update(id: string, data: any) {
    const updated = await prisma.watch.update({
      where: { id },
      data,
      include: {
        brand: true,
        material: true,
        bandMaterial: true,
        movement: true,
        images: true,
      },
    });

    return {
      status: 200,
      message: "Watch updated successfully",
      data: {
        item: updated,
      },
    };
  }

  async delete(id: string) {
    await prisma.image.deleteMany({
      where: { watchId: id },
    });

    const deleted = await prisma.watch.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Watch deleted successfully",
      data: {
        item: deleted,
      },
    };
  }

  async search(filters: {
    name?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      name,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = filters;

    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (name) {
      where.OR = [
        {
          name: {
            contains: name,
            mode: 'insensitive',
          }
        },
        {
          brand: {
            name: {
              contains: name,
              mode: 'insensitive',
            }
          }
        }
      ];
    }

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          code: true,
          name: true,
          brand: true,
          bandMaterial: true,
          material: true,
          movement: true,
          description: true,
          gender: true,
          diameter: true,
          warranty: true,
          waterResistance: true,
          price: true,
          videoUrl: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.watch.count({ where }),
    ]);

    return {
      status: 200,
      message: "Watches searched successfully",
      data: {
        items: watches,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async getWatchesByBrand(brandId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where: {
          brandId: brandId,
        },
        skip,
        take: pageSize,
        include: {
          brand: true,
          material: true,
          bandMaterial: true,
          movement: true,
          images: true,
          quantities: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.watch.count({
        where: {
          brandId: brandId,
        },
      }),
    ]);

    return {
      status: 200,
      message: "Watches by brand fetched successfully",
      data: {
        items: watches,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }
}
