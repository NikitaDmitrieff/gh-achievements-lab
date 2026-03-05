import { describe, it, expect, beforeEach } from "vitest";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTaskStore,
} from "@/db";
import { validateCreateTask, validateUpdateTask } from "@/lib/validation";
import { paginate } from "@/lib/utils";

const USER_ID = "integration-test-user";

describe("Task Lifecycle Integration", () => {
  beforeEach(() => {
    resetTaskStore();
  });

  it("supports full CRUD lifecycle", async () => {
    // Create
    const input = { title: "Integration Task", description: "Testing lifecycle", priority: "high" as const, tags: ["integration"] };
    const validation = validateCreateTask(input);
    expect(validation.valid).toBe(true);

    const task = await createTask(input, USER_ID);
    expect(task.id).toBeDefined();
    expect(task.title).toBe("Integration Task");

    // Read
    const found = await getTaskById(task.id, USER_ID);
    expect(found).not.toBeNull();
    expect(found!.title).toBe("Integration Task");

    // Update
    const updateInput = { status: "in_progress" as const };
    const updateValidation = validateUpdateTask(updateInput);
    expect(updateValidation.valid).toBe(true);

    const updated = await updateTask(task.id, updateInput, USER_ID);
    expect(updated!.status).toBe("in_progress");

    // Delete
    const deleted = await deleteTask(task.id, USER_ID);
    expect(deleted).toBe(true);

    const afterDelete = await getTaskById(task.id, USER_ID);
    expect(afterDelete).toBeNull();
  });

  it("supports filtering and pagination together", async () => {
    // Create tasks with different properties
    await createTask({ title: "High priority task 1", priority: "high", status: "todo" }, USER_ID);
    await createTask({ title: "High priority task 2", priority: "high", status: "todo" }, USER_ID);
    await createTask({ title: "Low priority task", priority: "low", status: "todo" }, USER_ID);
    await createTask({ title: "Done task", priority: "high", status: "done" }, USER_ID);

    // Filter by priority
    const highPriorityTasks = await getTasks(USER_ID, { priority: "high" });
    expect(highPriorityTasks).toHaveLength(3);

    // Filter by priority + status
    const highTodoTasks = await getTasks(USER_ID, { priority: "high", status: "todo" });
    expect(highTodoTasks).toHaveLength(2);

    // Paginate results
    const allTasks = await getTasks(USER_ID);
    const page1 = paginate(allTasks, 1, 2);
    expect(page1.data).toHaveLength(2);
    expect(page1.totalPages).toBe(2);

    const page2 = paginate(allTasks, 2, 2);
    expect(page2.data).toHaveLength(2);
  });

  it("enforces user isolation", async () => {
    const otherUserId = "other-user";

    const task = await createTask({ title: "My task" }, USER_ID);

    // Other user cannot see
    const otherTasks = await getTasks(otherUserId);
    expect(otherTasks).toHaveLength(0);

    // Other user cannot get by ID
    const otherFound = await getTaskById(task.id, otherUserId);
    expect(otherFound).toBeNull();

    // Other user cannot update
    const otherUpdated = await updateTask(task.id, { title: "Hijack" }, otherUserId);
    expect(otherUpdated).toBeNull();

    // Other user cannot delete
    const otherDeleted = await deleteTask(task.id, otherUserId);
    expect(otherDeleted).toBe(false);

    // Original user still has access
    const myTask = await getTaskById(task.id, USER_ID);
    expect(myTask).not.toBeNull();
    expect(myTask!.title).toBe("My task");
  });

  it("handles search across title and description", async () => {
    await createTask({ title: "Build dashboard", description: "React components" }, USER_ID);
    await createTask({ title: "Fix login", description: "Dashboard authentication bug" }, USER_ID);
    await createTask({ title: "Write tests", description: "Vitest unit tests" }, USER_ID);

    // Search in titles
    const buildResults = await getTasks(USER_ID, { search: "build" });
    expect(buildResults).toHaveLength(1);

    // Search in descriptions
    const dashboardResults = await getTasks(USER_ID, { search: "dashboard" });
    expect(dashboardResults).toHaveLength(2);

    // Case-insensitive search
    const reactResults = await getTasks(USER_ID, { search: "REACT" });
    expect(reactResults).toHaveLength(1);
  });

  it("handles tag-based filtering", async () => {
    await createTask({ title: "Frontend work", tags: ["frontend", "react"] }, USER_ID);
    await createTask({ title: "Backend work", tags: ["backend", "api"] }, USER_ID);
    await createTask({ title: "Full stack", tags: ["frontend", "backend"] }, USER_ID);

    // Filter by single tag
    const frontendTasks = await getTasks(USER_ID, { tags: ["frontend"] });
    expect(frontendTasks).toHaveLength(2);

    // Filter by multiple tags (OR logic)
    const anyTasks = await getTasks(USER_ID, { tags: ["react", "api"] });
    expect(anyTasks).toHaveLength(2);
  });

  it("validates input before persistence", async () => {
    // Invalid create input
    const invalidCreate = validateCreateTask({ title: "" });
    expect(invalidCreate.valid).toBe(false);

    // Invalid update input
    const invalidUpdate = validateUpdateTask({});
    expect(invalidUpdate.valid).toBe(false);

    // Valid input succeeds
    const validCreate = validateCreateTask({ title: "Valid task", priority: "high" });
    expect(validCreate.valid).toBe(true);

    const task = await createTask({ title: "Valid task", priority: "high" }, USER_ID);
    expect(task.priority).toBe("high");
  });

  it("maintains task ordering (newest first)", async () => {
    const task1 = await createTask({ title: "First" }, USER_ID);
    await new Promise((r) => setTimeout(r, 10));
    const task2 = await createTask({ title: "Second" }, USER_ID);
    await new Promise((r) => setTimeout(r, 10));
    const task3 = await createTask({ title: "Third" }, USER_ID);

    const tasks = await getTasks(USER_ID);
    expect(tasks[0].title).toBe("Third");
    expect(tasks[1].title).toBe("Second");
    expect(tasks[2].title).toBe("First");
  });
});
