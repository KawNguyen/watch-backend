import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const cart = await cartService.getOrCreateCart(userId);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async addItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { watchId } = req.body;
      const cartItem = await cartService.addItem(userId, watchId);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateQuantity(req: Request, res: Response) {
    try {
      const { quantity } = req.body;
      const cartItem = await cartService.updateQuantity(
        req.params.itemId,
        quantity,
      );
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      await cartService.removeItem(req.params.itemId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      await cartService.clearCart(userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
