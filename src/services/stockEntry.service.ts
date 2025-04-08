import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StockEntryService {
  async create(addedById: string, items: { watchId: string; quantity: number }[]) {
    return await prisma.$transaction(async (tx) => {
      // Create stock entry with items in a single transaction
      const stockEntry = await tx.stockEntry.create({
        data: {
          addedById,
          items: {
            create: items.map(item => ({
              watchId: item.watchId,
              quantity: item.quantity
            }))
          }
        },
        include: {
          items: {
            include: { watch: true }
          },
          addedBy: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Update watch stock quantities
      for (const item of items) {
        await tx.watch.update({
          where: { id: item.watchId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }

      return stockEntry;
    });
  }

  async findAll() {
    return await prisma.stockEntry.findMany({
      include: {
        items: {
          include: { watch: true }
        },
        addedBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return await prisma.stockEntry.findUnique({
      where: { id },
      include: {
        items: {
          include: { watch: true }
        },
        addedBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
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
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}