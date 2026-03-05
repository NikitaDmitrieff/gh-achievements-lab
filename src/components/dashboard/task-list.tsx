"use client";

import { type Task } from "@/data/tasks";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header - hidden on mobile */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_120px_100px_100px] gap-4 px-4 py-2.5 bg-zinc-50 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        <div>Task</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Updated</div>
      </div>
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onTaskClick(task)}
          className="w-full text-left grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_100px] gap-2 sm:gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors focus:outline-none focus:bg-zinc-50"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">{task.id}</span>
              <span className="text-sm font-medium text-zinc-900 truncate">
                {task.title}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 truncate sm:hidden">
              {task.description}
            </p>
            {/* Mobile badges */}
            <div className="flex gap-2 mt-1.5 sm:hidden">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          {/* Desktop columns */}
          <div className="hidden sm:flex items-center">
            <StatusBadge status={task.status} />
          </div>
          <div className="hidden sm:flex items-center">
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="hidden sm:flex items-center text-xs text-zinc-500">
            {task.updatedAt}
          </div>
        </button>
      ))}
    </div>
  );
}
