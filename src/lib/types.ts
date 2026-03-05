export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: Date | null;
  tags: string[];
  createdAt: Date;
}
