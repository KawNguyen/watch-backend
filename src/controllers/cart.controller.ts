import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const userId = req?.user.id;
      const result = await cartService.getOrCreateCart(userId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching cart",
        error: error.message,
      });
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req?.user.id;
      const { watchId, quantity } = req.body;

      if (!watchId) {
        res.status(400).json({
          status: 400,
          message: "Watch ID is required",
        });
      }

      const result = await cartService.addItem(userId, watchId, quantity);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error adding item to cart",
        error: error.message,
      });
    }
  }

  async updateQuantity(req: Request, res: Response) {
    try {
      const userId = req?.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({
          status: 400,
          message: "Valid quantity is required",
        });
      }

      const result = await cartService.updateQuantity(userId, itemId, quantity);
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
      const userId = req?.user.id;
      const { itemId } = req.params;

      const result = await cartService.removeItem(userId, itemId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error removing item from cart",
        error: error.message,
      });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = req?.user.id;
      const result = await cartService.clearCart(userId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error clearing cart",
        error: error.message,
      });
    }
  }
}
