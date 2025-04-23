import { Router } from "express";
import { WatchController } from "../controllers/watch.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const watchRouter = Router();
const watchController = new WatchController();

// Public routes
watchRouter.get("/search", watchController.search);
watchRouter.get("/", watchController.findAll);
watchRouter.get("/:id", watchController.findOne);
watchRouter.get("/brand/:brandId", watchController.getWatchesByBrand);
watchRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  watchController.create,
);
watchRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  watchController.update,
);
watchRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  watchController.delete,
);

export default watchRouter;
