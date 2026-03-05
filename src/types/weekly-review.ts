export interface Task {
  id: string;
  title: string;
  completedAt: string;
  category: string;
}

export interface FocusArea {
  name: string;
  taskCount: number;
  percentage: number;
}

export interface ReflectionPrompt {
  id: string;
  question: string;
  placeholder: string;
}

export interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  tasks: Task[];
  focusAreas: FocusArea[];
  reflections: Record<string, string>;
  goals: WeeklyGoal[];
  createdAt: string;
}
