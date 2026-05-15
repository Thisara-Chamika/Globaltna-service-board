import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "./AppError";

export interface AuthPayload {
  userId: string;
  role: "homeowner" | "tradesperson";
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// ── Verify JWT Token ──
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Not authorized, no token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    if (!secret) {
      throw new AppError("Server configuration error", 500);
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Not authorized, invalid token", 401));
    }
  }
};

// ── Role-Based Authorization ──
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};