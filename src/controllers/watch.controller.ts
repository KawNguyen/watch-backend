import { Request, Response } from "express";
import { WatchService } from "../services/watch.service";
import { WatchGender } from "@prisma/client";

const watchService = new WatchService();

export class WatchController {
  async findOne(req: Request, res: Response) {
    try {
      const watch = await watchService.findOne(req.params.id);
      if (!watch) {
        res.status(404).json({ message: "Watch not found" });
        return;
      }
      res.json(watch);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const watch = await watchService.create(req.body);
      res.status(201).json(watch);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const watch = await watchService.update(req.params.id, req.body);
      res.json(watch);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await watchService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getWatchesByBrand(req: Request, res: Response) {
    try {
      const brandSlug = req.params.brandSlug;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 12;

      const result = await watchService.getWatchesByBrand(
        brandSlug,
        page,
        pageSize,
      );
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getWatchesByMovement(req: Request, res: Response) {
    try {
      const movementName = req.params.movementName;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await watchService.getWatchesByMovement(
        movementName,
        page,
        limit,
      );
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getWatches(req: Request, res: Response) {
    try {
      const {
        keyword,
        brand,
        bandMaterial,
        material,
        movement,
        gender,
        diameterRange,
        waterResistanceRange,
        warranty,
        minPrice,
        maxPrice,
        page,
        limit,
      } = req.query;

      const filters = {
        keyword: keyword as string,
        brandName: brand as string,
        bandMaterialName: bandMaterial as string,
        materialName: material as string,
        movementName: movement as string,
        gender: gender
          ? ((gender as string).toUpperCase() as WatchGender)
          : undefined,
        diameterRange: diameterRange as string,
        waterResistanceRange: waterResistanceRange as string,
        warranty: warranty ? Number(warranty) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };

      const result = await watchService.getWatches(filters);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}
