export type User = { id: string; email: string; role: "user" | "admin" };

export const USERS: Record<string, User> = {
  "100": { id: "100", email: "user@example.com", role: "user" },
  "200": { id: "200", email: "admin@example.com", role: "admin" },
};
