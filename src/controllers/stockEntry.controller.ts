import { Request, Response } from "express";
import { StockEntryService } from "../services/stockEntry.service";

const stockEntryService = new StockEntryService();

export class StockEntryController {
  async create(req: Request, res: Response) {
    try {
      const {addedById, items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          status: 400,
          message: "Valid items array is required",
          error: "Items must be a non-empty array",
        });
        return;
      }

      for (const item of items) {
        if (!item.watchId || !item.quantity || !item.price) {
          res.status(400).json({
            status: 400,
            message: "Invalid item data",
            error: "Each item must have watchId, quantity, and price",
            invalidItem: item,
          });
          return;
        }

        if (item.quantity <= 0) {
          res.status(400).json({
            status: 400,
            message: "Invalid quantity",
            error: "Quantity must be greater than 0",
            invalidItem: item,
          });
          return;
        }

        if (item.price <= 0) {
          res.status(400).json({
            status: 400,
            message: "Invalid price",
            error: "Price must be greater than 0",
            invalidItem: item,
          });
          return;
        }
      }

      const result = await stockEntryService.create(addedById, items);
      res.status(201).json({
        status: 201,
        message: "Stock entry created successfully",
        data: {
          item: result,
        },
      });
      return;
    } catch (error: any) {
      console.error("Stock Entry Creation Error:", error);
      res.status(500).json({
        status: 500,
        message: "Error creating stock entry",
        error: {
          message: error.message,
          code: error.code,
          details:
            error.meta || error.details || "No additional details available",
        },
      });
      return;
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await stockEntryService.findAll(page, limit);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching stock entries",
        error: error.message,
      });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await stockEntryService.findOne(id);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching stock entry",
        error: error.message,
      });
    }
  }

  async getStockHistory(req: Request, res: Response) {
    try {
      const { watchId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await stockEntryService.getStockHistory(
        watchId,
        page,
        limit
      );
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching stock history",
        error: error.message,
      });
    }
  }
}
