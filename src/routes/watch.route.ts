import { Router } from "express";
import { WatchController } from "../controllers/watch.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const watchRouter = Router();
const watchController = new WatchController();

// Public routes
watchRouter.get("/", watchController.findAll);
watchRouter.get("/:id", watchController.findOne);

// Protected routes
watchRouter.post("/", authMiddleware, (req, res) =>
  watchController.create(req, res),
);
watchRouter.put("/:id", authMiddleware, (req, res) =>
  watchController.update(req, res),
);
watchRouter.delete("/:id", authMiddleware, (req, res) =>
  watchController.delete(req, res),
);

export default watchRouter;
