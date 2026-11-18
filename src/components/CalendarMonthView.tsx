'use client';

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Check, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { 
  MONTH_NAMES_ID, 
  DAY_NAMES_ID, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  createDateString,
  getTodayDateString,
  formatDateIndonesian
} from '@/utils/dateUtils';
import { DEFAULT_AMALAN_LIST } from '@/data/amalanData';

interface CalendarMonthViewProps {
  onOpenDateDetails?: (dateStr: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({ onOpenDateDetails }) => {
  const {
    calendarYear,
    calendarMonth,
    selectedDate,
    prevMonth,
    nextMonth,
    setCalendarMonth,
    setCalendarYear,
    setSelectedDate,
    jumpToToday,
    getDateCompletionPercentage,
    completedAmalan,
  } = useJalurLangitStore();

  const totalAmalan = DEFAULT_AMALAN_LIST.length;
  const [todayStr, setTodayStr] = React.useState<string>('2026-11-17');

  React.useEffect(() => {
    setTodayStr(getTodayDateString());
  }, []);

  const daysCount = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayOffset = getFirstDayOfMonth(calendarYear, calendarMonth); // 0 = Mon, 6 = Sun

  const selectedDatePercentage = getDateCompletionPercentage(selectedDate, totalAmalan);
  const selectedDateAmalanCount = (completedAmalan[selectedDate] || []).length;

  return (
    <div className="bg-white dark:bg-emerald-950/40 p-5 sm:p-6 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-5 animate-fade-in">
      {/* Month & Year Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            <CalendarIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                {MONTH_NAMES_ID[calendarMonth]} {calendarYear}
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Peta Kalender Amalan & Rutinitas Jalur Langit
            </p>
          </div>
        </div>

        {/* Controls: Prev, Today, Next */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={jumpToToday}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-stone-200 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors"
          >
            Hari Ini
          </button>

          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          </button>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          </button>
        </div>
      </div>

      {/* Month Horizontal Fast-Picker (Januari s/d Desember) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-stone-100 dark:border-emerald-900/40 pt-1">
        {MONTH_NAMES_ID.map((name, idx) => {
          const isSelectedMonth = calendarMonth === idx;
          return (
            <button
              key={name}
              onClick={() => setCalendarMonth(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelectedMonth
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-emerald-900/20'
              }`}
            >
              {name.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Calendar Grid Table */}
      <div>
        {/* Day Names Header (Senin s/d Minggu) */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
          {DAY_NAMES_ID.map((dayName, idx) => (
            <div
              key={dayName}
              className={`text-xs font-bold py-1.5 uppercase tracking-wider ${
                idx >= 5 ? 'text-rose-500' : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before Day 1 */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[58px] sm:min-h-[68px] rounded-2xl bg-stone-50/40 dark:bg-emerald-950/10 border border-transparent" />
          ))}

          {/* Actual days of the month */}
          {Array.from({ length: daysCount }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = createDateString(calendarYear, calendarMonth, dayNum);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const completion = getDateCompletionPercentage(dateStr, totalAmalan);
            const isFull = completion === 100;
            const hasStarted = completion > 0;

            let badgeStyle = 'bg-stone-50 dark:bg-emerald-900/20 border-stone-200/80 dark:border-emerald-900/50 text-stone-700 dark:text-stone-300';

            if (isFull) {
              badgeStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs';
            } else if (hasStarted) {
              badgeStyle = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-300';
            }

            if (isSelected) {
              badgeStyle += ' ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-emerald-950 scale-105 z-10';
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative min-h-[58px] sm:min-h-[68px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col items-center justify-between hover:scale-[1.03] active:scale-95 ${badgeStyle}`}
              >
                {/* Date Header with Today Dot */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold">{dayNum}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-white animate-ping" />
                  )}
                </div>

                {/* Progress Mini Gauge or Check */}
                <div className="w-full text-center">
                  {isFull ? (
                    <span className="text-[10px] font-bold flex items-center justify-center gap-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>100%</span>
                    </span>
                  ) : hasStarted ? (
                    <div className="w-full">
                      <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden my-0.5">
                        <div
                          className="bg-current h-full rounded-full"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-semibold opacity-90">{completion}%</span>
                    </div>
                  ) : (
                    <span className="text-[9px] opacity-40">—</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Summary & CTA */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-stone-500 uppercase font-semibold">
            Tanggal Terpilih:
          </div>
          <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
            {formatDateIndonesian(selectedDate)}
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            {selectedDateAmalanCount} dari {totalAmalan} amalan selesai ({selectedDatePercentage}%)
          </div>
        </div>

        {onOpenDateDetails && (
          <button
            onClick={() => onOpenDateDetails(selectedDate)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25"
          >
            <span>Buka Amalan Tanggal Ini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
