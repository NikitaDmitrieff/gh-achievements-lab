"use client";

import { Command } from "cmdk";
import { useEffect, useState, useCallback } from "react";
import { addTaskFromText, getTasks, deleteTask, subscribe } from "@/lib/task-store";
import { suggestTags } from "@/lib/parse-tags";
import { Task } from "@/lib/types";

const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-500",
  P1: "bg-orange-400",
  P2: "bg-blue-400",
  P3: "bg-gray-400",
};

function formatDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type PaletteMode = "command" | "add-task";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PaletteMode>("command");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastAdded, setLastAdded] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(getTasks());
    return subscribe(() => setTasks(getTasks()));
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setMode("command");
        setInput("");
        setLastAdded(null);
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  function handleAddTask() {
    if (!input.trim()) return;
    const task = addTaskFromText(input);
    setLastAdded(task);
    setInput("");
    setMode("command");
  }

  function handleDeleteTask(id: string) {
    deleteTask(id);
    setLastAdded(null);
  }

  const tagSuggestions = input.includes("#")
    ? suggestTags(input.split("#").pop() || "")
    : [];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setMode("command");
          setInput("");
          setLastAdded(null);
        }
      }}
      label="Command Palette"
      className="fixed inset-0 z-50"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {lastAdded && (
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
            <span>Task added:</span>
            <span className="font-medium">{lastAdded.title}</span>
            <span className={`ml-auto px-1.5 py-0.5 rounded text-xs text-white ${PRIORITY_COLORS[lastAdded.priority]}`}>
              {lastAdded.priority}
            </span>
            {lastAdded.dueDate && (
              <span className="text-xs opacity-70">{formatDate(lastAdded.dueDate)}</span>
            )}
          </div>
        )}

        <Command.Input
          value={input}
          onValueChange={setInput}
          onKeyDown={(e) => {
            if (mode === "add-task" && e.key === "Enter") {
              e.preventDefault();
              handleAddTask();
            }
            if (e.key === "Escape") {
              if (mode === "add-task") {
                setMode("command");
                setInput("");
              } else {
                setOpen(false);
              }
            }
          }}
          placeholder={
            mode === "add-task"
              ? "Type task... (e.g. 'Review PR tomorrow #work !!! urgent')"
              : "Type a command or search..."
          }
          className="w-full px-4 py-3 text-base bg-transparent border-b border-neutral-200 dark:border-neutral-700 outline-none text-foreground placeholder:text-neutral-400"
        />

        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-neutral-500">
            No results found.
          </Command.Empty>

          {mode === "command" && (
            <>
              <Command.Group heading="Actions" className="mb-2">
                <Command.Item
                  value="new task"
                  onSelect={() => {
                    setMode("add-task");
                    setInput("");
                    setLastAdded(null);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                >
                  <span className="text-lg">+</span>
                  <span>New Task</span>
                  <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                    Enter
                  </kbd>
                </Command.Item>
                <Command.Item
                  value="search tasks"
                  onSelect={() => setInput("")}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                >
                  <span className="text-lg">&#128269;</span>
                  <span>Search Tasks</span>
                </Command.Item>
              </Command.Group>

              {tasks.length > 0 && (
                <Command.Group heading="Tasks" className="mb-2">
                  {tasks.map((task) => (
                    <Command.Item
                      key={task.id}
                      value={`${task.title} ${task.tags.join(" ")}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800 group"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority]}`}
                      />
                      <span className="truncate">{task.title}</span>
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.dueDate && (
                        <span className="text-xs text-neutral-400 ml-auto shrink-0">
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 ml-1 shrink-0"
                        aria-label="Delete task"
                      >
                        &times;
                      </button>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading="Navigation" className="mb-2">
                <Command.Item
                  value="go home"
                  onSelect={() => {
                    setOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                >
                  <span className="text-lg">&#8962;</span>
                  <span>Go Home</span>
                </Command.Item>
              </Command.Group>
            </>
          )}

          {mode === "add-task" && (
            <>
              {input.trim() && (
                <Command.Group heading="Quick Add" className="mb-2">
                  <Command.Item
                    value={input}
                    onSelect={handleAddTask}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                  >
                    <span className="text-lg">+</span>
                    <span>Add &ldquo;{input.trim()}&rdquo;</span>
                    <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      Enter
                    </kbd>
                  </Command.Item>
                </Command.Group>
              )}

              {tagSuggestions.length > 0 && (
                <Command.Group heading="Tag Suggestions" className="mb-2">
                  {tagSuggestions.map((tag) => (
                    <Command.Item
                      key={tag}
                      value={`tag-${tag}`}
                      onSelect={() => {
                        const parts = input.split("#");
                        parts[parts.length - 1] = tag + " ";
                        setInput(parts.join("#"));
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                    >
                      <span className="text-neutral-400">#</span>
                      <span>{tag}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <div className="px-3 py-2 text-xs text-neutral-400 space-y-1">
                <p>Tip: Use natural language for dates (tomorrow, next friday, in 3 days)</p>
                <p>Priority: !!! urgent = P0, !! important = P1, p3/low = P3</p>
                <p>Tags: #work #personal #bug</p>
              </div>
            </>
          )}
        </Command.List>

        <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
              ↑↓
            </kbd>
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
              ↵
            </kbd>
            <span>Select</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
              Esc
            </kbd>
            <span>{mode === "add-task" ? "Back" : "Close"}</span>
          </div>
          {mode === "add-task" && (
            <span className="text-blue-400 font-medium">Adding task...</span>
          )}
        </div>
      </div>
    </Command.Dialog>
  );
}
