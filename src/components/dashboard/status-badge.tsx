import { Badge } from "@/components/ui/badge";
import { type TaskStatus } from "@/data/tasks";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "Todo", className: "bg-zinc-200 text-zinc-700 hover:bg-zinc-200" },
  "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  done: { label: "Done", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
