"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./routes/admin"));
const jwt_1 = require("./auth/jwt");
// vulnerable branch: intentionally use the vulnerable middleware
const middleware_1 = require("./auth/middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
// demo login
app.get("/login/:userId", (req, res) => {
    const userId = req.params.userId;
    const token = (0, jwt_1.signToken)(userId, "user");
    res.json({ token });
});
app.use(middleware_1.authVulnerable);
app.use(admin_1.default);
exports.default = app;
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on ${port}`));
}
