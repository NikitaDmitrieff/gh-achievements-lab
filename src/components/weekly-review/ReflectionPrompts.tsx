"use client";

import { useState } from "react";
import { ReflectionPrompt } from "@/types/weekly-review";

interface ReflectionPromptsProps {
  prompts: ReflectionPrompt[];
  initialValues?: Record<string, string>;
  onSave: (reflections: Record<string, string>) => void;
}

export default function ReflectionPrompts({
  prompts,
  initialValues = {},
  onSave,
}: ReflectionPromptsProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saved, setSaved] = useState(false);

  function handleChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  }

  function handleSave() {
    onSave(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Reflections
      </h2>
      <div className="space-y-5">
        {prompts.map((prompt) => (
          <div key={prompt.id}>
            <label
              htmlFor={prompt.id}
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {prompt.question}
            </label>
            <textarea
              id={prompt.id}
              rows={3}
              value={values[prompt.id] || ""}
              onChange={(e) => handleChange(prompt.id, e.target.value)}
              placeholder={prompt.placeholder}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Reflections
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
