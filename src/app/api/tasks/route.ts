import { NextRequest, NextResponse } from "next/server";
import { getTasks, createTask } from "@/db";
import { getSessionUser, requireAuth } from "@/lib/auth";
import { validateCreateTask } from "@/lib/validation";
import { paginate } from "@/lib/utils";
import type { TaskFilters } from "@/types";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!requireAuth(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters: TaskFilters = {};

  const status = searchParams.get("status");
  if (status) filters.status = status as TaskFilters["status"];

  const priority = searchParams.get("priority");
  if (priority) filters.priority = priority as TaskFilters["priority"];

  const tags = searchParams.get("tags");
  if (tags) filters.tags = tags.split(",");

  const search = searchParams.get("search");
  if (search) filters.search = search;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

  const tasks = await getTasks(user.id, filters);
  const result = paginate(tasks, page, limit);

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!requireAuth(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = validateCreateTask(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  const task = await createTask(body as Parameters<typeof createTask>[0], user.id);
  return NextResponse.json(task, { status: 201 });
}
