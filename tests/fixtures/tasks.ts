import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types";

export const TEST_USER_ID = "user-test-001";
export const OTHER_USER_ID = "user-test-002";

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-001",
    title: "Test Task",
    description: "A test task description",
    status: "todo",
    priority: "medium",
    tags: ["test"],
    userId: TEST_USER_ID,
    createdAt: new Date("2025-01-15T10:00:00Z"),
    updatedAt: new Date("2025-01-15T10:00:00Z"),
    ...overrides,
  };
}

export function createMockTaskInput(overrides: Partial<CreateTaskInput> = {}): CreateTaskInput {
  return {
    title: "New Test Task",
    description: "A new test task",
    status: "todo",
    priority: "medium",
    tags: ["test"],
    ...overrides,
  };
}

export function createMockUpdateInput(overrides: Partial<UpdateTaskInput> = {}): UpdateTaskInput {
  return {
    title: "Updated Task",
    ...overrides,
  };
}

export const SAMPLE_TASKS: Task[] = [
  createMockTask({
    id: "task-001",
    title: "Design landing page",
    status: "done",
    priority: "high",
    tags: ["design", "frontend"],
    createdAt: new Date("2025-01-10T08:00:00Z"),
  }),
  createMockTask({
    id: "task-002",
    title: "Set up CI/CD pipeline",
    status: "in_progress",
    priority: "urgent",
    tags: ["devops"],
    createdAt: new Date("2025-01-12T09:00:00Z"),
  }),
  createMockTask({
    id: "task-003",
    title: "Write API tests",
    description: "Unit and integration tests for the API layer",
    status: "todo",
    priority: "medium",
    tags: ["testing", "backend"],
    createdAt: new Date("2025-01-14T10:00:00Z"),
  }),
  createMockTask({
    id: "task-004",
    title: "Fix login bug",
    status: "todo",
    priority: "high",
    tags: ["bug", "auth"],
    createdAt: new Date("2025-01-15T11:00:00Z"),
  }),
  createMockTask({
    id: "task-005",
    title: "Update documentation",
    status: "archived",
    priority: "low",
    tags: ["docs"],
    createdAt: new Date("2025-01-08T07:00:00Z"),
  }),
];
