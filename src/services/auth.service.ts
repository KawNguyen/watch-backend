import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserLogin, IUserRegister } from "../@types/user.types";
import { EmailService } from "./email.service";
import axios from "axios";

const prisma = new PrismaClient();
const emailService = new EmailService();

export class AuthService {
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(userData: IUserRegister, captchaToken: string) {
    // Verify CAPTCHA
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      throw new Error("CAPTCHA verification failed");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: (userData as any).name,
        email: userData.email,
        password: hashedPassword,
        role: (userData as any).role,
      },
    });

    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });

    await emailService.sendOTP(user.email, otp);

    return {
      message: "Registration verification code sent to your email",
      userId: user.id,
    };
  }

  async login(credentials: IUserLogin) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });

    await emailService.sendOTP(user.email, otp);

    return {
      message: "OTP sent to your email",
      userId: user.id,
    };
  }

  async verifyOTP(userId: string, otp: string) {
    if (!userId) {
      throw new Error("userId is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user || !user.otp || !user.otpExpiry) {
      throw new Error("Invalid verification attempt");
    }

    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > user.otpExpiry) {
      throw new Error("OTP has expired");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return { token, user: { ...user, password: undefined } };
  }
}
