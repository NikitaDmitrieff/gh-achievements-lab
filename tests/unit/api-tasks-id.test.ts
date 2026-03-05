import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { setupAuthMocks, setMockUser, resetMockUser } from "../mocks/auth";
import {
  setupDbMocks,
  resetDbMocks,
  mockGetTaskById,
  mockUpdateTask,
  mockDeleteTask,
} from "../mocks/db";
import { TEST_USER } from "../fixtures/users";
import { createMockTask } from "../fixtures/tasks";

setupAuthMocks();
setupDbMocks();

const { GET, PUT, DELETE } = await import("@/app/api/tasks/[id]/route");

function createRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), options);
}

const params = { params: { id: "task-001" } };

describe("GET /api/tasks/:id", () => {
  beforeEach(() => {
    resetMockUser();
    resetDbMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const req = createRequest("/api/tasks/task-001");
    const res = await GET(req, params);

    expect(res.status).toBe(401);
  });

  it("returns the task when found", async () => {
    setMockUser(TEST_USER);
    const task = createMockTask({ id: "task-001", title: "Found Task" });
    mockGetTaskById.mockResolvedValue(task);

    const req = createRequest("/api/tasks/task-001");
    const res = await GET(req, params);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("Found Task");
  });

  it("returns 404 when task not found", async () => {
    setMockUser(TEST_USER);
    mockGetTaskById.mockResolvedValue(null);

    const req = createRequest("/api/tasks/task-001");
    const res = await GET(req, params);

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/tasks/:id", () => {
  beforeEach(() => {
    resetMockUser();
    resetDbMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const req = createRequest("/api/tasks/task-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(401);
  });

  it("updates a task with valid input", async () => {
    setMockUser(TEST_USER);
    const updatedTask = createMockTask({ id: "task-001", title: "Updated", status: "done" });
    mockUpdateTask.mockResolvedValue(updatedTask);

    const req = createRequest("/api/tasks/task-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", status: "done" }),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("Updated");
    expect(body.status).toBe("done");
  });

  it("returns 400 for invalid JSON", async () => {
    setMockUser(TEST_USER);

    const req = createRequest("/api/tasks/task-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "bad json",
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(400);
  });

  it("returns 400 for validation errors", async () => {
    setMockUser(TEST_USER);

    const req = createRequest("/api/tasks/task-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
  });

  it("returns 404 when task not found", async () => {
    setMockUser(TEST_USER);
    mockUpdateTask.mockResolvedValue(null);

    const req = createRequest("/api/tasks/task-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, params);

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/tasks/:id", () => {
  beforeEach(() => {
    resetMockUser();
    resetDbMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const req = createRequest("/api/tasks/task-001", { method: "DELETE" });
    const res = await DELETE(req, params);

    expect(res.status).toBe(401);
  });

  it("deletes a task successfully", async () => {
    setMockUser(TEST_USER);
    mockDeleteTask.mockResolvedValue(true);

    const req = createRequest("/api/tasks/task-001", { method: "DELETE" });
    const res = await DELETE(req, params);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("returns 404 when task not found", async () => {
    setMockUser(TEST_USER);
    mockDeleteTask.mockResolvedValue(false);

    const req = createRequest("/api/tasks/task-001", { method: "DELETE" });
    const res = await DELETE(req, params);

    expect(res.status).toBe(404);
  });
});
