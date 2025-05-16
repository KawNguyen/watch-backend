import { Request, Response } from "express";
import { MaterialService } from "../services/material.service";

const materialService = new MaterialService();

export class MaterialController {
  findAll = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query;
      const materials = await materialService.findAll(
        page ? Number(page) : 1,
        limit ? Number(limit) : 12
      );
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching materials", error });
    }
  };

  findOne = async (req: Request, res: Response) => {
    try {
      const material = await materialService.findOne(req.params.id);
      if (!material) {
        res.status(404).json({ message: "Material not found" });
        return;
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ message: "Error fetching material", error });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const material = await materialService.create(req.body);
      res.status(201).json(material);
    } catch (error) {
      res.status(500).json({ message: "Error creating material", error });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const material = await materialService.update(req.params.id, req.body);
      res.json(material);
    } catch (error) {
      res.status(500).json({ message: "Error updating material", error });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await materialService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting material", error });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const { name, page, pageSize } = req.query;
      const filters = {
        name: name as string,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      };
      const result = await materialService.search(filters.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error searching materials", error });
    }
  };
}
