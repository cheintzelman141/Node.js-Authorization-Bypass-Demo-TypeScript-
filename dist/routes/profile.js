"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = profileRoute;
const users_1 = require("../data/users");
function profileRoute(userId) {
    const user = users_1.USERS[userId];
    return user ? `profile for ${user.email}` : "unauthorized";
}
