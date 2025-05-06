import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        message: "Registration successful",
        user: {
          message: user.message,
          id: user.userId,
        },
      });

      return;
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const loginResult = await authService.login({ email, password });

      res.status(200).json({
        user: {
          message: loginResult.message,
          id: loginResult.userId,
        },
      });
      return;
    } catch (error: any) {
      res.status(401).json({
        message: error.message || "Login failed",
      });
      return;
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        res.status(400).json({ message: "User ID and OTP are required" });
        return;
      }

      const verificationResult = await authService.verifyOTP(userId, otp);

      const token = jwt.sign(
        { userId: verificationResult.user.id, role: verificationResult.user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        accessToken: token,
        user: {
          id: verificationResult.user.id,
          email: verificationResult.user.email,
          name: verificationResult.user.name,
          role: verificationResult.user.role,
          avatar: verificationResult.user.avatar,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        message: error.message || "OTP verification failed",
      });
      return;
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
