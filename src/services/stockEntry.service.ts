import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StockEntryService {
  async create(
    addedById: string,
    items: { watchId: string; quantity: number; price: number }[],
  ) {
    return await prisma.$transaction(async (tx) => {
      // Calculate total price for the stock entry
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create stock entry with items in a single transaction
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

      // Update watch stock quantities
      for (const item of items) {
        await tx.quantity.update({
          where: { id: item.watchId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }

      return stockEntry;
    });
  }

  async findAll() {
    return await prisma.stockEntry.findMany({
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
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return await prisma.stockEntry.findUnique({
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
  }

  async getStockHistory(watchId: string) {
    return await prisma.stockItem.findMany({
      where: { watchId },
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
    });
  }
}
