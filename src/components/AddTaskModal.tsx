import React, { useState } from 'react';
import { Category, Task, Subtask } from '../types';
import { X, Calendar as CalendarIcon, ListPlus } from 'lucide-react';
import { formatHeroDate } from '../utils/dateUtils';

interface AddTaskModalProps {
  isOpen: boolean;
  currentDate: string;
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
}

const CATEGORIES: Category[] = ['Design', 'Study', 'Work', 'Personal', 'Other'];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  currentDate,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Design');
  const [description, setDescription] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');
  const [taskDate, setTaskDate] = useState(currentDate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse subtasks from newline or comma separated lines
    const parsedSubtasks: Subtask[] = subtasksInput
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.]\s*/, '').trim())
      .filter(Boolean)
      .map((stTitle, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: stTitle,
        completed: false,
      }));

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      category,
      description: description.trim(),
      subtasks: parsedSubtasks,
      createdDate: taskDate || currentDate,
      dueDate: taskDate || currentDate,
      completed: false,
      completedDate: null,
    };

    onAddTask(newTask);
    // Reset form
    setTitle('');
    setDescription('');
    setSubtasksInput('');
    setCategory('Design');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111827]/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-[#EFE8DE] rounded-3xl border-2 border-[#1664B0]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#E5DDCF] border-b border-[#1664B0]/15">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D21624]" />
            <h3 className="font-display text-xl font-bold tracking-tight uppercase text-[#1664B0]">
              WHAT NEEDS TO BE DONE?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#111827]/60 hover:text-[#111827] hover:bg-[#1664B0]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#1664B0] mb-1.5">
              TASK NAME <span className="text-[#D21624]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Buat desain poster IT Fest"
              className="w-full px-4 py-3 bg-[#F9F6F0] text-sm sm:text-base font-semibold border-2 border-[#1664B0]/20 rounded-xl focus:outline-none focus:border-[#1664B0] focus:ring-1 focus:ring-[#1664B0] placeholder:text-[#111827]/40 placeholder:font-normal"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#1664B0] mb-1.5">
              CATEGORY
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#1664B0] text-white shadow-xs'
                      : 'bg-[#F9F6F0] text-[#111827]/70 border border-[#1664B0]/20 hover:border-[#1664B0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Details / Description */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#1664B0] mb-1.5">
              DETAILS & NOTES
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or context..."
              className="w-full px-4 py-2.5 bg-[#F9F6F0] text-xs sm:text-sm border border-[#1664B0]/20 rounded-xl focus:outline-none focus:border-[#1664B0] placeholder:text-[#111827]/40 resize-none"
            />
          </div>

          {/* Checklist Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold tracking-wider uppercase text-[#1664B0]">
                CHECKLIST POINTS (ONE PER LINE)
              </label>
              <span className="text-[11px] text-[#111827]/50">Optional</span>
            </div>
            <textarea
              rows={3}
              value={subtasksInput}
              onChange={(e) => setSubtasksInput(e.target.value)}
              placeholder="Tentukan konsep visual&#10;Buat layout utama&#10;Masukkan informasi acara&#10;Finalisasi desain"
              className="w-full px-4 py-2.5 bg-[#F9F6F0] text-xs sm:text-sm font-mono border border-[#1664B0]/20 rounded-xl focus:outline-none focus:border-[#1664B0] placeholder:text-[#111827]/40"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#1664B0] mb-1.5 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>DATE</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="px-3.5 py-2 bg-[#F9F6F0] text-xs sm:text-sm font-semibold border border-[#1664B0]/20 rounded-xl focus:outline-none focus:border-[#1664B0]"
              />
              <span className="text-xs text-[#111827]/60">
                {taskDate === currentDate ? 'Today (Active Date)' : formatHeroDate(taskDate)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#1664B0]/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase bg-[#EFE8DE] text-[#1664B0] border border-[#1664B0] hover:bg-[#E7E0D3] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#1664B0] text-white hover:bg-[#13579b] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              ADD TO LIST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
