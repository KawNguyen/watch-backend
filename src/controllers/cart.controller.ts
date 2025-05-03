import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();
export class CartController {
  async getUserCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          status: 400,
          message: "User ID is required",
        });
        return;
      }

      const result = await cartService.getUserCart(userId);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching cart",
        error: error.message,
      });
      return;
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const { userId, watchId, quantity } = req.body;

      if (!watchId) {
        res.status(400).json({
          status: 400,
          message: "Watch ID is required",
        });
        return;
      }

      const result = await cartService.addItem(userId, watchId, quantity);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error adding item to cart",
        error: error.message,
      });
      return;
    }
  }

  async updateQuantity(req: Request, res: Response) {
    try {
      const { userId, cartItemId, quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({
          status: 400,
          message: "Valid quantity is required",
        });
      }

      const result = await cartService.updateQuantity(
        userId,
        cartItemId,
        quantity
      );
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error updating cart item quantity",
        error: error.message,
      });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const { userId, cartItemId } = req.body;

      const result = await cartService.removeItem(userId, cartItemId);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error removing item from cart",
        error: error.message,
      });
      return;
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = req?.body;
      const result = await cartService.clearCart(userId);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error clearing cart",
        error: error.message,
      });
      return;
    }
  }
}
