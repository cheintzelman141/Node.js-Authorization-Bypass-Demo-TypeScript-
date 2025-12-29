import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./jwt";
import { USERS } from "../data/users";

export function authFixed(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  const token = header.slice("Bearer ".length);

  try {
    const verified = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as JwtPayload;

    const userId = verified.sub;
    if (!userId || typeof userId !== "string") return res.status(401).json({ error: "Invalid sub" });

    const user = USERS[userId];
    if (!user) return res.status(401).json({ error: "Unknown user" });

    // ✅ Authoritative role comes from server-side data, not token claims
    (req as any).user = { id: user.id, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
