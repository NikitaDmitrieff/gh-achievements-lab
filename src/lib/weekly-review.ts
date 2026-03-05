import { Task, FocusArea, ReflectionPrompt, WeeklyReview } from "@/types/weekly-review";

export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatWeekLabel(start: Date, end: Date): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function computeFocusAreas(tasks: Task[]): FocusArea[] {
  const counts: Record<string, number> = {};
  for (const task of tasks) {
    counts[task.category] = (counts[task.category] || 0) + 1;
  }

  const total = tasks.length || 1;
  return Object.entries(counts)
    .map(([name, taskCount]) => ({
      name,
      taskCount,
      percentage: Math.round((taskCount / total) * 100),
    }))
    .sort((a, b) => b.taskCount - a.taskCount);
}

export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  {
    id: "went-well",
    question: "What went well this week?",
    placeholder: "Describe your wins and positive moments...",
  },
  {
    id: "to-improve",
    question: "What could be improved?",
    placeholder: "Identify areas where you can do better...",
  },
  {
    id: "key-learnings",
    question: "What were your key learnings?",
    placeholder: "Capture insights and takeaways...",
  },
  {
    id: "blockers",
    question: "What blocked your progress?",
    placeholder: "Note any obstacles or challenges faced...",
  },
];

const SAMPLE_TASKS: Task[] = [
  { id: "1", title: "Set up project scaffolding", completedAt: "2026-03-02T10:00:00Z", category: "Engineering" },
  { id: "2", title: "Design weekly review wireframes", completedAt: "2026-03-02T14:00:00Z", category: "Design" },
  { id: "3", title: "Implement authentication flow", completedAt: "2026-03-03T09:00:00Z", category: "Engineering" },
  { id: "4", title: "Write API documentation", completedAt: "2026-03-03T16:00:00Z", category: "Documentation" },
  { id: "5", title: "Review pull requests", completedAt: "2026-03-04T11:00:00Z", category: "Engineering" },
  { id: "6", title: "Team standup facilitation", completedAt: "2026-03-04T09:30:00Z", category: "Leadership" },
  { id: "7", title: "Fix navigation bug", completedAt: "2026-03-05T10:00:00Z", category: "Engineering" },
  { id: "8", title: "Plan sprint goals", completedAt: "2026-03-05T14:00:00Z", category: "Leadership" },
];

const PAST_REVIEWS: WeeklyReview[] = [
  {
    id: "review-prev-1",
    weekStart: "2026-02-23",
    weekEnd: "2026-03-01",
    tasks: [
      { id: "p1", title: "Initial project setup", completedAt: "2026-02-23T10:00:00Z", category: "Engineering" },
      { id: "p2", title: "Define product requirements", completedAt: "2026-02-24T14:00:00Z", category: "Product" },
      { id: "p3", title: "Stakeholder interviews", completedAt: "2026-02-25T11:00:00Z", category: "Research" },
      { id: "p4", title: "Create design system", completedAt: "2026-02-26T16:00:00Z", category: "Design" },
      { id: "p5", title: "Database schema design", completedAt: "2026-02-27T09:00:00Z", category: "Engineering" },
    ],
    focusAreas: [
      { name: "Engineering", taskCount: 2, percentage: 40 },
      { name: "Product", taskCount: 1, percentage: 20 },
      { name: "Research", taskCount: 1, percentage: 20 },
      { name: "Design", taskCount: 1, percentage: 20 },
    ],
    reflections: {
      "went-well": "Good progress on foundational work. Team alignment was strong.",
      "to-improve": "Need to timebox research sessions better.",
      "key-learnings": "Early stakeholder input saves rework later.",
    },
    goals: [
      { id: "g1", text: "Complete authentication module", completed: true },
      { id: "g2", text: "Ship first design iteration", completed: false },
      { id: "g3", text: "Set up CI/CD pipeline", completed: true },
    ],
    createdAt: "2026-03-01T18:00:00Z",
  },
  {
    id: "review-prev-2",
    weekStart: "2026-02-16",
    weekEnd: "2026-02-22",
    tasks: [
      { id: "pp1", title: "Market research", completedAt: "2026-02-16T10:00:00Z", category: "Research" },
      { id: "pp2", title: "Competitor analysis", completedAt: "2026-02-17T14:00:00Z", category: "Research" },
      { id: "pp3", title: "Tech stack evaluation", completedAt: "2026-02-18T11:00:00Z", category: "Engineering" },
    ],
    focusAreas: [
      { name: "Research", taskCount: 2, percentage: 67 },
      { name: "Engineering", taskCount: 1, percentage: 33 },
    ],
    reflections: {
      "went-well": "Thorough research gave us confidence in direction.",
      "to-improve": "Should have involved more team members in research.",
      "key-learnings": "Competitive landscape is less crowded than expected.",
    },
    goals: [
      { id: "g1", text: "Complete market research", completed: true },
      { id: "g2", text: "Choose tech stack", completed: true },
    ],
    createdAt: "2026-02-22T17:00:00Z",
  },
];

export function getCurrentWeekTasks(): Task[] {
  return SAMPLE_TASKS;
}

export function getPastReviews(): WeeklyReview[] {
  return PAST_REVIEWS;
}
