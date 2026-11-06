import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import {
  parseISODate,
  formatHeroDate,
  formatMonthYear,
  getMonthMatrix,
  formatDateToISO,
} from '../utils/dateUtils';

interface CalendarViewProps {
  tasks: Task[];
  currentDate: string;
  onSelectTask: (task: Task) => void;
  onSetAsCurrentDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  currentDate,
  onSelectTask,
  onSetAsCurrentDate,
}) => {
  const currentDateObj = parseISODate(currentDate);
  const [selectedYear, setSelectedYear] = useState(currentDateObj.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDateObj.getMonth());
  const [activeDateStr, setActiveDateStr] = useState(currentDate);

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const jumpToToday = () => {
    const today = parseISODate(currentDate);
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setActiveDateStr(currentDate);
  };

  const matrix = getMonthMatrix(selectedYear, selectedMonth);

  // Group completed tasks by completedDate
  const completedTasksByDate: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (t.completed && t.completedDate) {
      if (!completedTasksByDate[t.completedDate]) {
        completedTasksByDate[t.completedDate] = [];
      }
      completedTasksByDate[t.completedDate].push(t);
    }
  });

  const selectedDateTasks = completedTasksByDate[activeDateStr] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1664B0]/15 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D21624]" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight uppercase text-[#1664B0]">
              CALENDAR
            </h2>
          </div>
          <p className="text-xs text-[#111827]/70 mt-1">
            Archived completion ledger. Completed tasks are pinned to their completion date.
          </p>
        </div>

        {/* Month Stepper */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={jumpToToday}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#E7E0D3] text-[#1664B0] border border-[#1664B0]/20 rounded-xl hover:bg-[#dfd7c9] transition-colors cursor-pointer"
          >
            Today ({currentDate.slice(5)})
          </button>

          <div className="flex items-center bg-[#F9F6F0] rounded-xl border border-[#1664B0]/20 p-1 shadow-xs">
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="p-1.5 hover:bg-[#1664B0]/10 text-[#1664B0] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-display px-3 text-sm sm:text-base font-bold text-[#111827] uppercase tracking-wider min-w-[140px] text-center">
              {formatMonthYear(selectedYear, selectedMonth)}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="p-1.5 hover:bg-[#1664B0]/10 text-[#1664B0] rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-[#F9F6F0] rounded-3xl border-2 border-[#1664B0]/15 p-4 sm:p-6 shadow-sm mb-8">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pb-2 mb-2 border-b border-[#1664B0]/10 text-xs font-bold uppercase tracking-wider text-[#1664B0]">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Days Matrix */}
        <div className="space-y-1 sm:space-y-2">
          {matrix.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-1 sm:gap-2">
              {week.map((dayItem) => {
                const isSelected = dayItem.dateStr === activeDateStr;
                const isToday = dayItem.dateStr === currentDate;
                const completedForThisDay = completedTasksByDate[dayItem.dateStr] || [];
                const count = completedForThisDay.length;

                return (
                  <button
                    key={dayItem.dateStr}
                    onClick={() => setActiveDateStr(dayItem.dateStr)}
                    className={`relative min-h-[58px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-center transition-all cursor-pointer ${
                      isToday
                        ? 'bg-[#1664B0] text-white shadow-sm ring-2 ring-[#1664B0] ring-offset-2 ring-offset-[#F9F6F0]'
                        : isSelected
                        ? 'bg-[#E7E0D3] border-2 border-[#1664B0] text-[#111827]'
                        : dayItem.isCurrentMonth
                        ? 'bg-[#EFE8DE]/60 hover:bg-[#EFE8DE] border border-[#1664B0]/10 text-[#111827]'
                        : 'bg-transparent text-[#111827]/30 border border-transparent'
                    }`}
                  >
                    {/* Day number */}
                    <span
                      className={`font-display text-base sm:text-xl font-bold leading-none ${
                        isToday ? 'text-white' : ''
                      }`}
                    >
                      {String(dayItem.dayNumber).padStart(2, '0')}
                    </span>

                    {/* Red completion dots indicator (Section 15 & 17) */}
                    <div className="flex items-center justify-center gap-1 min-h-[14px]">
                      {count > 0 && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full inline-block ${
                                isToday ? 'bg-white' : 'bg-[#D21624]'
                              }`}
                            />
                          ))}
                          {count > 3 && (
                            <span
                              className={`text-[9px] font-bold ${
                                isToday ? 'text-white' : 'text-[#D21624]'
                              }`}
                            >
                              +{count - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-[#1664B0]/10 text-xs text-[#111827]/70">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-[#1664B0] inline-block" />
              <span>Active Date (Today)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D21624] inline-block" />
              <span>Completed Task Indicator</span>
            </div>
          </div>

          <div className="text-[11px] text-[#1664B0] font-semibold">
            Click any date to inspect finished items
          </div>
        </div>
      </div>

      {/* Selected Date Detail View (Section 16) */}
      <div className="bg-[#F9F6F0] rounded-3xl border-2 border-[#1664B0]/15 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1664B0]/15 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D21624] block">
              COMPLETED ARCHIVE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#1664B0]">
              {formatHeroDate(activeDateStr)}
            </h3>
          </div>

          {activeDateStr !== currentDate && (
            <button
              onClick={() => onSetAsCurrentDate(activeDateStr)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1664B0] text-white hover:bg-[#13579b] transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>Set as Active Date</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {selectedDateTasks.length > 0 ? (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#1664B0] mb-2">
              COMPLETED TASKS ({selectedDateTasks.length})
            </h4>
            {selectedDateTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFE8DE] border border-[#1664B0]/15 hover:border-[#1664B0] hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D21624] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-[#111827] group-hover:text-[#1664B0] transition-colors line-through">
                      {t.title}
                    </span>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1664B0] mt-0.5">
                      {t.category} · Completed
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#1664B0] group-hover:translate-x-1 transition-transform">
                  View ›
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-full bg-[#1664B0]/10 text-[#1664B0] flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold uppercase text-[#1664B0]">
              No completed tasks
            </h4>
            <p className="text-xs text-[#111827]/60 mt-1 max-w-xs mx-auto">
              No tasks were recorded as completed on this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
