import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(userId: string, role: string) {
  // role included to demonstrate the bug; fixed path will ignore it
  return jwt.sign({ role }, JWT_SECRET, { subject: userId, expiresIn: "1h" });
}
