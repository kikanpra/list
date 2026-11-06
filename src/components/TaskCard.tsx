import React from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  currentDate: string;
  onToggleComplete: (task: Task, e: React.MouseEvent) => void;
  onOpenDetail: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentDate,
  onToggleComplete,
  onOpenDetail,
}) => {
  const isCarriedOver = !task.completed && task.createdDate < currentDate;
  const isCompletedToday = task.completed && task.completedDate === currentDate;

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      onClick={() => onOpenDetail(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(task);
        }
      }}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none ${
        task.completed
          ? 'bg-[#EAE3D6]/70 border-[#1664B0]/20 opacity-80 shadow-xs'
          : 'bg-[#F9F6F0] border-[#1664B0]/20 hover:border-[#1664B0] hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Left zone: Checkbox + Title + Meta */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 pr-3">
        {/* Checkbox button */}
        <button
          type="button"
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          onClick={(e) => onToggleComplete(task, e)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer mt-0.5 sm:mt-0 ${
            task.completed
              ? 'bg-[#D21624] border-[#D21624] text-white shadow-xs'
              : 'border-[#1664B0] bg-transparent hover:bg-[#1664B0]/10'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-base sm:text-lg font-bold tracking-tight transition-colors leading-snug break-words ${
                task.completed
                  ? 'line-through text-[#111827]/50'
                  : 'text-[#111827] group-hover:text-[#1664B0]'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Unboxed editorial metadata */}
          <div className="flex items-center gap-2 mt-1 text-xs font-semibold tracking-wider uppercase text-[#1664B0]">
            <span>{task.category}</span>
            <span className="text-[#1664B0]/40">·</span>

            {isCompletedToday ? (
              <span className="text-[#D21624]">COMPLETED TODAY</span>
            ) : isCarriedOver ? (
              <span className="text-[#D21624] flex items-center gap-1 font-bold">
                CARRIED OVER
              </span>
            ) : (
              <span className="text-[#111827]/60">TODAY</span>
            )}

            {totalSubtasks > 0 && (
              <>
                <span className="text-[#1664B0]/40">·</span>
                <span className="text-[#111827]/60 tabular-nums">
                  {completedSubtasks}/{totalSubtasks} points
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right zone: Detail arrow */}
      <div className="shrink-0 flex items-center pl-2 text-[#1664B0] group-hover:translate-x-1 transition-transform">
        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1664B0]/10 transition-colors">
          <ChevronRight className="w-5 h-5 text-[#1664B0]" />
        </div>
      </div>
    </div>
  );
};
