"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.signToken = signToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
function signToken(userId, role) {
    // role included to demonstrate the bug; fixed path will ignore it
    return jsonwebtoken_1.default.sign({ role }, exports.JWT_SECRET, { subject: userId, expiresIn: "1h" });
}
