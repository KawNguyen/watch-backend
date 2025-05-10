import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.use(authMiddleware);

orderRouter.get("/", adminMiddleware, orderController.findAll);
orderRouter.post("/create", orderController.create);
orderRouter.get("/:userId", orderController.getOrdersByUserId);
orderRouter.get("/detail/:orderId", orderController.getOrder);
orderRouter.put("/status/:orderId", adminMiddleware, orderController.updateStatus);

export default orderRouter;
