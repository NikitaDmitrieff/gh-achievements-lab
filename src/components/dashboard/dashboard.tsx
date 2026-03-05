"use client";

import { useState, useMemo } from "react";
import { tasks as allTasks, type Task, type TaskStatus, type TaskPriority } from "@/data/tasks";
import { TaskFilters } from "./task-filters";
import { TaskList } from "./task-list";
import { TaskDetailDialog } from "./task-detail-dialog";
import { CheckSquare } from "lucide-react";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasActiveFilters = search !== "" || statusFilter !== "all" || priorityFilter !== "all";

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          task.id.toLowerCase().includes(q) ||
          task.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, statusFilter, priorityFilter]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const counts = useMemo(() => ({
    total: allTasks.length,
    todo: allTasks.filter((t) => t.status === "todo").length,
    inProgress: allTasks.filter((t) => t.status === "in-progress").length,
    done: allTasks.filter((t) => t.status === "done").length,
  }), []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-6 w-6 text-zinc-900" />
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Task Dashboard</h1>
          </div>
          <p className="text-sm text-zinc-500 mt-1 ml-9">
            Manage and track your project tasks
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Todo" value={counts.todo} color="zinc" />
          <StatCard label="In Progress" value={counts.inProgress} color="blue" />
          <StatCard label="Done" value={counts.done} color="green" />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-zinc-500 mb-3">
          {filteredTasks.length} of {allTasks.length} tasks
        </div>

        {/* Task list */}
        <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} />

        {/* Task detail modal */}
        <TaskDetailDialog
          task={selectedTask}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "zinc",
}: {
  label: string;
  value: number;
  color?: "zinc" | "blue" | "green";
}) {
  const colorClasses = {
    zinc: "bg-white",
    blue: "bg-white",
    green: "bg-white",
  };

  const valueColors = {
    zinc: "text-zinc-900",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg border border-zinc-200 p-3 sm:p-4`}>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </div>
      <div className={`text-2xl font-bold mt-1 ${valueColors[color]}`}>{value}</div>
    </div>
  );
}
