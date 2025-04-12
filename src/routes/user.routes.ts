import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const userRouter = Router();
const userController = new UserController();

// Protected routes (admin only)

userRouter.get('/', authMiddleware, adminMiddleware, (req, res) => userController.getAllUsers(req, res));
userRouter.get('/:id', authMiddleware, adminMiddleware, (req, res) => userController.getUserById(req, res));
userRouter.put('/:id', authMiddleware, (req, res) => userController.updateUser(req, res));
userRouter.delete('/:id', authMiddleware, (req, res) => userController.deleteUser(req, res));

export default userRouter;