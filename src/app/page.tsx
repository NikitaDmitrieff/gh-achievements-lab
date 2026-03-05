import { CommandPalette } from "@/components/command-palette";
import { TaskList } from "@/components/task-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <CommandPalette />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Task Capture</h1>
          <p className="text-neutral-400 text-sm">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs">
              Cmd+K
            </kbd>{" "}
            to open the command palette and quickly add tasks.
          </p>
        </header>

        <TaskList />
      </div>
    </div>
  );
}
