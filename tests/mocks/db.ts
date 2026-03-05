import { vi } from "vitest";
import type { Task } from "@/types";

export const mockGetTasks = vi.fn<() => Promise<Task[]>>().mockResolvedValue([]);
export const mockGetTaskById = vi.fn<() => Promise<Task | null>>().mockResolvedValue(null);
export const mockCreateTask = vi.fn<() => Promise<Task>>();
export const mockUpdateTask = vi.fn<() => Promise<Task | null>>().mockResolvedValue(null);
export const mockDeleteTask = vi.fn<() => Promise<boolean>>().mockResolvedValue(false);

export function setupDbMocks() {
  vi.mock("@/db", () => ({
    getTasks: (...args: unknown[]) => mockGetTasks(...args as []),
    getTaskById: (...args: unknown[]) => mockGetTaskById(...args as []),
    createTask: (...args: unknown[]) => mockCreateTask(...args as []),
    updateTask: (...args: unknown[]) => mockUpdateTask(...args as []),
    deleteTask: (...args: unknown[]) => mockDeleteTask(...args as []),
  }));
}

export function resetDbMocks() {
  mockGetTasks.mockReset().mockResolvedValue([]);
  mockGetTaskById.mockReset().mockResolvedValue(null);
  mockCreateTask.mockReset();
  mockUpdateTask.mockReset().mockResolvedValue(null);
  mockDeleteTask.mockReset().mockResolvedValue(false);
}
