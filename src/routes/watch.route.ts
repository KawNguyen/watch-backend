import { Router } from 'express';
import { WatchController } from '../controllers/watch.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const watchRouter = Router();
const watchController = new WatchController();

// Public routes
watchRouter.get('/', watchController.findAll);
watchRouter.get('/:id', watchController.findOne as any);

// Protected routes
watchRouter.post('/', authMiddleware as any, (req, res) => watchController.create(req, res));
watchRouter.put('/:id', authMiddleware as any, (req, res) => watchController.update(req, res));
watchRouter.delete('/:id', authMiddleware as any, (req, res) => watchController.delete(req, res));

export default watchRouter;