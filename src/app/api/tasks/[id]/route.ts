import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
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
=======
import { UpdateTaskSchema } from "@/types/task";
import { getTask, updateTask, deleteTask } from "@/lib/tasks";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await getTask(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ data: task });
  } catch (error) {
    console.error(`GET /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
>>>>>>> origin/main
}

export async function PUT(
  request: NextRequest,
<<<<<<< HEAD
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
=======
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = UpdateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const task = await updateTask(params.id, parsed.data);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error(`PUT /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
>>>>>>> origin/main
}

export async function DELETE(
  _request: NextRequest,
<<<<<<< HEAD
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
=======
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteTask(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error(`DELETE /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
>>>>>>> origin/main
}
