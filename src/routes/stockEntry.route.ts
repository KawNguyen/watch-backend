import { Router } from "express";
import { StockEntryController } from "../controllers/stockEntry.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const stockEntryRouter = Router();
const stockEntryController = new StockEntryController();

stockEntryRouter.use(authMiddleware);

stockEntryRouter.get("/", (req, res) => stockEntryController.getAll(req, res));
stockEntryRouter.get(
  "/:id",
  (req, res) => stockEntryController.getOne(req, res),
);
stockEntryRouter.post("/create", (req, res) =>
  stockEntryController.create(req, res),
);

export default stockEntryRouter;
