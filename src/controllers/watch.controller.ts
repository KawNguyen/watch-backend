import { Request, Response } from "express";
import { WatchService } from "../services/watch.service";

const watchService = new WatchService();

export class WatchController {
  async findAll(req: Request, res: Response) {
    try {
      const watches = await watchService.findAll();
      res.json(watches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

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
}
