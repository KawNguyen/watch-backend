import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { OrderStatus } from "@prisma/client";

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const { userId, addressId } = req.body;
      const order = await orderService.create(userId, addressId);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const userId = req.body;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;
      const orders = await orderService.findAllByUserId(userId, page, pageSize);
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
        res.status(404).json({ message: "Order not found" });
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
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      const order = await orderService.updateStatus(req.params.id, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
