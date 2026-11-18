'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Info, 
  Moon, 
  Sun, 
  Sunset, 
  Sparkles,
  Calendar,
  RotateCcw,
  Clock,
  Bell,
  BellRing,
  Volume2
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { DEFAULT_AMALAN_LIST } from '@/data/amalanData';
import { TimeCategory, AmalanItem } from '@/types';
import { 
  formatDateIndonesian, 
  getTodayDateString, 
  getCurrentTimeString, 
  getCurrentTimeCategory,
  ActiveTimeSlot
} from '@/utils/dateUtils';
import { AlarmNotificationModal } from '@/components/modals/AlarmNotificationModal';
import { playGentleChime } from '@/utils/audioAlert';

const CATEGORIES: { id: TimeCategory | 'semua'; label: string; icon: React.ReactNode }[] = [
  { id: 'semua', label: 'Semua Waktu', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'dini_hari', label: 'Dini Hari', icon: <Moon className="w-4 h-4" /> },
  { id: 'subuh', label: 'Subuh', icon: <Sun className="w-4 h-4" /> },
  { id: 'dhuha', label: 'Dhuha & Siang', icon: <Sun className="w-4 h-4" /> },
  { id: 'petang', label: 'Petang', icon: <Sunset className="w-4 h-4" /> },
  { id: 'malam', label: 'Malam', icon: <Moon className="w-4 h-4" /> },
];

