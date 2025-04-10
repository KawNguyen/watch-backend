import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import corsOptions from './config/cors.config';
import watchRouter from './routes/watch.route';
import brandRouter from './routes/brand.route';
import authRouter from './routes/auth.routes';
import errorMiddleware from './middlewares/error.middleware';
import addressRouter from './routes/address.route';
import cartRouter from './routes/cart.route';
import orderRouter from './routes/order.route';
import stockEntryRouter from './routes/stockEntry.route';
import { corsMiddleware } from './middlewares/cors.middleware';

dotenv.config();
const apiType = "/v1/api"

const app = express();

// Apply CORS middleware before any routes
app.use(corsMiddleware as any);
app.use(cors(corsOptions));
app.use(express.json());
app.use(`${apiType}/watches`, watchRouter);
app.use(`${apiType}/brands`, brandRouter);
app.use(`${apiType}/auth`, authRouter);
app.use(`${apiType}/addresses`, addressRouter);
app.use(`${apiType}/cart`, cartRouter);
app.use(`${apiType}/orders`, orderRouter);
app.use(`${apiType}/stock-entries`, stockEntryRouter);
app.use(errorMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;