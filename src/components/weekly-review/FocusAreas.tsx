"use client";

import { FocusArea } from "@/types/weekly-review";

interface FocusAreasProps {
  areas: FocusArea[];
}

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export default function FocusAreas({ areas }: FocusAreasProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Focus Areas
      </h2>
      {areas.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete tasks to see your focus areas.
        </p>
      ) : (
        <div className="space-y-4">
          {areas.map((area, index) => (
            <div key={area.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {area.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {area.taskCount} tasks ({area.percentage}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${COLORS[index % COLORS.length]}`}
                  style={{ width: `${area.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
