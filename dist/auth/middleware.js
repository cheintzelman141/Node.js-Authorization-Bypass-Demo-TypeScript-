"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVulnerable = authVulnerable;
exports.authFixed = authFixed;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("./jwt");
const users_1 = require("../data/users");
// Vulnerable path: trusts client role claim without verifying signature.
function authVulnerable(req, res, next) {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });
    const token = header.slice("Bearer ".length);
    // ❌ BUG: decodes without verifying signature
    const payload = jsonwebtoken_1.default.decode(token);
    if (!payload)
        return res.status(401).json({ error: "Invalid token" });
    // ❌ BUG: trusts client-controlled role claim
    req.user = { id: "unknown", role: payload.role || "user" };
    next();
}
// Fixed path: verifies signature and uses server-side role data.
function authFixed(req, res, next) {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing token" });
    const token = header.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.JWT_SECRET, { algorithms: ["HS256"] });
        const userId = payload.sub;
        const user = userId ? users_1.USERS[userId] : undefined;
        if (!user)
            return res.status(403).json({ error: "Forbidden" });
        // Ignore client-supplied role; trust server data.
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
