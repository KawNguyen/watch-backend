import { Router } from 'express';
import { WatchController } from '../controllers/watch.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const watchRouter = Router();
const watchController = new WatchController();

watchRouter.get('/', watchController.findAll);
watchRouter.get('/:id', watchController.findOne as any);
watchRouter.post('/create', (authMiddleware as any), watchController.create);
watchRouter.put('/update/:id', (authMiddleware as any), watchController.update);
watchRouter.delete('/delete/:id',(authMiddleware as any), watchController.delete);

export default watchRouter;