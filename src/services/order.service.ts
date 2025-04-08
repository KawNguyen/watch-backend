import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {
  async create(userId: string, addressId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { watch: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Tính tổng tiền và tạo order items trong cùng một transaction
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.watch.price * item.quantity);
    }, 0);

    // Tạo order và order items trong một transaction
    const order = await prisma.$transaction(async (tx) => {
      // Tạo order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          totalPrice,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map(item => ({
              watchId: item.watchId,
              quantity: item.quantity,
              price: item.watch.price
            }))
          }
        },
        include: {
          items: {
            include: { watch: true }
          },
          address: true
        }
      });

      // Xóa cart items sau khi tạo order
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { watch: true }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, userId: string) {
    return await prisma.order.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        items: {
          include: { watch: true }
        },
        address: true
      }
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { watch: true }
        },
        address: true
      }
    });
  }
}