import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '@prisma/client';

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { addressId } = req.body;
      const order = await orderService.create(userId, addressId);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const orders = await orderService.findAll(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const order = await orderService.findOne(req.params.id, userId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      const order = await orderService.updateStatus(req.params.id, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}