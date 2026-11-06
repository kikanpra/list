/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Task, ViewMode } from './types';
import { auth } from './lib/firebase';
import {
  subscribeToUserTasks,
  saveTaskToFirestore,
  deleteTaskFromFirestore,
  syncLocalTasksToFirestore,
} from './services/taskService';
import {
  getStoredTasks,
  saveTasks,
  getStoredCurrentDate,
  saveStoredCurrentDate,
  resetToSampleData,
} from './utils/storage';
import { fireCompletionConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { DaySimulatorBar } from './components/DaySimulatorBar';
import { HeroSection } from './components/HeroSection';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AddTaskModal } from './components/AddTaskModal';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks());
  const [currentDate, setCurrentDate] = useState<string>(() => getStoredCurrentDate());
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time updates when user is logged in
  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for user's tasks in Firestore
    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (cloudTasks) => {
        if (cloudTasks.length > 0) {
          setTasks(cloudTasks);
          saveTasks(cloudTasks);
        } else {
          // If Firestore is empty but user had local tasks, seed Firestore with local tasks
          const localTasks = getStoredTasks();
          if (localTasks.length > 0) {
            syncLocalTasksToFirestore(user.uid, localTasks);
          }
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sync tasks to localStorage whenever tasks change (for offline resilience)
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync date to localStorage whenever currentDate changes
  useEffect(() => {
    saveStoredCurrentDate(currentDate);
  }, [currentDate]);

  // Handle Date Change (e.g. from DaySimulatorBar or Calendar)
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);

    // Carry-over system: for all uncompleted tasks that originated on or before newDate,
    // ensure their dueDate reflects the active carry-over date without creating duplicates.
    const updatedTasks = tasks.map((t) => {
      if (!t.completed && t.createdDate <= newDate && t.dueDate !== newDate) {
        const carried = { ...t, dueDate: newDate };
        if (user) {
          saveTaskToFirestore(user.uid, carried).catch(console.error);
        }
        return carried;
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  // Add a new task
  const handleAddTask = async (newTask: Task) => {
    const taskWithUser = user ? { ...newTask, userId: user.uid } : newTask;
    setTasks((prev) => [taskWithUser, ...prev]);

    if (user) {
      try {
        await saveTaskToFirestore(user.uid, taskWithUser);
      } catch (err) {
        console.error('Failed to save task to Firestore:', err);
      }
    }
  };

  // Update existing task (e.g. subtask toggled, edit)
  const handleUpdateTask = async (updatedTask: Task) => {
    const taskWithUser = user ? { ...updatedTask, userId: user.uid } : updatedTask;
    setTasks((prev) => prev.map((t) => (t.id === taskWithUser.id ? taskWithUser : t)));
    if (selectedTask?.id === taskWithUser.id) {
      setSelectedTask(taskWithUser);
    }

    if (user) {
      try {
        await saveTaskToFirestore(user.uid, taskWithUser);
      } catch (err) {
        console.error('Failed to update task in Firestore:', err);
      }
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    if (user) {
      try {
        await deleteTaskFromFirestore(user.uid, taskId);
      } catch (err) {
        console.error('Failed to delete task from Firestore:', err);
      }
    }
  };

  // Mark task as completed (Section 10)
  const handleMarkComplete = async (task: Task) => {
    const updated: Task = {
      ...task,
      userId: user ? user.uid : task.userId,
      completed: true,
      completedDate: currentDate,
      // Also mark all subtasks as completed if not already
      subtasks: task.subtasks.map((st) => ({ ...st, completed: true })),
    };

    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    if (selectedTask?.id === task.id) {
      setSelectedTask(updated);
    }

    fireCompletionConfetti();

    if (user) {
      try {
        await saveTaskToFirestore(user.uid, updated);
      } catch (err) {
        console.error('Failed to update task completion in Firestore:', err);
      }
    }
  };

  // Mark task as incomplete (revert)
  const handleMarkIncomplete = async (task: Task) => {
    const updated: Task = {
      ...task,
      userId: user ? user.uid : task.userId,
      completed: false,
      completedDate: null,
    };

    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    if (selectedTask?.id === task.id) {
      setSelectedTask(updated);
    }

    if (user) {
      try {
        await saveTaskToFirestore(user.uid, updated);
      } catch (err) {
        console.error('Failed to update task in Firestore:', err);
      }
    }
  };

  // Toggle complete from list checkbox directly
  const handleToggleComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.completed) {
      handleMarkIncomplete(task);
    } else {
      handleMarkComplete(task);
    }
  };

  // Reset to initial sample data
  const handleResetData = () => {
    if (confirm('Reset to initial sample tasks and date (06 Nov 2026)?')) {
      const reset = resetToSampleData();
      setTasks(reset.tasks);
      setCurrentDate(reset.currentDate);
      setSelectedTask(null);

      if (user) {
        // Upload sample tasks to Firestore
        syncLocalTasksToFirestore(user.uid, reset.tasks).catch(console.error);
      }
    }
  };

  // Sync local tasks on login
  const handleSyncOnLogin = useCallback(() => {
    if (user) {
      syncLocalTasksToFirestore(user.uid, tasks).catch(console.error);
    }
  }, [user, tasks]);

  // Calculate Today's metrics based on currentDate:
  // Today's tasks are:
  // 1. Uncompleted tasks created on or before currentDate (auto-carried over!)
  // 2. Tasks completed ON currentDate
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed) {
        return t.completedDate === currentDate;
      }
      return t.createdDate <= currentDate;
    });
  }, [tasks, currentDate]);

  const completedTodayCount = todayTasks.filter((t) => t.completed).length;
  const totalTodayCount = todayTasks.length;

  // Carried over tasks count: uncompleted tasks created before currentDate
  const carriedCount = todayTasks.filter((t) => !t.completed && t.createdDate < currentDate).length;

  return (
    <div className="min-h-screen bg-[#EFE8DE] text-[#111827] flex flex-col paper-pattern selection:bg-[#1664B0] selection:text-white">
      {/* Top Header */}
      <Header
        currentDate={currentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        user={user}
        authLoading={authLoading}
        onSyncLocalTasks={handleSyncOnLogin}
      />

      {/* Day Simulator & Carry-Over Controller Ribbon */}
      <DaySimulatorBar
        currentDate={currentDate}
        onDateChange={handleDateChange}
        carriedOverCount={carriedCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {viewMode === 'today' ? (
          <div>
            {/* Hero Section (Aegean Sky solid block) */}
            <HeroSection
              currentDate={currentDate}
              completedCount={completedTodayCount}
              totalCount={totalTodayCount}
              carriedCount={carriedCount}
            />

            {/* Today's Task List */}
            <TaskList
              tasks={tasks}
              currentDate={currentDate}
              onToggleComplete={handleToggleComplete}
              onOpenDetail={(task) => setSelectedTask(task)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
            />
          </div>
        ) : (
          /* Calendar View */
          <CalendarView
            tasks={tasks}
            currentDate={currentDate}
            onSelectTask={(task) => setSelectedTask(task)}
            onSetAsCurrentDate={(newDate) => {
              handleDateChange(newDate);
              setViewMode('today');
            }}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        currentDate={currentDate}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <TaskDetailModal
        task={selectedTask}
        currentDate={currentDate}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onMarkComplete={handleMarkComplete}
        onMarkIncomplete={handleMarkIncomplete}
      />

      {/* Minimal Digital Stationery Footer */}
      <footer className="mt-auto border-t border-[#1664B0]/15 bg-[#E7E0D3] py-6 px-4 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D21624]" />
            <span className="font-display font-bold text-sm tracking-wider uppercase text-[#1664B0]">
              TO THE LIST
            </span>
            <span className="text-[#1664B0]/40">·</span>
            <span className="text-[#111827]/70 font-medium">“Do it. Check it. Keep moving.”</span>
          </div>

          <div className="flex items-center gap-4 text-[#111827]/60">
            <span className="text-[11px] uppercase tracking-wider">
              {user ? (
                <span className="text-[#1664B0] font-semibold">Firebase Cloud Connected</span>
              ) : (
                'Aegean Sky · Sandy Linen · Scarlet Bikini'
              )}
            </span>

            <button
              onClick={handleResetData}
              title="Reset sample data and date"
              className="flex items-center gap-1 font-semibold text-[#1664B0] hover:text-[#D21624] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
