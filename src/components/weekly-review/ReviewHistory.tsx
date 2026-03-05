"use client";

import { useState } from "react";
import { WeeklyReview } from "@/types/weekly-review";
import { formatDate } from "@/lib/weekly-review";

interface ReviewHistoryProps {
  reviews: WeeklyReview[];
}

export default function ReviewHistory({ reviews }: ReviewHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Review History
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No past reviews yet. Complete your first weekly review to start building history.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Review History
      </h2>
      <div className="space-y-3">
        {reviews.map((review) => {
          const isExpanded = expandedId === review.id;
          const weekStart = new Date(review.weekStart);
          const weekEnd = new Date(review.weekEnd);
          const completedGoals = review.goals.filter((g) => g.completed).length;

          return (
            <div
              key={review.id}
              className="rounded-md border border-gray-200 dark:border-gray-600"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : review.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(weekStart)} - {formatDate(weekEnd)}
                  </span>
                  <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{review.tasks.length} tasks</span>
                    <span>
                      {completedGoals}/{review.goals.length} goals met
                    </span>
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-600">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tasks Completed
                      </h4>
                      <ul className="space-y-1">
                        {review.tasks.map((task) => (
                          <li
                            key={task.id}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <svg
                              className="h-4 w-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {task.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {Object.keys(review.reflections).length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reflections
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(review.reflections).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="rounded bg-gray-50 p-2 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                              >
                                <span className="font-medium capitalize">
                                  {key.replace(/-/g, " ")}:
                                </span>{" "}
                                {value}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Goals
                      </h4>
                      <ul className="space-y-1">
                        {review.goals.map((goal) => (
                          <li
                            key={goal.id}
                            className={`flex items-center gap-2 text-sm ${
                              goal.completed
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {goal.completed ? (
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span className={goal.completed ? "line-through" : ""}>
                              {goal.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
