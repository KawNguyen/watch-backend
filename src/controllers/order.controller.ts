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

  async findAll(req: Request, res: Response) {
    try {
      const orders = await orderService.findAll();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await orderService.findAllByUserId(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const order = await orderService.findOne(orderId);
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
      const { status, orderId } = req.body;
      if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      const order = await orderService.updateStatus(orderId, status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
