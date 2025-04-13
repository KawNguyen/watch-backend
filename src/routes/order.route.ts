import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.use(authMiddleware);

orderRouter.post("/create", orderController.create);
orderRouter.get("/", orderController.getOrders);
orderRouter.get("/:id", orderController.getOrder);
orderRouter.put("/status/:id", orderController.updateStatus);

export default orderRouter;
