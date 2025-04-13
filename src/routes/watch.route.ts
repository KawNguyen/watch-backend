import { Router } from "express";
import { WatchController } from "../controllers/watch.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const watchRouter = Router();
const watchController = new WatchController();

// Public routes
watchRouter.get("/", watchController.findAll);
watchRouter.get("/:id", watchController.findOne);

watchRouter.post("/", authMiddleware, watchController.create);
watchRouter.put("/:id", authMiddleware, watchController.update);
watchRouter.delete("/:id", authMiddleware, watchController.delete);

export default watchRouter;
