import { Router } from "express";
import { BandMaterialController } from "../controllers/bandMaterial.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const bandMaterialRouter = Router();
const bandMaterialController = new BandMaterialController();

bandMaterialRouter.get("/search", bandMaterialController.search);
bandMaterialRouter.get("/", bandMaterialController.findAll);
bandMaterialRouter.get("/:id", bandMaterialController.findOne);
bandMaterialRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.create,
);
bandMaterialRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.update,
);
bandMaterialRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.delete,
);

export default bandMaterialRouter;
