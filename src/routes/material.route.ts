import { Router } from "express";
import { MaterialController } from "../controllers/material.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get("/", materialController.findAll);
materialRouter.get("/:id", materialController.findOne);
materialRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  materialController.create,
);
materialRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  materialController.update,
);
materialRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  materialController.delete,
);

export default materialRouter;
