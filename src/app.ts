import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/product.route';
import errorMiddleware from './middlewares/error.middleware';


dotenv.config();

const apiType = "/v1/api"

const app = express();
app.use(cors());
app.use(express.json());
app.use(`${apiType}/watch`, productRouter);
app.use(errorMiddleware);

export default app;