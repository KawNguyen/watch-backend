import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://watch-frontend-khoa.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

export default corsOptions;