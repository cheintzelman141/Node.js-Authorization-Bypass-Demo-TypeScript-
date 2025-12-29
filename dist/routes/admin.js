"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const r = (0, express_1.Router)();
r.get("/admin", (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "No user" });
    if (user.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    return res.json({ ok: true, msg: "Welcome, admin" });
});
exports.default = r;
