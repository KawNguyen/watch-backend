import { Router } from "express";
import { FavoriteController } from "../controllers/favorite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

// Apply auth middleware to all favorite routes
favoriteRouter.use(authMiddleware);

// Routes
favoriteRouter.get("/:userId", favoriteController.getUserFavorites);
favoriteRouter.post("/add", favoriteController.addToFavorites);
favoriteRouter.delete("/:userId/remove/:watchId", favoriteController.removeFromFavorites);
favoriteRouter.get("/check/:watchId", favoriteController.checkFavorite);

export default favoriteRouter;