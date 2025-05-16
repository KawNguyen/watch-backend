import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://watch-frontend-wgv9.vercel.app",
    "https://lux-watch.vercel.app",
    "https://watch-backend-3bye.onrender.com"
  ],
  credentials: true,
};

export default corsOptions;
