import { Request, Response } from "express";
import { QuantityService } from "../services/quantity.service";

const quantityService = new QuantityService();

export class QuantityController {
  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await quantityService.findAll(page, limit);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching quantities",
        error: error.message,
      });
      return;
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await quantityService.findOne(id);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching quantity",
        error: error.message,
      });
      return;
    }
  }

  async findByWatch(req: Request, res: Response) {
    try {
      const { watchId } = req.params;
      const result = await quantityService.findByWatch(watchId);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error fetching watch quantity",
        error: error.message,
      });
      return;
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { search, minQuantity, maxQuantity, page, limit } = req.query;

      const filters = {
        search: search as string,
        minQuantity: minQuantity ? parseInt(minQuantity as string) : undefined,
        maxQuantity: maxQuantity ? parseInt(maxQuantity as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await quantityService.search(filters);
      res.status(result.status).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        status: 500,
        message: "Error searching quantities",
        error: error.message,
      });
      return;
    }
  }
}
