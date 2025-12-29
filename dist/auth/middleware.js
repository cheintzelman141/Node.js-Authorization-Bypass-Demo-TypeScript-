"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFixed = authFixed;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("./jwt");
const users_1 = require("../data/users");
function authFixed(req, res, next) {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });
    const token = header.slice("Bearer ".length);
    try {
        const verified = jsonwebtoken_1.default.verify(token, jwt_1.JWT_SECRET, { algorithms: ["HS256"] });
        const userId = verified.sub;
        if (!userId || typeof userId !== "string")
            return res.status(401).json({ error: "Invalid sub" });
        const user = users_1.USERS[userId];
        if (!user)
            return res.status(401).json({ error: "Unknown user" });
        // ✅ Authoritative role comes from server-side data, not token claims
        req.user = { id: user.id, role: user.role };
        return next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
