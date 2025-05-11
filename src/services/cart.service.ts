import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CartService {
  async getUserCart(userId: string) {
    try {
      const cart = await prisma.cart.findUnique({
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
                  material: true,
                  bandMaterial: true,
                  movement: true,
                  description: true,
                  quantities: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        return {
          status: 200,
          message: "Cart is empty",
          data: { item: null },
        };
      }

      return {
        status: 200,
        message: "Cart fetched successfully",
        data: cart,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async addItem(userId: string, watchId: string, quantity: number = 1) {
    try {
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }

      const watch = await prisma.watch.findUnique({
        where: { id: watchId },
        include: { quantities: true },
      });

      if (!watch) throw new Error("Watch not found");

      const totalStock = watch.quantities.reduce(
        (sum, q) => sum + q.quantity,
        0
      );

      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, watchId },
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
              select: {
                id: true,
                code: true,
                name: true,
                price: true,
                brand: true,
                images: true,
                material: true,
                bandMaterial: true,
                movement: true,
              },
            },
          },
        });

        return {
          status: 200,
          message: "Cart item updated successfully",
          data: { item: updatedItem },
        };
      }

      if (quantity > totalStock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          watchId,
          quantity,
        },
        include: {
          watch: {
            select: {
              id: true,
              code: true,
              name: true,
              price: true,
              brand: true,
              images: true,
              material: true,
              bandMaterial: true,
              movement: true,
            },
          },
        },
      });

      return {
        status: 201,
        message: "Item added to cart successfully",
        data: newItem,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    try {
      if (!userId) {
        return {
          status: 400,
          message: "User ID  are required",
        };
      }
      if (!cartItemId) {
        return {
          status: 400,
          message: "Invalid or missing cart item ID",
        };
      }

      if (quantity <= 0) {
        return {
          status: 400,
          message: "Quantity must be greater than zero",
        };
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: { userId },
        },
        include: {
          watch: {
            include: { quantities: true },
          },
        },
      });

      if (!cartItem) throw new Error("Cart item not found");

      const totalStock = cartItem.watch.quantities.reduce(
        (sum, q) => sum + q.quantity,
        0
      );
      if (quantity > totalStock) {
        throw new Error("Requested quantity exceeds available stock");
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: {
          watch: {
            select: {
              id: true,
              code: true,
              name: true,
              price: true,
              brand: true,
              images: true,
              material: true,
              bandMaterial: true,
              description: true,
              movement: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: "Cart item quantity updated successfully",
        data: updatedItem,
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async removeItem(userId: string, cartItemId: string) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: cartItemId,
          cart: { userId },
        },
      });

      if (!cartItem) throw new Error("Cart item not found");

      await prisma.cartItem.delete({ where: { id: cartItemId } });

      return {
        status: 200,
        message: "Item removed from cart successfully",
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) throw new Error("Cart not found");

      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return {
        status: 200,
        message: "Cart cleared successfully",
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }
}
