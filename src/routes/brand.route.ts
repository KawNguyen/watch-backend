import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.get('/', brandController.findAll);
brandRouter.get('/:id', brandController.findOne as any);
brandRouter.post('/create', (authMiddleware as any), brandController.create);
brandRouter.put('/update/:id', (authMiddleware as any), brandController.update);
brandRouter.delete('/delete/:id', (authMiddleware as any), brandController.delete);

export default brandRouter;