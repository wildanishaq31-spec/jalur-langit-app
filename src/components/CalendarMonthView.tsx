'use client';

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  ArrowRight,
  Heart
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
  const [todayStr, setTodayStr] = React.useState<string>(getTodayDateString);

  React.useEffect(() => {
    setTodayStr(getTodayDateString());
    const interval = setInterval(() => {
      setTodayStr(getTodayDateString());
    }, 10000);
    return () => clearInterval(interval);
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

      {/* Month Fast-Picker (Januari s/d Desember) - Responsive Grid agar pas di dalam Card */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 sm:gap-1.5 border-b border-stone-100 dark:border-emerald-900/40 pb-2.5 pt-1">
        {MONTH_NAMES_ID.map((name, idx) => {
          const isSelectedMonth = calendarMonth === idx;
          return (
            <button
              key={name}
              onClick={() => setCalendarMonth(idx)}
              className={`w-full py-1.5 px-0.5 rounded-xl text-[11px] sm:text-xs font-semibold text-center transition-all ${
                isSelectedMonth
                  ? 'bg-emerald-700 dark:bg-emerald-800 text-white dark:text-amber-300 font-bold shadow-xs scale-[1.02]'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-emerald-900/30'
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
            <div key={`empty-${i}`} className="min-h-[62px] sm:min-h-[72px] rounded-2xl bg-stone-50/40 dark:bg-emerald-950/10 border border-transparent" />
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
                className={`relative min-h-[62px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between hover:scale-[1.03] active:scale-95 ${badgeStyle}`}
              >
                {/* Today Animated Pulsing Outline (Menggantikan titik kuning kedap-kedip) */}
                {isToday && (
                  <span className="absolute -inset-[2px] rounded-2xl border-2 border-amber-400 dark:border-amber-300 animate-pulse pointer-events-none shadow-[0_0_8px_rgba(251,191,36,0.4)] z-20" />
                )}

                {/* Date Header: Angka di Pojok Kiri Atas */}
                <div className="w-full flex items-center justify-start">
                  <span className="text-xs sm:text-sm font-extrabold leading-none">{dayNum}</span>
                </div>

                {/* Center Animated Love Logo dengan Angka Persentase di Bawahnya */}
                <div className="w-full flex flex-col items-center justify-center my-auto pb-0.5">
                  {isFull ? (
                    <>
                      <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-rose-400 text-rose-300 animate-pulse shrink-0 drop-shadow-sm" />
                      <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight text-white mt-0.5">
                        100%
                      </span>
                    </>
                  ) : hasStarted ? (
                    <>
                      {/* Love icon dengan warna tidak penuh (partially filled according to completion %) */}
                      <span className="relative inline-flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 shrink-0 animate-pulse">
                        <Heart className="w-full h-full text-rose-500 dark:text-rose-400 stroke-2 fill-rose-500/20" />
                        <span
                          className="absolute bottom-0 left-0 w-full overflow-hidden"
                          style={{ height: `${completion}%` }}
                        >
                          <span className="absolute bottom-0 left-0 w-5 h-5 sm:w-5.5 sm:h-5.5">
                            <Heart className="w-full h-full fill-rose-500 text-rose-500" />
                          </span>
                        </span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 dark:text-amber-200 mt-0.5">
                        {completion}%
                      </span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-300 dark:text-stone-600 stroke-[1.8] fill-none animate-pulse shrink-0" />
                      <span className="text-[9px] font-semibold text-stone-400 dark:text-stone-500 opacity-60 mt-0.5">
                        —
                      </span>
                    </>
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
