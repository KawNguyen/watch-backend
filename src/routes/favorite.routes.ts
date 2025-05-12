import { Router } from "express";
import { FavoriteController } from "../controllers/favorite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const favoriteRouter = Router();
const favoriteController = new FavoriteController();

favoriteRouter.use(authMiddleware);

favoriteRouter.post("/add", favoriteController.addToFavorites);
favoriteRouter.get("/:userId", favoriteController.getUserFavorites);
favoriteRouter.delete(
  "/:userId/remove/:watchId",
  favoriteController.removeFromFavorites,
);
favoriteRouter.get("/check/:watchId", favoriteController.checkFavorite);

export default favoriteRouter;
