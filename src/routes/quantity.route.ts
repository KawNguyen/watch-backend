import { Router } from "express";
import { QuantityController } from "../controllers/quantity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const quantityRouter = Router();
const quantityController = new QuantityController();

quantityRouter.get("/watch/:watchId", quantityController.findByWatch);
quantityRouter.get(
  "/search",
  authMiddleware,
  adminMiddleware,
  quantityController.search,
);
quantityRouter.get(
  "/",
  authMiddleware,
  adminMiddleware,
  quantityController.findAll,
);
quantityRouter.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  quantityController.findOne,
);

export default quantityRouter;
