import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar, ArrowRight } from 'lucide-react';
import { shiftDate, formatHeaderDate, INITIAL_DATE } from '../utils/dateUtils';

interface DaySimulatorBarProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  carriedOverCount: number;
}

export const DaySimulatorBar: React.FC<DaySimulatorBarProps> = ({
  currentDate,
  onDateChange,
  carriedOverCount,
}) => {
  const isDefaultDate = currentDate === INITIAL_DATE;

  const handlePrevDay = () => {
    onDateChange(shiftDate(currentDate, -1));
  };

  const handleNextDay = () => {
    onDateChange(shiftDate(currentDate, 1));
  };

  const handleReset = () => {
    onDateChange(INITIAL_DATE);
  };

  return (
    <div className="bg-[#E7E0D3] border-b border-[#1664B0]/10 px-4 py-2.5 text-xs">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Date Stepper */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1664B0] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Date Simulator:
          </span>

          <div className="flex items-center bg-[#EFE8DE] rounded-lg border border-[#1664B0]/20 p-0.5 shadow-xs">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 hover:bg-[#1664B0]/10 text-[#1664B0] rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="font-display px-2.5 font-bold text-[#111827] tabular-nums text-sm">
              {formatHeaderDate(currentDate)}
            </span>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 hover:bg-[#1664B0]/10 text-[#1664B0] rounded-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isDefaultDate && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#1664B0] bg-[#EFE8DE] border border-[#1664B0]/30 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to 06 Nov</span>
            </button>
          )}
        </div>

        {/* Right: Carry-over feedback info */}
        <div className="flex items-center gap-2 text-[#111827]/75">
          {carriedOverCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1664B0]/10 text-[#1664B0] font-semibold text-[11px]">
              <ArrowRight className="w-3 h-3 text-[#D21624]" />
              {carriedOverCount} task{carriedOverCount > 1 ? 's' : ''} carried over to this date
            </span>
          ) : (
            <span className="text-[11px] hidden sm:inline text-[#111827]/60">
              Uncompleted tasks auto-carry over when advancing dates
            </span>
          )}

          <button
            onClick={handleNextDay}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-[#1664B0] text-white rounded-lg hover:bg-[#13579b] transition-colors cursor-pointer shadow-xs ml-1"
          >
            <span>Simulate Next Day →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
