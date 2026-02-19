import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

interface TokenPayload {
    userId: string;
    role: "USER" | "ADMIN";
}


export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token!, process.env.BACKEND_JWT_SECRET!) as TokenPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


export function requireRole(role: "USER" | "ADMIN" = "USER") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    next();
  };
}