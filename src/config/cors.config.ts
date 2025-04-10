import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-production-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsOptions;