import { JwtPayload } from '../custom';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
