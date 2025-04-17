import { Request, Response } from "express";
import { WatchService } from "../services/watch.service";

const watchService = new WatchService();

export class WatchController {

  findAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
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
      const {
        name,
        page,
        pageSize
      } = req.query;

      const filters = {
        name: name as string,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined
      };

      const result = await watchService.search(filters);

      if (!result.data.items.length) {
          res.status(404).json({ 
          message: "No watches found matching your search criteria" 
        });
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error searching watches", 
        error: error.message 
      });
    }
  }
}
