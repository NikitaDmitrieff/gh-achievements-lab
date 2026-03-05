import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "@/types";
import { generateId } from "@/lib/utils";

// In-memory store for development/testing. Will be replaced with Drizzle ORM + PostgreSQL.
let tasks: Task[] = [];

export function getTaskStore(): Task[] {
  return tasks;
}

export function setTaskStore(newTasks: Task[]): void {
  tasks = newTasks;
}

export function resetTaskStore(): void {
  tasks = [];
}

export async function getTasks(
  userId: string,
  filters?: TaskFilters,
): Promise<Task[]> {
  let result = tasks.filter((t) => t.userId === userId);

  if (filters?.status) {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters?.priority) {
    result = result.filter((t) => t.priority === filters.priority);
  }
  if (filters?.tags && filters.tags.length > 0) {
    result = result.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag)),
    );
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search),
    );
  }

  return result.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export async function getTaskById(
  id: string,
  userId: string,
): Promise<Task | null> {
  return tasks.find((t) => t.id === id && t.userId === userId) ?? null;
}

export async function createTask(
  input: CreateTaskInput,
  userId: string,
): Promise<Task> {
  const now = new Date();
  const task: Task = {
    id: generateId(),
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    tags: input.tags ?? [],
    userId,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  userId: string,
): Promise<Task | null> {
  const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) return null;

  tasks[index] = {
    ...tasks[index],
    ...input,
    updatedAt: new Date(),
  };
  return tasks[index];
}

export async function deleteTask(
  id: string,
  userId: string,
): Promise<boolean> {
  const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
