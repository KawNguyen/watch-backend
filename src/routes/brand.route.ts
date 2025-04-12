import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.get("/", brandController.findAll);
brandRouter.get("/:id", brandController.findOne);
brandRouter.post("/create", authMiddleware, brandController.create);
brandRouter.put("/update/:id", authMiddleware, brandController.update);
brandRouter.delete(
  "/delete/:id",
  authMiddleware,
  brandController.delete,
);

export default brandRouter;
