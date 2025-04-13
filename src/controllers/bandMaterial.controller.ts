import { Request, Response } from "express";
import { BandMaterialService } from "../services/bandMaterial.service";

const bandMaterialService = new BandMaterialService();

export class BandMaterialController {
    findAll = async (req: Request, res: Response) => {
        try {
            const bandMaterials = await bandMaterialService.findAll();
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
            const bandMaterial = await bandMaterialService.update(req.params.id, req.body);
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
}