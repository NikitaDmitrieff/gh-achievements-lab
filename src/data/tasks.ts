export type TaskStatus = "todo" | "in-progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const tasks: Task[] = [
  {
    id: "TASK-001",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment. Include linting, type checking, unit tests, and production builds.",
    status: "done",
    priority: "high",
    createdAt: "2026-02-15",
    updatedAt: "2026-02-20",
    tags: ["devops", "automation"],
  },
  {
    id: "TASK-002",
    title: "Design system tokens",
    description: "Define color palette, typography scale, spacing, and border radius tokens for consistent UI.",
    status: "done",
    priority: "medium",
    createdAt: "2026-02-16",
    updatedAt: "2026-02-22",
    tags: ["design", "ui"],
  },
  {
    id: "TASK-003",
    title: "User authentication flow",
    description: "Implement sign-up, sign-in, password reset, and email verification using NextAuth.js with GitHub and Google providers.",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2026-02-18",
    updatedAt: "2026-03-01",
    tags: ["auth", "security"],
  },
  {
    id: "TASK-004",
    title: "Dashboard layout and navigation",
    description: "Build the main dashboard shell with sidebar navigation, header, and responsive layout using Tailwind CSS.",
    status: "in-progress",
    priority: "high",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-02",
    tags: ["ui", "layout"],
  },
  {
    id: "TASK-005",
    title: "Database schema design",
    description: "Design and implement the PostgreSQL schema for tasks, users, teams, and activity logs.",
    status: "todo",
    priority: "high",
    createdAt: "2026-02-22",
    updatedAt: "2026-02-22",
    tags: ["database", "backend"],
  },
  {
    id: "TASK-006",
    title: "Task CRUD API endpoints",
    description: "Create REST API endpoints for creating, reading, updating, and deleting tasks with proper validation.",
    status: "todo",
    priority: "medium",
    createdAt: "2026-02-25",
    updatedAt: "2026-02-25",
    tags: ["api", "backend"],
  },
  {
    id: "TASK-007",
    title: "Real-time notifications",
    description: "Implement WebSocket-based real-time notifications for task assignments and status changes.",
    status: "todo",
    priority: "low",
    createdAt: "2026-02-28",
    updatedAt: "2026-02-28",
    tags: ["feature", "real-time"],
  },
  {
    id: "TASK-008",
    title: "Fix date picker timezone bug",
    description: "The date picker shows incorrect dates for users in negative UTC offsets. Normalize all dates to UTC before storage.",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-03",
    tags: ["bug", "ui"],
  },
  {
    id: "TASK-009",
    title: "Add unit tests for task service",
    description: "Write comprehensive unit tests for the task service layer covering create, update, delete, and query operations.",
    status: "todo",
    priority: "medium",
    createdAt: "2026-03-02",
    updatedAt: "2026-03-02",
    tags: ["testing"],
  },
  {
    id: "TASK-010",
    title: "Performance audit",
    description: "Run Lighthouse audit and optimize Core Web Vitals. Target LCP < 2.5s, FID < 100ms, CLS < 0.1.",
    status: "cancelled",
    priority: "low",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-04",
    tags: ["performance"],
  },
  {
    id: "TASK-011",
    title: "Export tasks to CSV",
    description: "Allow users to export filtered task lists to CSV format for reporting and external analysis.",
    status: "todo",
    priority: "low",
    createdAt: "2026-03-04",
    updatedAt: "2026-03-04",
    tags: ["feature", "export"],
  },
  {
    id: "TASK-012",
    title: "Mobile responsive sidebar",
    description: "Make the sidebar collapsible on mobile with a hamburger menu and slide-out animation.",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-03-04",
    updatedAt: "2026-03-05",
    tags: ["ui", "responsive"],
  },
];
