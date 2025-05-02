import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", "https://watch-frontend-wgv9.vercel.app/"],

  credentials: true,
};

export default corsOptions;
