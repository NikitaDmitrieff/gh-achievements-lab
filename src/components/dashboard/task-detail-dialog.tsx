"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { Badge } from "@/components/ui/badge";
import { type Task } from "@/data/tasks";
import { Calendar, Clock } from "lucide-react";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange }: TaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
            {task.id}
          </div>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 w-20">Status</span>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 w-20">Priority</span>
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 w-20">Created</span>
            <div className="flex items-center gap-1.5 text-sm text-zinc-700">
              <Calendar className="h-3.5 w-3.5" />
              {task.createdAt}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 w-20">Updated</span>
            <div className="flex items-center gap-1.5 text-sm text-zinc-700">
              <Clock className="h-3.5 w-3.5" />
              {task.updatedAt}
            </div>
          </div>
          {task.tags.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-zinc-500 w-20 pt-0.5">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
