import { describe, it, expect, vi, beforeEach } from "vitest";

// Re-import fresh module for each test
let addTaskFromText: typeof import("../task-store").addTaskFromText;
let getTasks: typeof import("../task-store").getTasks;
let deleteTask: typeof import("../task-store").deleteTask;
let subscribe: typeof import("../task-store").subscribe;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("../task-store");
  addTaskFromText = mod.addTaskFromText;
  getTasks = mod.getTasks;
  deleteTask = mod.deleteTask;
  subscribe = mod.subscribe;
});

describe("task-store", () => {
  it("adds a task from text with parsed fields", () => {
    const task = addTaskFromText("Review PR tomorrow #work p1");
    expect(task.title).toBe("Review PR");
    expect(task.priority).toBe("P1");
    expect(task.tags).toContain("work");
    expect(task.dueDate).not.toBeNull();
  });

  it("retrieves all tasks", () => {
    addTaskFromText("Task one");
    addTaskFromText("Task two");
    expect(getTasks().length).toBe(2);
  });

  it("deletes a task", () => {
    const task = addTaskFromText("Delete me");
    expect(getTasks().length).toBe(1);
    deleteTask(task.id);
    expect(getTasks().length).toBe(0);
  });

  it("notifies subscribers", () => {
    const callback = vi.fn();
    subscribe(callback);
    addTaskFromText("Notify test");
    expect(callback).toHaveBeenCalled();
  });
});
