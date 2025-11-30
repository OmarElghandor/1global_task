// src/app/middlewares/errorHandler.ts
import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Unhandled error:", err);

  if (res.headersSent) return;

  res.status(500).json({
    error: "Internal Server Error",
    // in production you might *not* send the details
    details: process.env.NODE_ENV === "development" ? err?.message : undefined,
  });
}
