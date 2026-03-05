import { vi } from "vitest";
import type { User } from "@/types";
import { TEST_USER } from "../fixtures/users";

// Mock the auth module - call setMockUser to control auth state in tests
let mockUser: User | null = null;

export function setMockUser(user: User | null) {
  mockUser = user;
}

export function resetMockUser() {
  mockUser = null;
}

export function setAuthenticatedUser() {
  mockUser = TEST_USER;
}

// Create the mock implementation
export const mockGetSessionUser = vi.fn(async () => mockUser);

// Setup function to apply auth mocks
export function setupAuthMocks() {
  vi.mock("@/lib/auth", () => ({
    getSessionUser: () => mockGetSessionUser(),
    requireAuth: (user: User | null): user is User => user !== null,
  }));
}
