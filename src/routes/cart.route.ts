import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(authMiddleware);

cartRouter.post("/add", cartController.addToCart);
cartRouter.get("/:userId", cartController.getUserCart);
cartRouter.put("/:userId/update-quantity/:cartItemId", cartController.updateQuantity);
cartRouter.delete("/:userId/remove/:cartItemId", cartController.removeFromCart);
cartRouter.delete("/clear", cartController.clearCart);

export default cartRouter;