export const AmalanTab: React.FC = () => {
  const { 
    selectedDate, 
    setSelectedDate,
    jumpToToday,
    toggleAmalan, 
    isAmalanCompleted,
    getDateCompletionPercentage,
    notificationsEnabled,
    notificationTimes,
  } = useJalurLangitStore();

  const [selectedCategory, setSelectedCategory] = useState<TimeCategory | 'semua'>('semua');
  const [expandedVirtueId, setExpandedVirtueId] = useState<string | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  // Real-time clock & Active slot
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('19:40 WIB');
  const [activeSlot, setActiveSlot] = useState<ActiveTimeSlot>({
    category: 'malam',
    label: 'Waktu Malam',
    timeRange: '18:00 - 23:00 WIB',
    icon: '🌌',
    message: 'Waktunya Sholat Maghrib, Isya, membaca QS. Al-Mulk, Sholawat, & Muhasabah sebelum tidur.',
  });

  const totalAmalan = DEFAULT_AMALAN_LIST.length;
  const currentCompletion = getDateCompletionPercentage(selectedDate, totalAmalan);
  const [todayStr, setTodayStr] = useState<string>('2026-11-17');

  useEffect(() => {
    setTodayStr(getTodayDateString());
    setCurrentTimeStr(getCurrentTimeString());
    setActiveSlot(getCurrentTimeCategory());

    const timer = setInterval(() => {
      setCurrentTimeStr(getCurrentTimeString());
      const slot = getCurrentTimeCategory();
      setActiveSlot(slot);

      // Check notification alarm schedule if enabled
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const now = new Date();
        const currentH = String(now.getHours()).padStart(2, '0');
        const currentM = String(now.getMinutes()).padStart(2, '0');
        const nowHM = `${currentH}:${currentM}`;

        // Match against user notificationTimes
        Object.entries(notificationTimes).forEach(([cat, scheduledTime]) => {
          if (scheduledTime === nowHM && now.getSeconds() < 10) {
            playGentleChime();
            new Notification(`Jalur Langit: Masuk ${slot.label}! 🔔`, {
              body: slot.message,
              icon: '/icon.svg',
            });
          }
        });
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [notificationTimes]);

  const filteredAmalan = selectedCategory === 'semua'
    ? DEFAULT_AMALAN_LIST
    : DEFAULT_AMALAN_LIST.filter((a) => a.category === selectedCategory);

  const shiftDay = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${newYear}-${newMonth}-${newDay}`);
  };

  const handleToggle = (item: AmalanItem) => {
    const wasCompleted = isAmalanCompleted(selectedDate, item.id);
    toggleAmalan(selectedDate, item.id);

    if (!wasCompleted) {
      const newCompletion = getDateCompletionPercentage(selectedDate, totalAmalan);
      if (newCompletion >= 95 || newCompletion === 100) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0f3d2e', '#c9933b', '#2dd4bf', '#fbbf24']
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* 1. REAL-TIME HP CLOCK & ACTIVE SCHEDULE BANNER */}
      <div className="p-5 rounded-3xl border shadow-xs transition-all bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-amber-950/20 border-emerald-200/80 dark:border-emerald-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Waktu HP: {currentTimeStr}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                <span>{activeSlot.icon}</span>
                <span>{activeSlot.label}</span>
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {activeSlot.message}
            </p>
          </div>

          <button
            onClick={() => setIsAlarmModalOpen(true)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-shrink-0 ${
              notificationsEnabled
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-900 dark:bg-emerald-800 text-white hover:bg-stone-800'
            }`}
          >
            {notificationsEnabled ? (
              <>
                <BellRing className="w-3.5 h-3.5 text-amber-300" />
                <span>Alarm Aktif</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Atur Pengingat HP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. REAL CALENDAR DATE SELECTOR BAR */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs">
        <button
          onClick={() => shiftDay(-1)}
          className="p-2.5 rounded-2xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
          title="Hari Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5 text-stone-700 dark:text-stone-300" />
        </button>

        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-amber-400">
              Checklist Amalan Harian
            </span>
            {selectedDate !== todayStr && (
              <button
                onClick={jumpToToday}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-emerald-900 hover:bg-stone-200 text-stone-600 dark:text-stone-300"
              >
                Ke Hari Ini
              </button>
            )}
          </div>

          <div className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
            {formatDateIndonesian(selectedDate)}
          </div>

          <div className="text-xs text-stone-500 mt-0.5">
            Terselesaikan: <strong className="text-emerald-700 dark:text-emerald-400">{currentCompletion}%</strong>
          </div>
        </div>

        <button
          onClick={() => shiftDay(1)}
          className="p-2.5 rounded-2xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
          title="Hari Berikutnya"
        >
          <ChevronRight className="w-5 h-5 text-stone-700 dark:text-stone-300" />
        </button>
      </div>

      {/* Progress Bar of the Day */}
      <div className="w-full bg-stone-200 dark:bg-emerald-950/60 rounded-full h-3 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-emerald-600 to-amber-400"
          style={{ width: `${currentCompletion}%` }}
        />
      </div>

      {/* Time Categories Filter Pills with Active Time Glow Dot */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const isSlotCurrentlyActive = cat.id === activeSlot.category;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all relative ${
                isActive
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {isSlotCurrentlyActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Sedang Masuk Waktu Saat Ini" />
              )}
            </button>
          );
        })}
      </div>

      {/* Checklist Amalan Items with Time Windows */}
      <div className="space-y-3">
        {filteredAmalan.map((item) => {
          const isDone = isAmalanCompleted(selectedDate, item.id);
          const isVirtueExpanded = expandedVirtueId === item.id;
          const isCurrentSlot = item.category === activeSlot.category;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 shadow-xs'
                  : isCurrentSlot
                  ? 'bg-white dark:bg-emerald-950/30 border-amber-300 dark:border-amber-700/70 ring-1 ring-amber-300/60 dark:ring-amber-700/40 shadow-xs'
                  : 'bg-white dark:bg-emerald-950/20 border-stone-200/80 dark:border-emerald-800/60 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Custom Checkbox button */}
                <button
                  onClick={() => handleToggle(item)}
                  className={`mt-1 flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-stone-300 dark:border-emerald-700 hover:border-emerald-500 bg-white dark:bg-emerald-900/30'
                  }`}
                  aria-label={`Tandai ${item.title}`}
                >
                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-base font-bold transition-colors ${
                          isDone
                            ? 'line-through text-stone-500 dark:text-emerald-300/70'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {isCurrentSlot && !isDone && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold animate-pulse">
                          Waktu Sekarang
                        </span>
                      )}
                    </div>

                    {item.arabicTitle && (
                      <span className="font-arabic text-sm text-emerald-800 dark:text-amber-300/90 dir-rtl">
                        {item.arabicTitle}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Time Window Pill */}
                    {item.timeRange && (
                      <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{item.timeRange}</span>
                      </span>
                    )}

                    {item.targetCount && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                        🎯 Target: {item.targetCount} {item.targetUnit}
                      </span>
                    )}

                    {item.isPriority && (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
                        ⭐ Amalan Utama
                      </span>
                    )}

                    {item.virtue && (
                      <button
                        onClick={() => setExpandedVirtueId(isVirtueExpanded ? null : item.id)}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Keutamaan</span>
                      </button>
                    )}
                  </div>

                  {/* Expanded Virtue Note */}
                  {isVirtueExpanded && item.virtue && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-100/60 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed animate-fade-in">
                      <strong className="block mb-0.5 text-emerald-950 dark:text-amber-300 font-semibold">
                        Fadhilah & Dalil:
                      </strong>
                      {item.virtue}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alarm Notification Settings Modal */}
      <AlarmNotificationModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
      />
    </div>
  );
};
