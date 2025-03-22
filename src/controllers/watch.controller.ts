import { Request, Response } from 'express';
import WatchService from './../services/watch.service';

export class WatchController {
    public static getWatchList = async (req: Request, res: Response) => {
        try {
            const products = await WatchService.getAll();
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public static createWatch = async (req: Request, res: Response) => {
        try {
            const product = await WatchService.create(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    public static updateWatch = async (req: Request, res: Response) => {
        try {
            const product = await WatchService.update(req.params.id, req.body);
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    
    public static deleteWatch = async (req: Request, res: Response) => {
        try {
            await WatchService.delete(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}