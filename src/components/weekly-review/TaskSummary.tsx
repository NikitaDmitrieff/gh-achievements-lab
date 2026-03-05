"use client";

import { Task } from "@/types/weekly-review";

interface TaskSummaryProps {
  tasks: Task[];
}

export default function TaskSummary({ tasks }: TaskSummaryProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Completed Tasks
        </h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          {tasks.length} done
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tasks completed this week yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start justify-between gap-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {task.title}
                </span>
              </div>
              <span className="flex-shrink-0 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                {task.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
