import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://watch-frontend-khoa.vercel.app'  // Your actual frontend production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400  // 24 hours
};

export default corsOptions;