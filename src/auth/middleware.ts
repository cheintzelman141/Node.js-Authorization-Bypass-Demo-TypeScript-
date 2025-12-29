import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authVulnerable(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  const token = header.slice("Bearer ".length);

  // ❌ BUG: decodes without verifying signature
  const payload: any = jwt.decode(token);

  if (!payload) return res.status(401).json({ error: "Invalid token" });

  // ❌ BUG: trusts client-controlled role claim
  (req as any).user = { id: "unknown", role: payload.role || "user" };
  next();
}
