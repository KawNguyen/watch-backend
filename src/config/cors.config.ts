import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: true,  // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 200
};

export default corsOptions;