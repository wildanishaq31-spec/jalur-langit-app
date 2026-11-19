'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Volume2,
  BookOpen,
  HeartHandshake,
  MapPin
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
import { getDynamicAmalanTimeRange, isAmalanActiveNow } from '@/utils/prayerTimeService';

const CATEGORIES: { id: TimeCategory | 'semua'; label: string; icon: React.ReactNode }[] = [
  { id: 'semua', label: 'Semua Waktu', icon: <Sparkles className="w-3.5 h-3.5 shrink-0" /> },
  { id: 'dini_hari', label: 'Dini Hari', icon: <Moon className="w-3.5 h-3.5 shrink-0" /> },
  { id: 'subuh', label: 'Subuh', icon: <Sun className="w-3.5 h-3.5 shrink-0" /> },
  { id: 'dhuha', label: 'Dhuha & Siang', icon: <Sun className="w-3.5 h-3.5 shrink-0" /> },
  { id: 'petang', label: 'Petang', icon: <Sunset className="w-3.5 h-3.5 shrink-0" /> },
  { id: 'malam', label: 'Malam', icon: <Moon className="w-3.5 h-3.5 shrink-0" /> },
];

export const AmalanTab: React.FC = () => {
  const router = useRouter();
  const { 
    selectedDate, 
    setSelectedDate,
    jumpToToday,
    toggleAmalan, 
    isAmalanCompleted,
    getDateCompletionPercentage,
    notificationsEnabled,
    notificationTimes,
    userLocation,
    setIsAlarmModalOpen,
    navigateToTab,
  } = useJalurLangitStore();

  const [selectedCategory, setSelectedCategory] = useState<TimeCategory | 'semua'>('semua');
  const [expandedVirtueId, setExpandedVirtueId] = useState<string | null>(null);

  // Real-time clock & Active slot
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('19:40 WIB');
  const [nowClock, setNowClock] = useState<Date>(new Date());
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
    const now = new Date();
    setTodayStr(getTodayDateString());
    setCurrentTimeStr(getCurrentTimeString());
    setNowClock(now);
    setActiveSlot(getCurrentTimeCategory(notificationTimes));

    // Perbarui waktu HP dan amalan aktif setiap 5 detik secara realtime
    const timer = setInterval(() => {
      const liveNow = new Date();
      setNowClock(liveNow);
      setCurrentTimeStr(getCurrentTimeString());
      const slot = getCurrentTimeCategory(notificationTimes);
      setActiveSlot(slot);
    }, 5000);

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
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
              {userLocation?.cityName && (
                <>
                  <span className="text-xs text-stone-400 hidden sm:inline">•</span>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span className="truncate max-w-[150px]">{userLocation.cityName.split(',')[0]}</span>
                  </span>
                </>
              )}
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
                <span>Alarm GPS Aktif 🔔</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Atur Pengingat GPS</span>
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

      {/* Time Categories Filter Pills with Active Time Glow Dot - Responsive Grid Anti-Terpotong */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const isSlotCurrentlyActive = cat.id === activeSlot.category;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full py-2.5 px-1.5 sm:px-2.5 rounded-2xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative ${
                isActive
                  ? 'bg-emerald-800 text-amber-300 shadow-xs font-bold scale-[1.02]'
                  : 'bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-emerald-900/30'
              }`}
            >
              {cat.icon}
              <span className="truncate">{cat.label}</span>
              {isSlotCurrentlyActive && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Sedang Masuk Waktu Saat Ini" />
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
          const isToday = selectedDate === todayStr;
          const isCurrentSlot = isToday && isAmalanActiveNow(
            item.id,
            item.category,
            userLocation?.prayerTimes,
            nowClock
          );
          const dynamicTimeRange = getDynamicAmalanTimeRange(
            item.id,
            item.category,
            userLocation?.prayerTimes,
            userLocation?.timezoneOffset
          );

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 shadow-xs'
                  : isCurrentSlot
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/50 dark:ring-amber-500/40 shadow-sm'
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
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
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
                    {/* Time Window Pill (GPS-based Dynamic Prayer Time) */}
                    {dynamicTimeRange && (
                      <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{dynamicTimeRange}</span>
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

                  {/* Cross-Menu Action Link Button (Instant Prefetched Navigation) */}
                  {item.linkedMenu && (() => {
                    const targetRoute = item.linkedMenu.tab === 'home' ? '/dashboard' : `/${item.linkedMenu.tab}`;
                    return (
                      <div className="w-full mt-2.5 pt-2.5 border-t border-stone-100 dark:border-emerald-900/40 flex items-center justify-end">
                        <Link
                          href={targetRoute}
                          prefetch={true}
                          onClick={() => {
                            if (item.linkedMenu) {
                              navigateToTab(
                                item.linkedMenu.tab,
                                item.linkedMenu.subTab,
                                {
                                  presetId: item.linkedMenu.presetId,
                                  targetCount: item.targetCount,
                                  amalanId: item.id,
                                }
                              );
                            }
                          }}
                          className={`touch-manipulation select-none px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:opacity-80 transition-opacity ${
                            isDone
                              ? 'bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-emerald-900/60'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:text-amber-200 ring-1 ring-emerald-600/30'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                              <span>Sudah Dikerjakan (Buka Menu ↗)</span>
                            </>
                          ) : (
                            <>
                              {item.linkedMenu.tab === 'tasbih' && <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                              {item.linkedMenu.tab === 'hajat' && <HeartHandshake className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                              {item.linkedMenu.tab === 'quran' && <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                              <span>{item.linkedMenu.actionLabel} →</span>
                            </>
                          )}
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
