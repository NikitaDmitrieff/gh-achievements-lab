import { NextRequest, NextResponse } from "next/server";
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
}

export async function PUT(
  request: NextRequest,
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
}

export async function DELETE(
  _request: NextRequest,
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
}
