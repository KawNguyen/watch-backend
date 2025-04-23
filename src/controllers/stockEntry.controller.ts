import { Request, Response } from "express";
import { StockEntryService } from "../services/stockEntry.service";

const stockEntryService = new StockEntryService();

export class StockEntryController {
  async create(req: Request, res: Response) {
    try {
      const addedById = (req as any).user.userId;
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: "Items must be a non-empty array" });
      }

      for (const item of items) {
        if (!item.watchId || !item.quantity || !item.price) {
          res.status(400).json({ 
            message: "Each item must have watchId, quantity, and price" 
          });
        }
        if (item.quantity <= 0 || item.price <= 0) {
          res.status(400).json({ 
            message: "Quantity and price must be positive numbers" 
          });
        }
      }

      const stockEntry = await stockEntryService.create(addedById, items);
      res.status(201).json(stockEntry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const entries = await stockEntryService.findAll();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const entry = await stockEntryService.findOne(req.params.id);
      if (!entry) {
        res.status(404).json({ message: "Stock entry not found" });
        return;
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
