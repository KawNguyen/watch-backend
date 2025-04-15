import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 20;

export class WatchService {
  async create(data: any) {
    const { images, ...watchData } = data;
    return await prisma.watch.create({
      data: {
        ...watchData,
        images: {
          create: images,
        },
      },
      include: {
        brand: true,
        images: true,
      },
    });
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
          createdAt: 'desc'
        }
      }),
      prisma.watch.count()
    ]);

    return {
      items: watches,  // Changed from 'data' to 'items'
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize
      }
    };
  }

  async findOne(id: string) {
    return await prisma.watch.findUnique({
      where: { id },
      include: {
        brand: true,
        images: true,
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.watch.update({
      where: { id },
      data,
      include: {
        brand: true,
        images: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.watch.delete({
      where: { id },
    });
  }

  async search(query: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    brandId?: string;
    gender?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      name,
      minPrice,
      maxPrice,
      brandId,
      gender,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
    } = query;

    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (gender) {
      where.gender = gender;
    }

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          brand: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.watch.count({ where }),
    ]);

    return {
      items: watches,  // Changed from 'data' to 'items'
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }
}
