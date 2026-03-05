import { z } from "zod/v4";

export const TaskStatus = z.enum(["todo", "in_progress", "done"]);
export const TaskPriority = z.enum(["low", "medium", "high"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const TaskQuerySchema = z.object({
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskQuery = z.infer<typeof TaskQuerySchema>;

export type TaskListResponse = {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TaskResponse = {
  data: Task;
};

export type ErrorResponse = {
  error: string;
  details?: unknown;
};
