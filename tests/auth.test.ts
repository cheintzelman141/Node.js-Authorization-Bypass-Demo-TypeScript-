import request from "supertest";
import app from "../src/app";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/auth/jwt";

describe("AuthZ demo", () => {
  it("denies admin route for normal user token", async () => {
    const token = jwt.sign({ role: "user" }, JWT_SECRET, { subject: "100", expiresIn: "1h" });

    const r = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect([403, 401]).toContain(r.status);
  });

  it("prevents privilege escalation via role tampering", async () => {
    // attacker forges role claim
    const forged = jwt.sign({ role: "admin" }, JWT_SECRET, { subject: "100", expiresIn: "1h" });

    const r = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${forged}`);

    expect([403, 401]).toContain(r.status);
  });

  it("allows admin route for real admin user", async () => {
    const adminToken = jwt.sign({ role: "admin" }, JWT_SECRET, { subject: "200", expiresIn: "1h" });

    const r = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(r.status).toBe(200);
  });
});
