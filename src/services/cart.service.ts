import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CartService {
  async getOrCreateCart(userId: string) {
    try {
      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              watch: {
                include: {
                  brand: true,
                  images: true,
                  material: true,
                  bandMaterial: true,
                  movement: true,
                  quantities: true
                }
              }
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
                watch: {
                  include: {
                    brand: true,
                    images: true,
                    material: true,
                    bandMaterial: true,
                    movement: true,
                    quantities: true
                  }
                }
              }
            }
          }
        });
      }

      return {
        status: 200,
        message: "Cart fetched successfully",
        data: { item: cart }
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message
      };
    }
  }

  async addItem(userId: string, watchId: string, quantity: number = 1) {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const watch = await prisma.watch.findUnique({
        where: { id: watchId },
        include: { quantities: true }
      });

      if (!watch) {
        throw new Error("Watch not found");
      }

      const totalStock = watch.quantities.reduce((sum, q) => sum + q.quantity, 0);
      
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          watchId
        }
      });

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > totalStock) {
          throw new Error("Requested quantity exceeds available stock");
        }

        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            watch: {
              include: {
                brand: true,
                images: true,
                material: true,
                bandMaterial: true,
                movement: true
              }
            }
          }
        });

        return {
          status: 200,
          message: "Cart item updated successfully",
          data: { item: updatedItem }
        };
      }

      if (quantity > totalStock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          watchId,
          quantity
        },
        include: {
          watch: {
            include: {
              brand: true,
              images: true,
              material: true,
              bandMaterial: true,
              movement: true
            }
          }
        }
      });

      return {
        status: 201,
        message: "Item added to cart successfully",
        data: { item: newItem }
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message
      };
    }
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { 
          id: itemId,
          cart: {
            userId: userId
          }
        },
        include: {
          watch: {
            include: {
              quantities: true
            }
          }
        }
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      const totalStock = cartItem.watch.quantities.reduce((sum, q) => sum + q.quantity, 0);
      if (quantity > totalStock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          watch: {
            include: {
              brand: true,
              images: true,
              material: true,
              bandMaterial: true,
              movement: true
            }
          }
        }
      });

      return {
        status: 200,
        message: "Cart item quantity updated successfully",
        data: { item: updatedItem }
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message
      };
    }
  }

  async removeItem(userId: string, itemId: string) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cart: {
            userId: userId
          }
        }
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      await prisma.cartItem.delete({
        where: { id: itemId }
      });

      return {
        status: 200,
        message: "Item removed from cart successfully"
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message
      };
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId }
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return {
        status: 200,
        message: "Cart cleared successfully"
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message
      };
    }
  }
}
