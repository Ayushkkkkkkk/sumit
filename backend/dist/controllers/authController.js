import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
function signToken(params) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(params, secret, { expiresIn: "1d" });
}
export async function register(req, res) {
    const { name, email, password } = req.body;
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
export async function login(req, res) {
    const { email, password } = req.body;
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
export async function adminLogin(req, res) {
    const { email, password } = req.body;
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
