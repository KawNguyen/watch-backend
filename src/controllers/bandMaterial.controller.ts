import { Request, Response } from "express";
import { BandMaterialService } from "../services/bandMaterial.service";

const bandMaterialService = new BandMaterialService();

export class BandMaterialController {
  findAll = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query;
      const bandMaterials = await bandMaterialService.findAll(
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      );
      res.json(bandMaterials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching band materials", error });
    }
  };

  findOne = async (req: Request, res: Response) => {
    try {
      const bandMaterial = await bandMaterialService.findOne(req.params.id);
      if (!bandMaterial) {
        res.status(404).json({ message: "Band material not found" });
        return;
      }
      res.json(bandMaterial);
    } catch (error) {
      res.status(500).json({ message: "Error fetching band material", error });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const bandMaterial = await bandMaterialService.create(req.body);
      res.status(201).json(bandMaterial);
    } catch (error) {
      res.status(500).json({ message: "Error creating band material", error });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const bandMaterial = await bandMaterialService.update(
        req.params.id,
        req.body,
      );
      res.json(bandMaterial);
    } catch (error) {
      res.status(500).json({ message: "Error updating band material", error });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await bandMaterialService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting band material", error });
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

      const result = await bandMaterialService.search(filters.name);

      if (!result.data.items.length) {
        res.status(404).json({
          message: "No brands found matching your search criteria",
        });
        return;
      }

      res.json(result);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error searching band materials", error });
    }
  };
}
