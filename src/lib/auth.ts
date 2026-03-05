import type { User } from "@/types";

// Stub auth module. Will be replaced with NextAuth.js integration.
export async function getSessionUser(): Promise<User | null> {
  // In production, this will use NextAuth.js getServerSession
  return null;
}

export function requireAuth(user: User | null): user is User {
  return user !== null;
}
