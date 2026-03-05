import { NextRequest, NextResponse } from "next/server";
import { getTaskById, updateTask, deleteTask } from "@/db";
import { getSessionUser, requireAuth } from "@/lib/auth";
import { validateUpdateTask } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUser();
  if (!requireAuth(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await getTaskById(params.id, user.id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const validation = validateUpdateTask(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  const task = await updateTask(params.id, body as Parameters<typeof updateTask>[1], user.id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getSessionUser();
  if (!requireAuth(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deleteTask(params.id, user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
