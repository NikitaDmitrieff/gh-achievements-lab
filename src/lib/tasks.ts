import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and, like, sql, type SQL } from "drizzle-orm";
import type { CreateTaskInput, UpdateTaskInput, Task, TaskQuery } from "@/types/task";
import { randomUUID } from "crypto";

function rowToTask(row: typeof tasks.$inferSelect): Task {
  return {
    ...row,
    tags: JSON.parse(row.tags) as string[],
  };
}

export async function listTasks(query: TaskQuery) {
  const conditions: SQL[] = [];

  if (query.status) {
    conditions.push(eq(tasks.status, query.status));
  }
  if (query.priority) {
    conditions.push(eq(tasks.priority, query.priority));
  }
  if (query.tag) {
    conditions.push(like(tasks.tags, `%"${query.tag}"%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(where)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
      .orderBy(tasks.createdAt),
    db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(where),
  ]);

  const total = countResult[0].count;

  return {
    data: rows.map(rowToTask),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  const id = randomUUID();

  const row = {
    id,
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? ("todo" as const),
    priority: input.priority ?? ("medium" as const),
    tags: JSON.stringify(input.tags ?? []),
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(tasks).values(row);
  return rowToTask(row);
}

export async function getTask(id: string): Promise<Task | null> {
  const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return rows.length > 0 ? rowToTask(rows[0]) : null;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
  const existing = await getTask(id);
  if (!existing) return null;

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.status !== undefined) updates.status = input.status;
  if (input.priority !== undefined) updates.priority = input.priority;
  if (input.tags !== undefined) updates.tags = JSON.stringify(input.tags);

  await db.update(tasks).set(updates).where(eq(tasks.id, id));
  return getTask(id);
}

export async function deleteTask(id: string): Promise<boolean> {
  const existing = await getTask(id);
  if (!existing) return false;

  await db.delete(tasks).where(eq(tasks.id, id));
  return true;
}
