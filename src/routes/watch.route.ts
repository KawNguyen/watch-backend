import { Router } from 'express';
import { WatchController } from '../controllers/watch.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const watchRouter = Router();
const watchController = new WatchController();

// Public routes
watchRouter.get('/', (req, res) => watchController.findAll(req, res));
watchRouter.get('/:id', (req, res) => watchController.findOne(req, res) as any);

// Protected routes
watchRouter.use(authMiddleware as any);
watchRouter.post('/create', (req, res) => watchController.create(req, res));
watchRouter.put('/update/:id', (req, res) => watchController.update(req, res));
watchRouter.delete('/delete/:id', (req, res) => watchController.delete(req, res));

export default watchRouter;