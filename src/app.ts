import express from "express";
import adminRoutes from "./routes/admin";
import { signToken } from "./auth/jwt";
// vulnerable branch: intentionally use the vulnerable middleware
import { authVulnerable as auth } from "./auth/middleware";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// demo login
app.get("/login/:userId", (req, res) => {
  const userId = req.params.userId;
  const token = signToken(userId, "user");
  res.json({ token });
});

app.use(auth);
app.use(adminRoutes);

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on ${port}`));
}
