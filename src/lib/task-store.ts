import { Task, Priority } from "./types";
import { parseDate } from "./parse-date";
import { parsePriority } from "./parse-priority";
import { parseTags } from "./parse-tags";

let tasks: Task[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getTasks(): Task[] {
  return [...tasks];
}

export function addTaskFromText(rawText: string): Task {
  const { tags, cleaned: afterTags } = parseTags(rawText);
  const { priority, cleaned: afterPriority } = parsePriority(afterTags);
  const { date, cleaned: title } = parseDate(afterPriority);

  const task: Task = {
    id: crypto.randomUUID(),
    title: title.replace(/\s+/g, " ").trim() || "Untitled task",
    priority,
    dueDate: date,
    tags,
    createdAt: new Date(),
  };

  tasks = [task, ...tasks];
  notify();
  return task;
}

export function deleteTask(id: string) {
  tasks = tasks.filter((t) => t.id !== id);
  notify();
}
