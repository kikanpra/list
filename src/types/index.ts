export type Category = 'Design' | 'Study' | 'Work' | 'Personal' | 'Other';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId?: string;
  title: string;
  category: Category;
  description: string;
  subtasks: Subtask[];
  createdDate: string; // YYYY-MM-DD
  dueDate: string;     // YYYY-MM-DD
  completed: boolean;
  completedDate: string | null; // YYYY-MM-DD
}

export type ViewMode = 'today' | 'calendar';
