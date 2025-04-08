import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CartService {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            watch: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              watch: true
            }
          }
        }
      });
    }

    return cart;
  }

  async addItem(userId: string, watchId: string) {
    const cart = await this.getOrCreateCart(userId);
    
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        watchId
      }
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
        include: { watch: true }
      });
    }

    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        watchId,
        quantity: 1
      },
      include: { watch: true }
    });
  }

  async updateQuantity(itemId: string, quantity: number) {
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { watch: true }
    });
  }

  async removeItem(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId }
    });
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    return cart;
  }
}