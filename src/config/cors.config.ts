import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: '*',  // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
};

export default corsOptions;