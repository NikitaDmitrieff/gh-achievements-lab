"use client";

import { useMemo } from "react";
import TaskSummary from "@/components/weekly-review/TaskSummary";
import FocusAreas from "@/components/weekly-review/FocusAreas";
import ReflectionPrompts from "@/components/weekly-review/ReflectionPrompts";
import GoalSetting from "@/components/weekly-review/GoalSetting";
import ReviewHistory from "@/components/weekly-review/ReviewHistory";
import {
  getWeekRange,
  formatWeekLabel,
  computeFocusAreas,
  getCurrentWeekTasks,
  getPastReviews,
  REFLECTION_PROMPTS,
} from "@/lib/weekly-review";

export default function WeeklyReviewPage() {
  const { start, end } = useMemo(() => getWeekRange(), []);
  const tasks = useMemo(() => getCurrentWeekTasks(), []);
  const focusAreas = useMemo(() => computeFocusAreas(tasks), [tasks]);
  const pastReviews = useMemo(() => getPastReviews(), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              &larr; Home
            </a>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Weekly Review
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatWeekLabel(start, end)}
          </p>
        </header>

        <div className="space-y-6">
          <TaskSummary tasks={tasks} />
          <FocusAreas areas={focusAreas} />
          <ReflectionPrompts
            prompts={REFLECTION_PROMPTS}
            onSave={(reflections) => {
              console.log("Reflections saved:", reflections);
            }}
          />
          <GoalSetting
            onSave={(goals) => {
              console.log("Goals saved:", goals);
            }}
          />
          <ReviewHistory reviews={pastReviews} />
        </div>
      </div>
    </div>
  );
}
