import { Router } from "express";
import { MovementController } from "../controllers/movement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const movementRouter = Router();
const movementController = new MovementController();

movementRouter.get("/search", movementController.search);
movementRouter.get("/", movementController.findAll);
movementRouter.get("/:id", movementController.findOne);
movementRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  movementController.create,
);
movementRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  movementController.update,
);
movementRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  movementController.delete,
);

export default movementRouter;
