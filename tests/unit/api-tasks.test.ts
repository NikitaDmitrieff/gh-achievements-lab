import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { setupAuthMocks, setMockUser, resetMockUser } from "../mocks/auth";
import { setupDbMocks, resetDbMocks, mockGetTasks, mockCreateTask } from "../mocks/db";
import { TEST_USER } from "../fixtures/users";
import { SAMPLE_TASKS, createMockTask } from "../fixtures/tasks";

// Setup mocks before imports
setupAuthMocks();
setupDbMocks();

// Import after mocks are set up
const { GET, POST } = await import("@/app/api/tasks/route");

function createRequest(url: string, options?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), options);
}

describe("GET /api/tasks", () => {
  beforeEach(() => {
    resetMockUser();
    resetDbMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const req = createRequest("/api/tasks");
    const res = await GET(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns paginated tasks when authenticated", async () => {
    setMockUser(TEST_USER);
    mockGetTasks.mockResolvedValue(SAMPLE_TASKS);

    const req = createRequest("/api/tasks");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.total).toBe(SAMPLE_TASKS.length);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(20);
  });

  it("passes filters from query params", async () => {
    setMockUser(TEST_USER);
    mockGetTasks.mockResolvedValue([]);

    const req = createRequest("/api/tasks?status=todo&priority=high&search=test&tags=a,b");
    await GET(req);

    expect(mockGetTasks).toHaveBeenCalledWith(TEST_USER.id, {
      status: "todo",
      priority: "high",
      search: "test",
      tags: ["a", "b"],
    });
  });

  it("respects page and limit params", async () => {
    setMockUser(TEST_USER);
    const manyTasks = Array.from({ length: 30 }, (_, i) =>
      createMockTask({ id: `task-${i}`, title: `Task ${i}` }),
    );
    mockGetTasks.mockResolvedValue(manyTasks);

    const req = createRequest("/api/tasks?page=2&limit=10");
    const res = await GET(req);
    const body = await res.json();

    expect(body.page).toBe(2);
    expect(body.limit).toBe(10);
    expect(body.data).toHaveLength(10);
  });

  it("clamps limit to max 100", async () => {
    setMockUser(TEST_USER);
    mockGetTasks.mockResolvedValue([]);

    const req = createRequest("/api/tasks?limit=500");
    const res = await GET(req);
    const body = await res.json();

    expect(body.limit).toBe(100);
  });

  it("defaults page to 1 for invalid values", async () => {
    setMockUser(TEST_USER);
    mockGetTasks.mockResolvedValue([]);

    const req = createRequest("/api/tasks?page=-5");
    const res = await GET(req);
    const body = await res.json();

    expect(body.page).toBe(1);
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    resetMockUser();
    resetDbMocks();
  });

  it("returns 401 when not authenticated", async () => {
    const req = createRequest("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("creates a task with valid input", async () => {
    setMockUser(TEST_USER);
    const newTask = createMockTask({ title: "Created Task" });
    mockCreateTask.mockResolvedValue(newTask);

    const req = createRequest("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Created Task" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.title).toBe("Created Task");
  });

  it("returns 400 for invalid JSON body", async () => {
    setMockUser(TEST_USER);

    const req = createRequest("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid JSON body");
  });

  it("returns 400 for validation errors", async () => {
    setMockUser(TEST_USER);

    const req = createRequest("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "No title" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
  });

  it("passes input and user ID to createTask", async () => {
    setMockUser(TEST_USER);
    mockCreateTask.mockResolvedValue(createMockTask());

    const input = { title: "Test", priority: "high", tags: ["urgent"] };
    const req = createRequest("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    await POST(req);

    expect(mockCreateTask).toHaveBeenCalledWith(input, TEST_USER.id);
  });
});
