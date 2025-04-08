import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const cartRouter = Router();
const cartController = new CartController();

cartRouter.use(authMiddleware as any);

cartRouter.get('/', (req, res) => cartController.getCart(req, res));
cartRouter.post('/add', (req, res) => cartController.addItem(req, res));
cartRouter.delete('/remove/:itemId', (req, res) => cartController.removeItem(req, res));
cartRouter.delete('/clear', (req, res) => cartController.clearCart(req, res));

export default cartRouter;