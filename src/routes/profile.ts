import { USERS } from "../data/users";

export function profileRoute(userId: string): string {
  const user = USERS[userId];
  return user ? `profile for ${user.email}` : "unauthorized";
}

