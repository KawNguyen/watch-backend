import { PrismaClient, WatchGender } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 12;

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

  // async findAll(page = 1, limit = DEFAULT_PAGE_SIZE) {
  //   const skip = (page - 1) * limit;

  //   const [watches, total] = await Promise.all([
  //     prisma.watch.findMany({
  //       skip,
  //       take: limit,
  //       include: {
  //         brand: true,
  //         material: true,
  //         bandMaterial: true,
  //         movement: true,
  //         images: true,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     }),
  //     prisma.watch.count(),
  //   ]);

  //   const totalPages = Math.ceil(total / limit);

  //   return {
  //     status: 200,
  //     message: "Watches fetched successfully",
  //     data: {
  //       items: watches,
  //     },
  //     meta: {
  //       total,
  //       page,
  //       totalPages,
  //       lastPage: totalPages,
  //       itemsPerPage: limit,
  //     },
  //   };
  // }

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
        quantities: {
          select: {
            quantity: true,
          },
        },
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

  async search(query?: string) {

    const where: any = {};

    if (query) {
      where.OR = [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          brand: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where,
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
          createdAt: "desc",
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
        page: 1,
        totalPages: 1,
        lastPage: 1,
        itemsPerPage: total,
      },
    };
  }

  async getWatchesByBrand(
    brandId: string,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  ) {
    const skip = (page - 1) * limit;

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where: {
          brandId: brandId,
        },
        skip,
        take: limit,
        include: {
          brand: true,
          material: true,
          bandMaterial: true,
          movement: true,
          images: true,
          quantities: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.watch.count({
        where: {
          brandId: brandId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Watches by brand fetched successfully",
      data: {
        items: watches,
      },
      meta: {
        total,
        page,
        totalPages,
        lastPage: Math.ceil(total / limit),
        itemsPerPage: limit,
      },
    };
  }

  async getWatchesByMovement(
    movementName: string,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  ) {
    const skip = (page - 1) * limit;

    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where: {
          movement: {
            name: {
              equals: movementName,
              mode: "insensitive",
            },
          },
        },
        skip,
        take: limit,
        include: {
          brand: true,
          material: true,
          bandMaterial: true,
          movement: true,
          images: true,
          quantities: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.watch.count({
        where: {
          movement: {
            name: {
              equals: movementName,
              mode: "insensitive",
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Watches by movement fetched successfully",
      data: {
        items: watches,
      },
      meta: {
        total,
        page,
        totalPages,
        lastPage: Math.ceil(total / limit),
        itemsPerPage: limit,
      },
    };
  }

  // async filterWatches(filters: {
  //   brandName?: string;
  //   bandMaterialName?: string;
  //   materialName?: string;
  //   movementName?: string;
  //   gender?: WatchGender;
  //   diameter?: number;
  //   waterResistance?: number;
  //   warranty?: number;
  //   minPrice?: number;
  //   maxPrice?: number;
  //   page?: number;
  //   limit?: number;
  // }) {
  //   const {
  //     brandName,
  //     bandMaterialName,
  //     materialName,
  //     movementName,
  //     gender,
  //     diameter,
  //     waterResistance,
  //     warranty,
  //     minPrice,
  //     maxPrice,
  //     page = 1,
  //     limit = DEFAULT_PAGE_SIZE,
  //   } = filters;

  //   const skip = (page - 1) * limit;
  //   const where: any = {};

  //   if (brandName) {
  //     where.brand = {
  //       name: {
  //         equals: brandName,
  //         mode: "insensitive",
  //       },
  //     };
  //   }
  //   if (bandMaterialName) {
  //     where.bandMaterial = {
  //       name: {
  //         equals: bandMaterialName,
  //         mode: "insensitive",
  //       },
  //     };
  //   }
  //   if (materialName) {
  //     where.material = {
  //       name: {
  //         equals: materialName,
  //         mode: "insensitive",
  //       },
  //     };
  //   }
  //   if (movementName) {
  //     where.movement = {
  //       name: {
  //         equals: movementName,
  //         mode: "insensitive",
  //       },
  //     };
  //   }
  //   if (gender) {
  //     where.gender = gender as WatchGender;
  //   }
  //   if (diameter) {
  //     where.diameter = diameter;
  //   }
  //   if (waterResistance) {
  //     where.waterResistance = waterResistance;
  //   }
  //   if (warranty) {
  //     where.warranty = warranty;
  //   }
  //   if (minPrice !== undefined || maxPrice !== undefined) {
  //     where.price = {};
  //     if (minPrice !== undefined) {
  //       where.price.gte = minPrice;
  //     }
  //     if (maxPrice !== undefined) {
  //       where.price.lte = maxPrice;
  //     }
  //   }

  //   const [watches, total] = await Promise.all([
  //     prisma.watch.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       include: {
  //         brand: true,
  //         material: true,
  //         bandMaterial: true,
  //         movement: true,
  //         images: true,
  //         quantities: true,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     }),
  //     prisma.watch.count({ where }),
  //   ]);

  //   const totalPages = Math.ceil(total / limit);

  //   return {
  //     status: 200,
  //     message: "Watches filtered successfully",
  //     data: {
  //       items: watches,
  //     },
  //     meta: {
  //       total,
  //       page,
  //       totalPages,
  //       lastPage: Math.ceil(total / limit),
  //       itemsPerPage: limit,
  //     },
  //   };
  // }

  async getWatches(params: {
    keyword?: string;
    brandName?: string;
    bandMaterialName?: string;
    materialName?: string;
    movementName?: string;
    gender?: WatchGender;
    diameter?: number;
    waterResistance?: number;
    warranty?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      keyword,
      brandName,
      bandMaterialName,
      materialName,
      movementName,
      gender,
      diameter,
      waterResistance,
      warranty,
      minPrice,
      maxPrice,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
    } = params;
  
    const skip = (page - 1) * limit;
    const where: any = {};
  
    // ✅ Search by keyword (search in watch name, brand name, etc.)
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { brand: { name: { contains: keyword, mode: "insensitive" } } },
        { material: { name: { contains: keyword, mode: "insensitive" } } },
        { bandMaterial: { name: { contains: keyword, mode: "insensitive" } } },
        { movement: { name: { contains: keyword, mode: "insensitive" } } },
      ];
    }
  
    // ✅ Filtering conditions
    if (brandName) {
      where.brand = {
        name: {
          equals: brandName,
          mode: "insensitive",
        },
      };
    }
    if (bandMaterialName) {
      where.bandMaterial = {
        name: {
          equals: bandMaterialName,
          mode: "insensitive",
        },
      };
    }
    if (materialName) {
      where.material = {
        name: {
          equals: materialName,
          mode: "insensitive",
        },
      };
    }
    if (movementName) {
      where.movement = {
        name: {
          equals: movementName,
          mode: "insensitive",
        },
      };
    }
    if (gender) {
      where.gender = gender;
    }
    if (diameter) {
      where.diameter = diameter;
    }
    if (waterResistance) {
      where.waterResistance = waterResistance;
    }
    if (warranty) {
      where.warranty = warranty;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
  
    const [watches, total] = await Promise.all([
      prisma.watch.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          material: true,
          bandMaterial: true,
          movement: true,
          images: true,
          quantities: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.watch.count({ where }),
    ]);
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      status: 200,
      message: "Watches fetched successfully",
      data: { items: watches },
      meta: {
        total,
        page,
        totalPages,
        lastPage: totalPages,
        itemsPerPage: limit,
      },
    };
  }
  
}
