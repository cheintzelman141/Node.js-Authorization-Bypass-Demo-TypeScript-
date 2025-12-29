import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./jwt";
import { USERS } from "../data/users";

// Vulnerable path: trusts client role claim without verifying signature.
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

// Fixed path: verifies signature and uses server-side role data.
export function authFixed(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as JwtPayload;
    const userId = payload.sub as string;
    const user = userId ? USERS[userId] : undefined;
    if (!user) return res.status(403).json({ error: "Forbidden" });

    // Ignore client-supplied role; trust server data.
    (req as any).user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
