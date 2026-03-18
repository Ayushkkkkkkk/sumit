import { Router } from "express";
import { z } from "zod";
import { login, register } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password should be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

authRouter.post("/register", validateBody(registerSchema), asyncHandler(register));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(login));

export default authRouter;
