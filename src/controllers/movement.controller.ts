import { Request, Response } from "express";
import { MovementService } from "../services/movement.service";

const movementService = new MovementService();

export class MovementController {
  findAll = async (req: Request, res: Response) => {
    try {
      const movements = await movementService.findAll();
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movements", error });
    }
  };

  findOne = async (req: Request, res: Response) => {
    try {
      const movement = await movementService.findOne(req.params.id);
      if (!movement) {
        res.status(404).json({ message: "Movement not found" });
        return;
      }
      res.json(movement);
    } catch (error) {
      res.status(500).json({ message: "Error fetching movement", error });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const movement = await movementService.create(req.body);
      res.status(201).json(movement);
    } catch (error) {
      res.status(500).json({ message: "Error creating movement", error });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const movement = await movementService.update(req.params.id, req.body);
      res.json(movement);
    } catch (error) {
      res.status(500).json({ message: "Error updating movement", error });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await movementService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting movement", error });
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
      const result = await movementService.search(filters.name);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error searching movements", error });
    }
  };
}
