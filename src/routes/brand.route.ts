import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.get("/search", brandController.search);
brandRouter.get("/", brandController.findAll);
brandRouter.get("/:id", brandController.findOne);
brandRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  brandController.create
);
brandRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  brandController.update
);
brandRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  brandController.delete
);

export default brandRouter;
