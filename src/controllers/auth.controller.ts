import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
  
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );
  
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(201).json({
        message: "Registration successful",
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const loginResult = await authService.login({ email, password });
      const token = jwt.sign(
        { id: loginResult.user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "24h",
        },
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        accessToken: token,
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name,
          role: loginResult.user.role,
          avatar: loginResult.user.avatar,
          
        },
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
