import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(authMiddleware as any);

cartRouter.get("/", cartController.getCart);
cartRouter.post("/add", cartController.addToCart);
cartRouter.delete("/remove/:itemId", cartController.removeFromCart);
cartRouter.delete("/clear", cartController.clearCart);

export default cartRouter;
