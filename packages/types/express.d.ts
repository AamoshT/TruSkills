import "express";

declare global {
  namespace Express {
    interface Request {
      role?: "user" | "seller";
    }
  }
}
