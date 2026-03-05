import type { User } from "@/types";

export const TEST_USER: User = {
  id: "user-test-001",
  name: "Test User",
  email: "test@example.com",
  image: null,
};

export const OTHER_USER: User = {
  id: "user-test-002",
  name: "Other User",
  email: "other@example.com",
  image: "https://example.com/avatar.png",
};
