import { Badge } from "@/components/ui/badge";
import { type TaskPriority } from "@/data/tasks";

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-zinc-100 text-zinc-600 hover:bg-zinc-100" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  high: { label: "High", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
