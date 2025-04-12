import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.use(authMiddleware);

orderRouter.post("/create", (req, res) => orderController.create(req, res));
orderRouter.get("/", (req, res) => orderController.getOrders(req, res));
orderRouter.get(
  "/:id",
  (req, res) => orderController.getOrder(req, res),
);
orderRouter.put(
  "/status/:id",
  (req, res) => orderController.updateStatus(req, res),
);

export default orderRouter;
