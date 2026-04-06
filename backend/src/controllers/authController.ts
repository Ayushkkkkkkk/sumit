import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";

type AuthRole = "user" | "admin";

function signToken(params: { role: AuthRole; userId?: number }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(params, secret, { expiresIn: "1d" });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  const token = signToken({ role: "user", userId: user.id });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: "user" }
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken({ role: "user", userId: user.id });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: "user" }
  });
}

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@expense.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    res.status(401).json({ message: "Invalid admin credentials" });
    return;
  }

  const token = signToken({ role: "admin" });
  res.json({
    token,
    user: {
      id: 0,
      name: "Admin",
      email: adminEmail,
      role: "admin"
    }
  });
}
