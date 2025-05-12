import { authMiddleware } from "./../middlewares/auth.middleware";
import { Router } from "express";
import { StockEntryController } from "../controllers/stockEntry.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const stockEntryRouter = Router();
const stockEntryController = new StockEntryController();

stockEntryRouter.use(authMiddleware);

stockEntryRouter.get("/", adminMiddleware, stockEntryController.findAll);
stockEntryRouter.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  stockEntryController.findOne,
);
stockEntryRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  stockEntryController.create,
);

export default stockEntryRouter;
