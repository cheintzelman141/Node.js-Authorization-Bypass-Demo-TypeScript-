import { authMiddleware } from '../auth/middleware';
import { users } from '../data/users';

export function profileRoute(token?: string): string {
  if (!authMiddleware(token)) return 'unauthorized';
  const [firstUser] = users;
  return firstUser ? `profile for ${firstUser.name}` : 'no users found';
}

