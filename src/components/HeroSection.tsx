import React from 'react';
import { formatHeroDate } from '../utils/dateUtils';
import { CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  currentDate: string;
  completedCount: number;
  totalCount: number;
  carriedCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentDate,
  completedCount,
  totalCount,
  carriedCount,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <section className="relative bg-[#1664B0] text-white rounded-b-[2rem] sm:rounded-b-[2.75rem] px-6 sm:px-10 pt-8 pb-10 shadow-lg overflow-hidden">
      {/* Subtle minimalist stationery decorative elements in #EFE8DE and #D21624 */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 border-[12px] border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-8 right-12 hidden md:flex items-center gap-2 opacity-30 select-none">
        <span className="text-[#D21624] text-xl font-bold">+</span>
        <span className="text-[#EFE8DE] text-sm tracking-widest uppercase font-mono">TL-2026</span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Kicker */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2.5 h-2.5 bg-[#D21624] rounded-full inline-block" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#EFE8DE]/90">
            TO THE LIST
          </span>
          {carriedCount > 0 && (
            <span className="text-[11px] font-medium tracking-wide text-[#EFE8DE]/80 bg-white/10 px-2 py-0.5 rounded-md">
              {carriedCount} Carried Over
            </span>
          )}
        </div>

        {/* Hero Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase leading-[0.95] text-white">
              TODAY'S LIST
            </h2>
            <p className="font-display text-lg sm:text-xl text-[#EFE8DE] tracking-wide mt-2">
              {formatHeroDate(currentDate)}
            </p>
            <p className="text-sm text-white/80 italic mt-1 font-normal">
              “What needs to get done today?”
            </p>
          </div>

          {/* Metric counter */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 sm:px-6 sm:py-4 flex flex-col items-start md:items-end min-w-[200px]">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#EFE8DE]/80">
              TODAY'S PROGRESS
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-3xl sm:text-4xl font-bold tabular-nums text-white">
                {completedCount} / {totalCount}
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-[#EFE8DE]">
                COMPLETED
              </span>
            </div>
            {isAllCompleted && totalCount > 0 && (
              <span className="text-xs font-semibold text-[#EFE8DE] flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D21624]" />
                All tasks finished today!
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar (Sandy Linen track, Scarlet Bikini fill) */}
        <div className="space-y-2">
          <div className="w-full h-3.5 bg-[#EFE8DE] rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-[#D21624] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs font-medium text-[#EFE8DE]/90">
            <span>{percentage}% completed</span>
            <span>
              {totalCount === 0
                ? 'No tasks queued'
                : totalCount - completedCount === 0
                ? 'Goal achieved'
                : `${totalCount - completedCount} remaining`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
