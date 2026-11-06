import React, { useState } from 'react';
import { Task, Category } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, Sparkles, Filter } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  currentDate: string;
  onToggleComplete: (task: Task, e: React.MouseEvent) => void;
  onOpenDetail: (task: Task) => void;
  onOpenAddTask: () => void;
}

const CATEGORIES: Array<Category | 'All'> = ['All', 'Design', 'Study', 'Work', 'Personal', 'Other'];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentDate,
  onToggleComplete,
  onOpenDetail,
  onOpenAddTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Filter tasks for today's view
  // 1. Uncompleted tasks where createdDate <= currentDate (auto carried over!)
  // 2. Completed tasks where completedDate === currentDate
  const todayTasks = tasks.filter((t) => {
    if (t.completed) {
      return t.completedDate === currentDate;
    }
    return t.createdDate <= currentDate;
  });

  const filteredTasks = todayTasks.filter((t) => {
    if (selectedCategory === 'All') return true;
    return t.category === selectedCategory;
  });

  // Sort uncompleted first, completed at the bottom
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const activeCount = todayTasks.filter((t) => !t.completed).length;
  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1664B0]/15 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#1664B0]">
              TODAY'S TASKS
            </h3>
            <span className="font-display text-sm font-semibold text-[#111827]/60 tabular-nums">
              ({activeCount} remaining, {completedCount} done)
            </span>
          </div>
          <p className="text-xs text-[#111827]/70 mt-0.5">
            Click any task to inspect details and checklist subtasks.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onOpenAddTask}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wider uppercase bg-[#1664B0] text-white hover:bg-[#13579b] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ ADD TASK</span>
        </button>
      </div>

      {/* Category filter segmented tabs */}
      {todayTasks.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs font-semibold text-[#1664B0] flex items-center gap-1 mr-1 uppercase tracking-wider shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? todayTasks.length
                : todayTasks.filter((t) => t.category === cat).length;
            if (cat !== 'All' && count === 0) return null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#1664B0] text-white shadow-xs'
                    : 'bg-[#E7E0D3] text-[#111827]/70 hover:bg-[#dfd7c9] hover:text-[#111827]'
                }`}
              >
                {cat} <span className="opacity-75 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Task List or Empty State */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentDate={currentDate}
              onToggleComplete={onToggleComplete}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        /* Empty State (Section 24) */
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-[#1664B0]/20 bg-[#F9F6F0]/60 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 rounded-full bg-[#1664B0]/10 text-[#1664B0] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 stroke-[1.5]" />
          </div>

          <h4 className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#1664B0]">
            NOTHING ON THE LIST
          </h4>

          <p className="text-sm text-[#111827]/70 max-w-sm mx-auto mt-2 mb-6">
            “Your day is clear. Enjoy the moment or add something new.”
          </p>

          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase bg-[#1664B0] text-white hover:bg-[#13579b] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ ADD TASK</span>
          </button>
        </div>
      )}
    </div>
  );
};
