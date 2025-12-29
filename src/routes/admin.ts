import { Router, Request, Response } from "express";
const r = Router();

r.get("/admin", (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "No user" });
  if (user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  return res.json({ ok: true, msg: "Welcome, admin" });
});

export default r;
