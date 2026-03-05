"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask, subscribe } from "@/lib/task-store";
import { Task } from "@/lib/types";

const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-500",
  P1: "bg-orange-400",
  P2: "bg-blue-400",
  P3: "bg-gray-400",
};

const PRIORITY_LABELS: Record<string, string> = {
  P0: "Critical",
  P1: "High",
  P2: "Medium",
  P3: "Low",
};

function formatDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    return subscribe(() => setTasks(getTasks()));
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <p className="text-lg mb-2">No tasks yet</p>
        <p className="text-sm">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs">
            Cmd+K
          </kbd>{" "}
          to add your first task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors group"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority]}`}
            title={PRIORITY_LABELS[task.priority]}
          />
          <span className="font-medium text-sm">{task.title}</span>
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
            >
              #{tag}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {task.dueDate && (
              <span className="text-xs text-neutral-400">
                {formatDate(task.dueDate)}
              </span>
            )}
            <span
              className={`px-1.5 py-0.5 rounded text-xs text-white ${PRIORITY_COLORS[task.priority]}`}
            >
              {task.priority}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
              aria-label="Delete task"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
