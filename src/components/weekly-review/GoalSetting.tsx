"use client";

import { useState } from "react";
import { WeeklyGoal } from "@/types/weekly-review";

interface GoalSettingProps {
  initialGoals?: WeeklyGoal[];
  onSave: (goals: WeeklyGoal[]) => void;
}

export default function GoalSetting({ initialGoals = [], onSave }: GoalSettingProps) {
  const [goals, setGoals] = useState<WeeklyGoal[]>(initialGoals);
  const [newGoal, setNewGoal] = useState("");
  const [saved, setSaved] = useState(false);

  function addGoal() {
    const text = newGoal.trim();
    if (!text) return;
    setGoals((prev) => [
      ...prev,
      { id: `goal-${Date.now()}`, text, completed: false },
    ]);
    setNewGoal("");
    setSaved(false);
  }

  function toggleGoal(id: string) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
    setSaved(false);
  }

  function removeGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setSaved(false);
  }

  function handleSave() {
    onSave(goals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Goals for Next Week
      </h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
          placeholder="Add a goal..."
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          onClick={addGoal}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
      </div>
      {goals.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No goals set yet. Add some goals for next week.
        </p>
      ) : (
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center gap-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                  goal.completed
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {goal.completed && (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  goal.completed
                    ? "text-gray-400 line-through dark:text-gray-500"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {goal.text}
              </span>
              <button
                onClick={() => removeGoal(goal.id)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Goals
        </button>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400">
            Saved!
          </span>
        )}
      </div>
    </section>
  );
}
