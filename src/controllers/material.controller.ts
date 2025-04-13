import { Request, Response } from "express";
import { MaterialService } from "../services/material.service";

const materialService = new MaterialService();

export class MaterialController {
    

    findAll = async (req: Request, res: Response) => {
        try {
            const materials = await materialService.findAll();
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
}