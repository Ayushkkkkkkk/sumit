import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      issues: err.issues
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ message });
}
