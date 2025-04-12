import { Request, Response } from "express";
import { AddressService } from "../services/address.service";

const addressService = new AddressService();

export class AddressController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const address = await addressService.create(userId, req.body);
      res.status(201).json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAllByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const addresses = await addressService.findAllByUser(userId);
      res.json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const address = await addressService.findOne(req.params.id);
      if (!address) {
        res.status(404).json({ message: "Address not found" });
        return;
      }
      res.json(address);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const address = await addressService.update(req.params.id, req.body);
      res.json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await addressService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
