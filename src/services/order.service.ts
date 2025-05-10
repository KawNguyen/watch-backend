import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
          include: {
            watch: {
              include: {
                quantities: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        status: 400,
        message: "Cart is empty",
      };
    }

    for (const item of cart.items) {
      const quantity = item.watch.quantities[0]?.quantity || 0;
      if (quantity < item.quantity) {
        return {
          status: 400,
          message: `Insufficient stock for watch: ${item.watch.name}`,
        };
      }
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

        for (const item of cart.items) {
          const quantityId = item.watch.quantities[0]?.id;
          if (!quantityId) continue;

          await tx.quantity.update({
            where: {
              id: quantityId,
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

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

  async findAll() {
    const orders = await prisma.order.findMany({
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
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "All orders fetched successfully",
      data: {
        items: orders,
      },
    };
  }

  async findAllByUserId(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
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
    });

    return {
      status: 200,
      message: "Orders fetched successfully",
      data: {
        items: orders,
      },
    };
  }

  async findOne(orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
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

  async updateStatus(orderId: string, status: OrderStatus) {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
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
