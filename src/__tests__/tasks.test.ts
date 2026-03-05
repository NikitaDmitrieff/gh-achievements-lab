import { describe, it, expect, beforeEach, afterAll } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema";
import { randomUUID } from "crypto";

// Create an in-memory database for testing
const sqlite = new Database(":memory:");
sqlite.pragma("journal_mode = WAL");
const testDb = drizzle(sqlite, { schema });

// Create the tasks table
sqlite.exec(`
  CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium',
    tags TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

// Override the db module
import { vi } from "vitest";
vi.mock("@/db", () => ({ db: testDb }));

// Import after mocking
const { listTasks, createTask, getTask, updateTask, deleteTask } = await import("@/lib/tasks");

function clearTasks() {
  sqlite.exec("DELETE FROM tasks");
}

describe("Task CRUD operations", () => {
  beforeEach(() => {
    clearTasks();
  });

  afterAll(() => {
    sqlite.close();
  });

  describe("createTask", () => {
    it("should create a task with required fields", async () => {
      const task = await createTask({ title: "Test task" });

      expect(task.id).toBeDefined();
      expect(task.title).toBe("Test task");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.tags).toEqual([]);
      expect(task.description).toBeNull();
    });

    it("should create a task with all fields", async () => {
      const task = await createTask({
        title: "Full task",
        description: "A description",
        status: "in_progress",
        priority: "high",
        tags: ["frontend", "urgent"],
      });

      expect(task.title).toBe("Full task");
      expect(task.description).toBe("A description");
      expect(task.status).toBe("in_progress");
      expect(task.priority).toBe("high");
      expect(task.tags).toEqual(["frontend", "urgent"]);
    });
  });

  describe("getTask", () => {
    it("should return a task by id", async () => {
      const created = await createTask({ title: "Find me" });
      const found = await getTask(created.id);

      expect(found).not.toBeNull();
      expect(found!.title).toBe("Find me");
    });

    it("should return null for non-existent id", async () => {
      const found = await getTask("non-existent");
      expect(found).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("should update task fields", async () => {
      const created = await createTask({ title: "Original" });
      const updated = await updateTask(created.id, {
        title: "Updated",
        status: "done",
        priority: "low",
      });

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe("Updated");
      expect(updated!.status).toBe("done");
      expect(updated!.priority).toBe("low");
    });

    it("should return null for non-existent id", async () => {
      const result = await updateTask("non-existent", { title: "Nope" });
      expect(result).toBeNull();
    });

    it("should update tags", async () => {
      const created = await createTask({ title: "Tagged", tags: ["old"] });
      const updated = await updateTask(created.id, { tags: ["new", "tags"] });

      expect(updated!.tags).toEqual(["new", "tags"]);
    });

    it("should allow setting description to null", async () => {
      const created = await createTask({ title: "Desc", description: "has desc" });
      const updated = await updateTask(created.id, { description: null });

      expect(updated!.description).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", async () => {
      const created = await createTask({ title: "Delete me" });
      const result = await deleteTask(created.id);

      expect(result).toBe(true);
      const found = await getTask(created.id);
      expect(found).toBeNull();
    });

    it("should return false for non-existent id", async () => {
      const result = await deleteTask("non-existent");
      expect(result).toBe(false);
    });
  });

  describe("listTasks", () => {
    it("should return empty list when no tasks", async () => {
      const result = await listTasks({ page: 1, limit: 20 });

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it("should list all tasks", async () => {
      await createTask({ title: "Task 1" });
      await createTask({ title: "Task 2" });
      await createTask({ title: "Task 3" });

      const result = await listTasks({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
    });

    it("should filter by status", async () => {
      await createTask({ title: "Todo", status: "todo" });
      await createTask({ title: "Done", status: "done" });

      const result = await listTasks({ page: 1, limit: 20, status: "done" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("Done");
    });

    it("should filter by priority", async () => {
      await createTask({ title: "Low", priority: "low" });
      await createTask({ title: "High", priority: "high" });

      const result = await listTasks({ page: 1, limit: 20, priority: "high" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("High");
    });

    it("should filter by tag", async () => {
      await createTask({ title: "Tagged", tags: ["frontend"] });
      await createTask({ title: "Untagged" });

      const result = await listTasks({ page: 1, limit: 20, tag: "frontend" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("Tagged");
    });

    it("should paginate results", async () => {
      for (let i = 0; i < 5; i++) {
        await createTask({ title: `Task ${i}` });
      }

      const page1 = await listTasks({ page: 1, limit: 2 });
      expect(page1.data).toHaveLength(2);
      expect(page1.pagination.page).toBe(1);
      expect(page1.pagination.totalPages).toBe(3);
      expect(page1.pagination.total).toBe(5);

      const page3 = await listTasks({ page: 3, limit: 2 });
      expect(page3.data).toHaveLength(1);
    });
  });
});

const { CreateTaskSchema, UpdateTaskSchema, TaskQuerySchema } = await import("@/types/task");

describe("Validation schemas", () => {

  describe("CreateTaskSchema", () => {
    it("should accept valid input", () => {
      const result = CreateTaskSchema.safeParse({ title: "Valid task" });
      expect(result.success).toBe(true);
    });

    it("should reject empty title", () => {
      const result = CreateTaskSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });

    it("should reject missing title", () => {
      const result = CreateTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const result = CreateTaskSchema.safeParse({
        title: "Task",
        status: "invalid",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid priority", () => {
      const result = CreateTaskSchema.safeParse({
        title: "Task",
        priority: "critical",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("TaskQuerySchema", () => {
    it("should provide defaults for page and limit", () => {
      const result = TaskQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it("should coerce string numbers", () => {
      const result = TaskQuerySchema.safeParse({ page: "2", limit: "10" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(10);
      }
    });
  });
});
