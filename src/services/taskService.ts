import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Task } from '../types';

export function sanitizeTaskForFirestore(task: Task, userId: string): Record<string, unknown> {
  const cleanId = task.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return {
    id: cleanId,
    userId: userId,
    title: task.title.slice(0, 250),
    category: task.category,
    description: task.description ? task.description.slice(0, 2000) : '',
    subtasks: (task.subtasks || []).slice(0, 50).map((st) => ({
      id: String(st.id).slice(0, 64),
      title: String(st.title).slice(0, 200),
      completed: Boolean(st.completed),
    })),
    createdDate: task.createdDate,
    dueDate: task.dueDate,
    completed: Boolean(task.completed),
    completedDate: task.completedDate || null,
  };
}

export function subscribeToUserTasks(
  userId: string,
  onTasksLoaded: (tasks: Task[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const collectionPath = `users/${userId}/tasks`;
  const tasksRef = collection(db, 'users', userId, 'tasks');

  const unsubscribe = onSnapshot(
    tasksRef,
    (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tasks.push({
          id: data.id || docSnap.id,
          userId: data.userId,
          title: data.title || '',
          category: data.category || 'Other',
          description: data.description || '',
          subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
          createdDate: data.createdDate || '',
          dueDate: data.dueDate || '',
          completed: Boolean(data.completed),
          completedDate: data.completedDate || null,
        });
      });
      onTasksLoaded(tasks);
    },
    (error) => {
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );

  return unsubscribe;
}

export async function saveTaskToFirestore(userId: string, task: Task): Promise<void> {
  const cleanId = task.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/tasks/${cleanId}`;
  try {
    const payload = sanitizeTaskForFirestore(task, userId);
    await setDoc(doc(db, 'users', userId, 'tasks', cleanId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTaskFromFirestore(userId: string, taskId: string): Promise<void> {
  const cleanId = taskId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/tasks/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'tasks', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncLocalTasksToFirestore(userId: string, localTasks: Task[]): Promise<void> {
  const collectionPath = `users/${userId}/tasks`;
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const existingSnap = await getDocs(tasksRef);
    const existingIds = new Set(existingSnap.docs.map((d) => d.id));

    // Upload any local tasks not yet in cloud
    for (const t of localTasks) {
      const cleanId = t.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (!existingIds.has(cleanId)) {
        await saveTaskToFirestore(userId, t);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionPath);
  }
}
