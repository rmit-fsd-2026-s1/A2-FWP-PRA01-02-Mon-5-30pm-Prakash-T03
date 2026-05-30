import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "hirer" | "vendor" | "admin";
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token is missing. Please sign in." });
    return;
  }

  const secret = process.env.JWT_SECRET || "super_secret_venueflow_token_key_123!";

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired access token. Please sign in again." });
      return;
    }
    
    req.user = decoded as { id: string; email: string; role: "hirer" | "vendor" | "admin" };
    next();
  });
}

export function requireRole(role: "hirer" | "vendor" | "admin") {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized. Please authenticate first." });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: `Forbidden. This feature is restricted to ${role}s.` });
      return;
    }

    next();
  };
}
