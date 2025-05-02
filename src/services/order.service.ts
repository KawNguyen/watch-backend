import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 10;

export class OrderService {
  async create(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      return {
        status: 400,
        message: "Invalid address",
      };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { watch: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        status: 400,
        message: "Cart is empty",
      };
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.watch.price * item.quantity;
    }, 0);

    try {
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            addressId,
            totalPrice,
            status: OrderStatus.PENDING,
            items: {
              create: cart.items.map((item) => ({
                watchId: item.watchId,
                quantity: item.quantity,
                price: item.watch.price,
              })),
            },
          },
          include: {
            items: {
              include: { watch: true },
            },
            address: true,
          },
        });

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return newOrder;
      });

      return {
        status: 201,
        message: "Order created successfully",
        data: {
          item: order,
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async findAllById(userId: string, page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              watch: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  price: true,
                  brand: true,
                  images: true,
                  description: true,
                },
              },
            },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: "Orders fetched successfully",
      data: {
        items: orders,
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

  async findOne(id: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: { watch: true },
        },
        address: true,
      },
    });

    if (!order) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    return {
      status: 200,
      message: "Order fetched successfully",
      data: {
        item: order,
      },
    };
  }

  async updateStatus(id: string, status: OrderStatus) {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: { watch: true },
          },
          address: true,
        },
      });

      return {
        status: 200,
        message: "Order status updated successfully",
        data: {
          item: updatedOrder,
        },
      };
    } catch (error) {
      return {
        status: 404,
        message: "Order not found",
      };
    }
  }
}
