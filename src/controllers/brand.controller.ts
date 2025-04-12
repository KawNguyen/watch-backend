import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

const brandService = new BrandService();

export class BrandController {
  async create(req: Request, res: Response) {
    try {
      const brand = await brandService.create(req.body);
      res.status(201).json(brand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const brands = await brandService.findAll();
      res.json(brands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const brand = await brandService.findOne(req.params.id);
      if (!brand) {
        res.status(404).json({ message: "Brand not found" });
        return;
      }
      res.json(brand);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const brand = await brandService.update(req.params.id, req.body);
      res.json(brand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await brandService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

}
