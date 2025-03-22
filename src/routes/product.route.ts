import { Router } from 'express';
import { WatchController } from '../controllers/watch.controller';


const productRouter = Router();

productRouter.get('/', WatchController.getWatchList);
productRouter.post('/create', WatchController.createWatch);
productRouter.put('/update/:productId', WatchController.updateWatch);
productRouter.delete('/delete/:productId', WatchController.deleteWatch);

export default productRouter;