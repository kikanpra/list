import React from 'react';
import { Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { ViewMode } from '../types';
import { formatHeaderDate } from '../utils/dateUtils';
import { AuthButton } from './AuthButton';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentDate: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenAddTask: () => void;
  user: User | null;
  authLoading: boolean;
  onSyncLocalTasks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  viewMode,
  setViewMode,
  onOpenAddTask,
  user,
  authLoading,
  onSyncLocalTasks,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#EFE8DE]/95 backdrop-blur-md border-b border-[#1664B0]/15 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('today')}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1664B0] rounded-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[#D21624] rounded-full inline-block group-hover:scale-110 transition-transform" />
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1664B0] uppercase leading-none">
                TO THE LIST
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium tracking-widest text-[#111827]/60 uppercase ml-5.5 hidden sm:block">
              Do it. Check it. Keep moving.
            </p>
          </button>
        </div>

        {/* Center / Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-[#E4DDD2] rounded-xl border border-[#1664B0]/10">
          <button
            onClick={() => setViewMode('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'today'
                ? 'bg-[#1664B0] text-white shadow-sm'
                : 'text-[#111827]/70 hover:text-[#111827] hover:bg-[#EFE8DE]/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>

          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-[#1664B0] text-white shadow-sm'
                : 'text-[#111827]/70 hover:text-[#111827] hover:bg-[#EFE8DE]/60'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </nav>

        {/* Right Info & Quick Action & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden lg:block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D21624] block">
              Active Date
            </span>
            <span className="font-display text-sm font-semibold text-[#111827] tabular-nums">
              {formatHeaderDate(currentDate)}
            </span>
          </div>

          <AuthButton
            user={user}
            loading={authLoading}
            onLoginSuccess={onSyncLocalTasks}
          />

          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase bg-[#1664B0] text-white hover:bg-[#13579b] active:scale-[0.98] transition-all cursor-pointer shadow-sm shrink-0"
          >
            <span className="text-sm font-bold leading-none">+</span>
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
