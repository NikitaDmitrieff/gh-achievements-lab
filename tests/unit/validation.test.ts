import { describe, it, expect } from "vitest";
import { validateCreateTask, validateUpdateTask } from "@/lib/validation";

describe("validateCreateTask", () => {
  it("validates a correct input", () => {
    const result = validateCreateTask({
      title: "Test Task",
      description: "A description",
      status: "todo",
      priority: "medium",
      tags: ["test"],
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates with only required fields", () => {
    const result = validateCreateTask({ title: "Test Task" });
    expect(result.valid).toBe(true);
  });

  it("rejects null body", () => {
    const result = validateCreateTask(null);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe("body");
  });

  it("rejects non-object body", () => {
    const result = validateCreateTask("string");
    expect(result.valid).toBe(false);
  });

  it("rejects missing title", () => {
    const result = validateCreateTask({ description: "No title" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "title" }),
    );
  });

  it("rejects empty title", () => {
    const result = validateCreateTask({ title: "   " });
    expect(result.valid).toBe(false);
  });

  it("rejects title exceeding max length", () => {
    const result = validateCreateTask({ title: "a".repeat(201) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "title" }),
    );
  });

  it("rejects non-string description", () => {
    const result = validateCreateTask({ title: "Test", description: 123 });
    expect(result.valid).toBe(false);
  });

  it("rejects description exceeding max length", () => {
    const result = validateCreateTask({
      title: "Test",
      description: "a".repeat(2001),
    });
    expect(result.valid).toBe(false);
  });

  it("allows null description", () => {
    const result = validateCreateTask({ title: "Test", description: null });
    expect(result.valid).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = validateCreateTask({ title: "Test", status: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "status" }),
    );
  });

  it("accepts all valid statuses", () => {
    for (const status of ["todo", "in_progress", "done", "archived"]) {
      const result = validateCreateTask({ title: "Test", status });
      expect(result.valid).toBe(true);
    }
  });

  it("rejects invalid priority", () => {
    const result = validateCreateTask({ title: "Test", priority: "extreme" });
    expect(result.valid).toBe(false);
  });

  it("accepts all valid priorities", () => {
    for (const priority of ["low", "medium", "high", "urgent"]) {
      const result = validateCreateTask({ title: "Test", priority });
      expect(result.valid).toBe(true);
    }
  });

  it("rejects non-array tags", () => {
    const result = validateCreateTask({ title: "Test", tags: "test" });
    expect(result.valid).toBe(false);
  });

  it("rejects too many tags", () => {
    const tags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);
    const result = validateCreateTask({ title: "Test", tags });
    expect(result.valid).toBe(false);
  });

  it("rejects non-string tags", () => {
    const result = validateCreateTask({ title: "Test", tags: [1, 2] });
    expect(result.valid).toBe(false);
  });

  it("rejects tags exceeding max length", () => {
    const result = validateCreateTask({
      title: "Test",
      tags: ["a".repeat(51)],
    });
    expect(result.valid).toBe(false);
  });

  it("collects multiple errors", () => {
    const result = validateCreateTask({
      title: "",
      status: "invalid",
      priority: "extreme",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe("validateUpdateTask", () => {
  it("validates a correct input", () => {
    const result = validateUpdateTask({ title: "Updated" });
    expect(result.valid).toBe(true);
  });

  it("rejects null body", () => {
    const result = validateUpdateTask(null);
    expect(result.valid).toBe(false);
  });

  it("rejects empty update (no fields)", () => {
    const result = validateUpdateTask({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "body" }),
    );
  });

  it("allows updating only status", () => {
    const result = validateUpdateTask({ status: "done" });
    expect(result.valid).toBe(true);
  });

  it("allows updating only priority", () => {
    const result = validateUpdateTask({ priority: "high" });
    expect(result.valid).toBe(true);
  });

  it("allows updating only tags", () => {
    const result = validateUpdateTask({ tags: ["new-tag"] });
    expect(result.valid).toBe(true);
  });

  it("rejects empty title", () => {
    const result = validateUpdateTask({ title: "" });
    expect(result.valid).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = validateUpdateTask({ status: "wrong" });
    expect(result.valid).toBe(false);
  });

  it("validates all the same rules as create for provided fields", () => {
    const result = validateUpdateTask({
      title: "a".repeat(201),
      description: "a".repeat(2001),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
