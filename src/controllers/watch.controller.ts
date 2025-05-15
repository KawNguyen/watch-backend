import { Request, Response } from "express";
import { WatchService } from "../services/watch.service";
import { WatchGender } from "@prisma/client";

const watchService = new WatchService();

export class WatchController {
  findAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const result = await watchService.findAll(page, pageSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching watches", error });
    }
  };

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

  async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const result = await watchService.search(query as string);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        message: "Error searching watches",
        error: error.message,
      });
    }
  }

  async getWatchesByBrand(req: Request, res: Response) {
    try {
      const brandId = req.params.brandId;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;

      const result = await watchService.getWatchesByBrand(
        brandId,
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

  async filterWatches(req: Request, res: Response) {
    try {
      const {
        brand,
        bandMaterial,
        material,
        movement,
        gender,
        diameter,
        waterResistance,
        warranty,
        minPrice,
        maxPrice,
        page,
        limit,
      } = req.query;

      const filters = {
        brandName: brand as string,
        bandMaterialName: bandMaterial as string,
        materialName: material as string,
        movementName: movement as string,
        gender: gender
          ? ((gender as string).toUpperCase() as WatchGender)
          : undefined,
        diameter: diameter ? Number(diameter) : undefined,
        waterResistance: waterResistance ? Number(waterResistance) : undefined,
        warranty: warranty ? Number(warranty) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };

      const result = await watchService.filterWatches(filters);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}
