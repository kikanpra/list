import React, { useState } from 'react';
import { Task, Subtask } from '../types';
import { X, Plus, Check, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { formatHeroDate } from '../utils/dateUtils';

interface TaskDetailModalProps {
  task: Task | null;
  currentDate: string;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMarkComplete: (task: Task) => void;
  onMarkIncomplete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  currentDate,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onMarkComplete,
  onMarkIncomplete,
}) => {
  if (!task) return null;

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isCarriedOver = !task.completed && task.createdDate < currentDate;
  const isCompleted = task.completed;

  // Toggle subtask completion
  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subId ? { ...st, completed: !st.completed } : st
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  // Add new subtask checklist point
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, newSub],
    });
    setNewSubtaskTitle('');
  };

  // Remove a subtask
  const handleRemoveSubtask = (subId: string) => {
    onUpdateTask({
      ...task,
      subtasks: task.subtasks.filter((st) => st.id !== subId),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111827]/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] flex flex-col bg-[#EFE8DE] rounded-3xl border-2 border-[#1664B0]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#E5DDCF] border-b border-[#1664B0]/15">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#1664B0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D21624]" />
            <span>TASK DETAILS</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#111827]/60 hover:text-[#111827] hover:bg-[#1664B0]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Title & Metadata */}
          <div>
            <h2
              className={`font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase leading-tight ${
                isCompleted ? 'line-through text-[#111827]/50' : 'text-[#111827]'
              }`}
            >
              {task.title}
            </h2>

            {/* Unboxed Metadata */}
            <div className="flex items-center gap-2 mt-2 text-xs font-bold tracking-wider uppercase text-[#1664B0]">
              <span>{task.category}</span>
              <span className="text-[#1664B0]/40">·</span>
              {isCompleted ? (
                <span className="text-[#D21624]">
                  COMPLETED ON {task.completedDate ? formatHeroDate(task.completedDate) : 'TODAY'}
                </span>
              ) : isCarriedOver ? (
                <span className="text-[#D21624]">CARRIED OVER FROM {task.createdDate}</span>
              ) : (
                <span className="text-[#111827]/70">TODAY</span>
              )}
            </div>

            {task.description && (
              <p className="mt-3 text-sm text-[#111827]/80 bg-[#F9F6F0] p-3.5 rounded-xl border border-[#1664B0]/10 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="border-t border-[#1664B0]/15 pt-4">
            {/* Checklist Section */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold tracking-wide uppercase text-[#1664B0]">
                WHAT NEEDS TO BE DONE?
              </h3>
              <span className="text-xs font-semibold text-[#111827]/60 tabular-nums">
                {task.subtasks.filter((s) => s.completed).length} / {task.subtasks.length} done
              </span>
            </div>

            {/* Subtasks list */}
            <div className="space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#F9F6F0] border border-[#1664B0]/10 hover:border-[#1664B0]/30 transition-all group"
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(sub.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                        sub.completed
                          ? 'bg-[#1664B0] border-[#1664B0] text-white'
                          : 'border-[#1664B0] bg-transparent hover:bg-[#1664B0]/10'
                      }`}
                    >
                      {sub.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        sub.completed
                          ? 'line-through text-[#111827]/45'
                          : 'text-[#111827]'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#111827]/40 hover:text-[#D21624] transition-all cursor-pointer"
                    title="Remove point"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask item form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add checklist point..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#F9F6F0] border border-[#1664B0]/20 rounded-xl focus:outline-none focus:border-[#1664B0] focus:ring-1 focus:ring-[#1664B0] placeholder:text-[#111827]/40"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-4 py-2 bg-[#1664B0] text-white text-xs font-semibold rounded-xl hover:bg-[#13579b] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions (Section 10) */}
        <div className="px-6 py-4 bg-[#E5DDCF] border-t border-[#1664B0]/15 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this task?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]/60 hover:text-[#D21624] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-[#EFE8DE] text-[#1664B0] border border-[#1664B0] hover:bg-[#E7E0D3] transition-colors cursor-pointer"
            >
              Close
            </button>

            {isCompleted ? (
              <button
                type="button"
                onClick={() => {
                  onMarkIncomplete(task);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#1664B0] text-white hover:bg-[#13579b] transition-colors cursor-pointer shadow-sm"
              >
                Mark as Incomplete
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onMarkComplete(task);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#D21624] text-white hover:bg-[#b5121e] active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>MARK AS COMPLETED</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
