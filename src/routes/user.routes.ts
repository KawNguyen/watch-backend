import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get(
  "/search",
  authMiddleware,
  adminMiddleware,
  userController.searchUsers,
)

userRouter.get(
  "/customers",
  authMiddleware,
  adminMiddleware,
  userController.getAllCustomers
)

userRouter.get(
  "/",
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers
);
userRouter.get(
  "/:id",
  authMiddleware,
  userController.getUserById
);
userRouter.put("/update/:id", authMiddleware, userController.updateUser);
userRouter.delete("/delete/:id", authMiddleware, userController.deleteUser);

export default userRouter;
