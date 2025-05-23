import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 20;

export class BrandService {
  async create(data: any) {
    const existingBrand = await prisma.brand.findUnique({
      where: { name: data.name },
    });

    if (existingBrand) {
      return {
        status: 400,
        message: "Brand name already exists",
        data: null,
      };
    }

    const brand = await prisma.brand.create({ data });

    return {
      status: 201,
      message: "Brand created successfully",
      data: brand,
    };
  }

  async findAll(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          slug:true,
          name: true,
          country: true,
          logo: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.count(),
    ]);

    return {
      status: 200,
      message: "Brand list fetched successfully",
      data: {
        items: brands,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        itemsPerPage: limit,
      },
    };
  }

  async search(filters: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = DEFAULT_PAGE_SIZE } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (name) {
      where.OR = [
        {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      ];
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          code: true,
          name: true,
          country: true,
          logo: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.count({ where }),
    ]);

    return {
      status: 200,
      message: "Brands searched successfully",
      data: {
        items: brands,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });

    if (!brand) {
      return {
        status: 404,
        message: "Brand not found",
      };
    }

    return {
      status: 200,
      message: "Brand fetched successfully",
      data: brand,
    };
  }

  async update(id: string, data: any) {
    const brand = await prisma.brand.update({
      where: { id },
      data,
    });

    return {
      status: 200,
      message: "Brand updated successfully",
      data: brand,
    };
  }

  async delete(id: string) {
    const brand = await prisma.brand.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Brand deleted successfully",
      data: brand,
    };
  }
}
