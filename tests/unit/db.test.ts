import { describe, it, expect, beforeEach } from "vitest";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTaskStore,
} from "@/db";
import { TEST_USER_ID, OTHER_USER_ID, createMockTaskInput } from "../fixtures/tasks";

describe("Task Database Operations", () => {
  beforeEach(() => {
    resetTaskStore();
  });

  describe("createTask", () => {
    it("creates a task with all fields", async () => {
      const input = createMockTaskInput();
      const task = await createTask(input, TEST_USER_ID);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(input.title);
      expect(task.description).toBe(input.description);
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.tags).toEqual(["test"]);
      expect(task.userId).toBe(TEST_USER_ID);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it("applies defaults for optional fields", async () => {
      const task = await createTask({ title: "Minimal" }, TEST_USER_ID);

      expect(task.description).toBeNull();
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.tags).toEqual([]);
    });

    it("assigns unique IDs", async () => {
      const task1 = await createTask({ title: "Task 1" }, TEST_USER_ID);
      const task2 = await createTask({ title: "Task 2" }, TEST_USER_ID);

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe("getTasks", () => {
    beforeEach(async () => {
      await createTask(
        createMockTaskInput({ title: "Todo task", status: "todo", priority: "high", tags: ["frontend"] }),
        TEST_USER_ID,
      );
      await createTask(
        createMockTaskInput({ title: "Done task", status: "done", priority: "low", tags: ["backend"] }),
        TEST_USER_ID,
      );
      await createTask(
        createMockTaskInput({ title: "Other user task", status: "todo" }),
        OTHER_USER_ID,
      );
    });

    it("returns only tasks for the given user", async () => {
      const tasks = await getTasks(TEST_USER_ID);
      expect(tasks).toHaveLength(2);
      expect(tasks.every((t) => t.userId === TEST_USER_ID)).toBe(true);
    });

    it("filters by status", async () => {
      const tasks = await getTasks(TEST_USER_ID, { status: "todo" });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Todo task");
    });

    it("filters by priority", async () => {
      const tasks = await getTasks(TEST_USER_ID, { priority: "high" });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Todo task");
    });

    it("filters by tags", async () => {
      const tasks = await getTasks(TEST_USER_ID, { tags: ["backend"] });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Done task");
    });

    it("filters by search term in title", async () => {
      const tasks = await getTasks(TEST_USER_ID, { search: "todo" });
      expect(tasks).toHaveLength(1);
    });

    it("filters by search term in description", async () => {
      const tasks = await getTasks(TEST_USER_ID, { search: "new test" });
      expect(tasks).toHaveLength(2);
    });

    it("returns sorted by createdAt descending", async () => {
      const tasks = await getTasks(TEST_USER_ID);
      expect(tasks[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        tasks[1].createdAt.getTime(),
      );
    });

    it("returns empty array for user with no tasks", async () => {
      const tasks = await getTasks("nonexistent-user");
      expect(tasks).toEqual([]);
    });
  });

  describe("getTaskById", () => {
    it("returns the task when found", async () => {
      const created = await createTask({ title: "Find me" }, TEST_USER_ID);
      const found = await getTaskById(created.id, TEST_USER_ID);

      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
    });

    it("returns null for non-existent task", async () => {
      const found = await getTaskById("nonexistent", TEST_USER_ID);
      expect(found).toBeNull();
    });

    it("returns null when task belongs to different user", async () => {
      const created = await createTask({ title: "Private" }, TEST_USER_ID);
      const found = await getTaskById(created.id, OTHER_USER_ID);

      expect(found).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("updates task fields", async () => {
      const created = await createTask({ title: "Original" }, TEST_USER_ID);
      const updated = await updateTask(
        created.id,
        { title: "Updated", status: "done" },
        TEST_USER_ID,
      );

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe("Updated");
      expect(updated!.status).toBe("done");
    });

    it("updates updatedAt timestamp", async () => {
      const created = await createTask({ title: "Original" }, TEST_USER_ID);
      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure different timestamp
      await new Promise((r) => setTimeout(r, 10));
      const updated = await updateTask(
        created.id,
        { title: "Updated" },
        TEST_USER_ID,
      );

      expect(updated!.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it("returns null for non-existent task", async () => {
      const result = await updateTask(
        "nonexistent",
        { title: "Updated" },
        TEST_USER_ID,
      );
      expect(result).toBeNull();
    });

    it("returns null when task belongs to different user", async () => {
      const created = await createTask({ title: "Private" }, TEST_USER_ID);
      const result = await updateTask(
        created.id,
        { title: "Hijacked" },
        OTHER_USER_ID,
      );

      expect(result).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("deletes an existing task", async () => {
      const created = await createTask({ title: "Delete me" }, TEST_USER_ID);
      const result = await deleteTask(created.id, TEST_USER_ID);

      expect(result).toBe(true);

      const found = await getTaskById(created.id, TEST_USER_ID);
      expect(found).toBeNull();
    });

    it("returns false for non-existent task", async () => {
      const result = await deleteTask("nonexistent", TEST_USER_ID);
      expect(result).toBe(false);
    });

    it("returns false when task belongs to different user", async () => {
      const created = await createTask({ title: "Private" }, TEST_USER_ID);
      const result = await deleteTask(created.id, OTHER_USER_ID);

      expect(result).toBe(false);

      // Verify task still exists
      const found = await getTaskById(created.id, TEST_USER_ID);
      expect(found).not.toBeNull();
    });
  });
});
