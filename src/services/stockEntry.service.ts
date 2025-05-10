import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 10;

export class StockEntryService {
  async create(
    addedById: string,
    items: { watchId: string; quantity: number; price: number }[]
  ) {
    return await prisma.$transaction(async (tx) => {
      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const stockEntry = await tx.stockEntry.create({
        data: {
          addedById,
          totalPrice,
          items: {
            create: items.map((item) => ({
              watchId: item.watchId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: { watch: true },
          },
          addedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      for (const item of items) {
        const existing = await tx.quantity.findFirst({
          where: { watchId: item.watchId }
        });
        if (existing) {
          await tx.quantity.update({
            where: { id: existing.id },
            data: { quantity: { increment: item.quantity } }
          });
        } else {
          await tx.quantity.create({
            data: {
              watchId: item.watchId,
              quantity: item.quantity
            }
          });
        }
      }

      return stockEntry;
    });
  }

  async findAll(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [stockEntries, total] = await Promise.all([
      prisma.stockEntry.findMany({
        skip,
        take: limit,
        include: {
          items: {
            include: {
              watch: {
                select: {
                  name: true,
                  images: true,
                  price: true,
                },
              },
            },
          },
          addedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stockEntry.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Stock entries fetched successfully",
      data: {
        items: stockEntries,
      },
      meta: {
        total,
        page,
        totalPages,
        lastPage: totalPages,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: string) {
    const stockEntry = await prisma.stockEntry.findUnique({
      where: { id },
      include: {
        items: {
          include: { watch: true },
        },
        addedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!stockEntry) {
      return {
        status: 404,
        message: "Stock entry not found",
      };
    }

    return {
      status: 200,
      message: "Stock entry fetched successfully",
      data: {
        item: stockEntry,
      },
    };
  }

  async getStockHistory(watchId: string, page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [stockItems, total] = await Promise.all([
      prisma.stockItem.findMany({
        where: { watchId },
        skip,
        take: limit,
        include: {
          stockEntry: {
            include: {
              addedBy: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stockItem.count({
        where: { watchId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Stock history fetched successfully",
      data: {
        items: stockItems,
      },
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
