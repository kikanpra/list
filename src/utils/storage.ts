import { Task } from '../types';
import { INITIAL_DATE } from './dateUtils';

const STORAGE_KEY = 'to_the_list_tasks_v1';
const CURRENT_DATE_KEY = 'to_the_list_simulated_date_v1';

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Buat desain poster IT Fest',
    category: 'Design',
    description: 'Membuat konsep dan artwork poster untuk acara IT Fest kampus.',
    subtasks: [
      { id: 'sub-1-1', title: 'Tentukan konsep visual', completed: true },
      { id: 'sub-1-2', title: 'Buat layout utama', completed: true },
      { id: 'sub-1-3', title: 'Masukkan informasi acara', completed: false },
      { id: 'sub-1-4', title: 'Finalisasi desain & export', completed: false },
    ],
    createdDate: INITIAL_DATE,
    dueDate: INITIAL_DATE,
    completed: false,
    completedDate: null,
  },
  {
    id: 'task-2',
    title: 'Kerjakan laporan penelitian',
    category: 'Study',
    description: 'Menyusun analisis data eksperimen dan bab pembahasan laporan akhir.',
    subtasks: [
      { id: 'sub-2-1', title: 'Rapikan dataset', completed: true },
      { id: 'sub-2-2', title: 'Analisis data', completed: false },
      { id: 'sub-2-3', title: 'Buat visualisasi grafik', completed: false },
      { id: 'sub-2-4', title: 'Tulis hasil dan kesimpulan', completed: false },
    ],
    createdDate: INITIAL_DATE,
    dueDate: INITIAL_DATE,
    completed: false,
    completedDate: null,
  },
  {
    id: 'task-3',
    title: 'Upload desain Instagram',
    category: 'Work',
    description: 'Publikasi materi visual carousel Instagram mingguan perusahaan.',
    subtasks: [
      { id: 'sub-3-1', title: 'Export desain resolusi tinggi', completed: true },
      { id: 'sub-3-2', title: 'Buat caption & hashtag', completed: true },
      { id: 'sub-3-3', title: 'Upload ke Creator Studio', completed: true },
      { id: 'sub-3-4', title: 'Cek postingan live', completed: true },
    ],
    createdDate: INITIAL_DATE,
    dueDate: INITIAL_DATE,
    completed: true,
    completedDate: INITIAL_DATE,
  },
];

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasks(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveTasks(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return SAMPLE_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

export function getStoredCurrentDate(): string {
  try {
    const stored = localStorage.getItem(CURRENT_DATE_KEY);
    if (stored && /^\d{4}-\d{2}-\d{2}$/.test(stored)) {
      return stored;
    }
    return INITIAL_DATE;
  } catch {
    return INITIAL_DATE;
  }
}

export function saveStoredCurrentDate(dateStr: string): void {
  try {
    localStorage.setItem(CURRENT_DATE_KEY, dateStr);
  } catch (e) {
    console.error('Error saving current date to localStorage', e);
  }
}

export function resetToSampleData(): { tasks: Task[]; currentDate: string } {
  saveTasks(SAMPLE_TASKS);
  saveStoredCurrentDate(INITIAL_DATE);
  return { tasks: SAMPLE_TASKS, currentDate: INITIAL_DATE };
}
