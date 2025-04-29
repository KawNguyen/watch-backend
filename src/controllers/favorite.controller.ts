import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service";

const favoriteService = new FavoriteService();

export class FavoriteController {
  async addToFavorites(req: Request, res: Response) {
    try {
      // const userId = req.params?.id;
      const { userId, watchId } = req.body;

      if (!userId || !watchId) {
        throw new Error("User ID and Watch ID are required");
      }

      const result = await favoriteService.addToFavorites(userId, watchId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async removeFromFavorites(req: Request, res: Response) {
    try {
      const {userId, watchId } = req.body;

      if (!userId || !watchId) {
        throw new Error("User ID and Watch ID are required");
      }

      const result = await favoriteService.removeFromFavorites(userId, watchId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async getUserFavorites(req: Request, res: Response) {
    try {
      const userId = req.body;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;

      if (!userId) {
        throw new Error("User ID and Watch ID are required");
      }

      const result = await favoriteService.getUserFavorites(
        userId,
        page,
        pageSize
      );

      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async checkFavorite(req: Request, res: Response) {
    try {
      // const userId = req.params?.id;
      const {userId, watchId } = req.body;
      
      if (!userId || !watchId) {
        throw new Error("User ID and Watch ID are required");
      }
      
      const result = await favoriteService.checkFavorite(userId, watchId);
      res.status(result.status).json(result);
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}
