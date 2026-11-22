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
import { AmalanDetailModal } from '@/components/modals/AmalanDetailModal';
import { QiyamulLailModal } from '@/components/modals/QiyamulLailModal';
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

export type HukumFilter = 'semua' | 'wajib' | 'sunnah_muakkadah' | 'sunnah_ghairu';

export function getAmalanHukumType(item: AmalanItem): 'wajib' | 'sunnah_muakkadah' | 'sunnah_ghairu' {
  const h = (item.hukum || '').toLowerCase();
  if (h.includes('fardhu') || h.includes('wajib')) {
    return 'wajib';
  }
  if (h.includes("mu'akkadah") || h.includes('muakkadah')) {
    return 'sunnah_muakkadah';
  }
  return 'sunnah_ghairu';
}

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
  const [selectedHukum, setSelectedHukum] = useState<HukumFilter>('semua');
  const [viewMode, setViewMode] = useState<'waktu' | 'kelompok'>('waktu');
  const [expandedVirtueId, setExpandedVirtueId] = useState<string | null>(null);
  const [selectedDetailAmalan, setSelectedDetailAmalan] = useState<AmalanItem | null>(null);
  const [isQiyamModalOpen, setIsQiyamModalOpen] = useState(false);

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

  // Klasifikasi dan Penghitungan Status Hukum
  const wajibList = DEFAULT_AMALAN_LIST.filter(a => getAmalanHukumType(a) === 'wajib');
  const sunnahMuakkadahList = DEFAULT_AMALAN_LIST.filter(a => getAmalanHukumType(a) === 'sunnah_muakkadah');
  const sunnahGhairuList = DEFAULT_AMALAN_LIST.filter(a => getAmalanHukumType(a) === 'sunnah_ghairu');

  const wajibDoneCount = wajibList.filter(a => isAmalanCompleted(selectedDate, a.id)).length;
  const sunnahMuakkadahDoneCount = sunnahMuakkadahList.filter(a => isAmalanCompleted(selectedDate, a.id)).length;
  const sunnahGhairuDoneCount = sunnahGhairuList.filter(a => isAmalanCompleted(selectedDate, a.id)).length;

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

  let filteredAmalan = DEFAULT_AMALAN_LIST;
  if (selectedCategory !== 'semua') {
    filteredAmalan = filteredAmalan.filter((a) => a.category === selectedCategory);
  }
  if (selectedHukum !== 'semua') {
    filteredAmalan = filteredAmalan.filter((a) => getAmalanHukumType(a) === selectedHukum);
  }

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

      {/* Mini Fikih Status Tracker: Wajib vs Sunnah Completion Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() => { setSelectedHukum('wajib'); setSelectedCategory('semua'); }}
          className={`p-2 sm:p-2.5 rounded-2xl border transition-all text-left cursor-pointer active:scale-95 ${
            selectedHukum === 'wajib'
              ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 ring-2 ring-emerald-500/30 shadow-2xs'
              : 'bg-white dark:bg-emerald-950/40 border-stone-200/80 dark:border-emerald-850 hover:bg-emerald-50/50'
          }`}
          title="Klik untuk menyaring hanya Sholat Fardhu Wajib"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-300">🟢 Wajib Fardhu</span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">
              {wajibDoneCount}/5
            </span>
          </div>
          <div className="text-[9.5px] sm:text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
            {wajibDoneCount === 5 ? 'Alhamdulillah Tuntas' : '5 Sholat Wajib'}
          </div>
        </button>

        <button
          onClick={() => { setSelectedHukum('sunnah_muakkadah'); setSelectedCategory('semua'); }}
          className={`p-2 sm:p-2.5 rounded-2xl border transition-all text-left cursor-pointer active:scale-95 ${
            selectedHukum === 'sunnah_muakkadah'
              ? 'bg-sky-100 dark:bg-sky-950 border-sky-500 ring-2 ring-sky-500/30 shadow-2xs'
              : 'bg-white dark:bg-emerald-950/40 border-stone-200/80 dark:border-emerald-850 hover:bg-sky-50/50'
          }`}
          title="Klik untuk menyaring hanya Sholat Sunnah Mu'akkadah"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-sky-800 dark:text-sky-300">🔵 Mu&apos;akkadah</span>
            <span className="text-xs sm:text-sm font-black text-sky-700 dark:text-sky-400">
              {sunnahMuakkadahDoneCount}/5
            </span>
          </div>
          <div className="text-[9.5px] sm:text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
            Sunnah Utama
          </div>
        </button>

        <button
          onClick={() => { setSelectedHukum('sunnah_ghairu'); setSelectedCategory('semua'); }}
          className={`p-2 sm:p-2.5 rounded-2xl border transition-all text-left cursor-pointer active:scale-95 ${
            selectedHukum === 'sunnah_ghairu'
              ? 'bg-purple-100 dark:bg-purple-950 border-purple-500 ring-2 ring-purple-500/30 shadow-2xs'
              : 'bg-white dark:bg-emerald-950/40 border-stone-200/80 dark:border-emerald-850 hover:bg-purple-50/50'
          }`}
          title="Klik untuk menyaring Dzikir, Tilawah, & Amal Sunnah"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-purple-800 dark:text-purple-300">🟣 Sunnah &amp; Dzikir</span>
            <span className="text-xs sm:text-sm font-black text-purple-700 dark:text-purple-400">
              {sunnahGhairuDoneCount}/10
            </span>
          </div>
          <div className="text-[9.5px] sm:text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
            Wirid &amp; Sedekah
          </div>
        </button>
      </div>

      {/* 2-Tier Filter: Filter Hukum (Wajib vs Sunnah) & Sesi Waktu */}
      <div className="space-y-2.5">
        {/* Tier 1: Hukum Fikih Filter Pills + View Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Hukum Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedHukum('semua')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedHukum === 'semua'
                  ? 'bg-stone-900 text-white dark:bg-emerald-800 dark:text-amber-300 shadow-2xs'
                  : 'bg-white dark:bg-emerald-950/40 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-emerald-850 hover:bg-stone-50'
              }`}
            >
              Semua ({totalAmalan})
            </button>

            <button
              onClick={() => setSelectedHukum('wajib')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedHukum === 'wajib'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Wajib Fardhu ({wajibList.length})</span>
            </button>

            <button
              onClick={() => setSelectedHukum('sunnah_muakkadah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedHukum === 'sunnah_muakkadah'
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'bg-sky-50/80 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Sunnah Mu&apos;akkadah ({sunnahMuakkadahList.length})</span>
            </button>

            <button
              onClick={() => setSelectedHukum('sunnah_ghairu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedHukum === 'sunnah_ghairu'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Sunnah &amp; Dzikir ({sunnahGhairuList.length})</span>
            </button>
          </div>

          {/* View Mode Toggle: Urut Waktu vs Kelompok */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('waktu')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'waktu'
                  ? 'bg-white dark:bg-emerald-950 text-stone-900 dark:text-amber-300 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Urut berdasarkan kronologis waktu hari (24 Jam)"
            >
              ⏰ Urut Waktu
            </button>
            <button
              onClick={() => setViewMode('kelompok')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'kelompok'
                  ? 'bg-white dark:bg-emerald-950 text-stone-900 dark:text-amber-300 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              title="Kelompokkan berdasarkan Wajib, Sunnah Mu'akkadah, & Dzikir"
            >
              📑 Kelompok Fikih
            </button>
          </div>
        </div>

        {/* Tier 2: Sesi Waktu Filter Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const isSlotCurrentlyActive = cat.id === activeSlot.category;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full py-2 px-1.5 sm:px-2 rounded-2xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all relative cursor-pointer ${
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
      </div>

      {/* 4. BANNER PANDUAN TERPADU QIYAMUL LAIL */}
      {(selectedCategory === 'semua' || selectedCategory === 'dini_hari') && (selectedHukum === 'semua' || selectedHukum === 'sunnah_muakkadah') && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#072418] to-emerald-900 border border-emerald-800/80 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xs shadow-xs">
                🌙
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                Mode Terpadu Sepertiga Malam
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold font-serif text-amber-300">
              Alur Sholat Malam & Sahur (Qiyamul Lail)
            </h3>

            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-xl">
              Panduan terstruktur 6 langkah: Sholat Taubat ➔ Tahajjud ➔ Hajat ➔ Witir ➔ Sayyidul Istighfar ➔ Munajat Doa. Didesain agar Anda tidak bingung memulai ibadah malam.
            </p>
          </div>

          <button
            onClick={() => setIsQiyamModalOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>Mulai Panduan Sholat Malam →</span>
          </button>
        </div>
      )}

      {/* Checklist Amalan Items: Mode Kelompok vs Mode Waktu */}
      {viewMode === 'kelompok' && selectedHukum === 'semua' && selectedCategory === 'semua' ? (
        <div className="space-y-6">
          {/* Sekat 1: Sholat Wajib Fardhu 'Ain */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-transparent border-l-4 border-emerald-600 dark:border-emerald-400 pl-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <span>Kewajiban Utama: Sholat Fardhu 5 Waktu</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {wajibDoneCount} / 5 Tuntas
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Tiang agama yang wajib ditegakkan di awal waktu. Menjadi prioritas mutlak yang diperiksa pertama kali di hari hisab.
              </p>
            </div>
            <div className="space-y-3">
              {wajibList.map((item) => {
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
                      <button
                        onClick={() => handleToggle(item)}
                        className={`mt-1 flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-stone-300 dark:border-emerald-700 hover:border-emerald-500 bg-white dark:bg-emerald-900/30'
                        }`}
                        aria-label={`Tandai ${item.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3
                              onClick={() => setSelectedDetailAmalan(item)}
                              className={`text-base font-bold transition-colors cursor-pointer hover:underline ${
                                isDone
                                  ? 'line-through text-stone-500 dark:text-emerald-300/70'
                                  : 'text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300'
                              }`}
                              title="Klik untuk membuka tata cara & dalil lengkap"
                            >
                              {item.title}
                            </h3>

                            {isCurrentSlot && !isDone && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
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
                          {/* Lencana Status Wajib */}
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>Wajib (Fardhu &apos;Ain)</span>
                          </span>

                          <button
                            onClick={() => setSelectedDetailAmalan(item)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[11px] font-bold flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Buka Panduan Tata Cara, Bacaan & Dalil Shahih"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Panduan & Dalil</span>
                          </button>

                          {dynamicTimeRange && (
                            <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>{dynamicTimeRange}</span>
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
                              className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Keutamaan</span>
                            </button>
                          )}
                        </div>

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
          </div>

          {/* Sekat 2: Sholat Sunnah Mu'akkadah */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-900/10 via-sky-800/5 to-transparent border-l-4 border-sky-600 dark:border-sky-400 pl-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="text-base">⭐</span>
                  <span>Sholat Sunnah Mu&apos;akkadah (Sangat Dianjurkan)</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                  {sunnahMuakkadahDoneCount} / 5 Selesai
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Amalan sunnah yang senantiasa dijaga Rasulullah ﷺ untuk menyempurnakan kekurangan pada sholat fardhu.
              </p>
            </div>
            <div className="space-y-3">
              {sunnahMuakkadahList.map((item) => {
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
                      <button
                        onClick={() => handleToggle(item)}
                        className={`mt-1 flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-stone-300 dark:border-emerald-700 hover:border-emerald-500 bg-white dark:bg-emerald-900/30'
                        }`}
                        aria-label={`Tandai ${item.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3
                              onClick={() => setSelectedDetailAmalan(item)}
                              className={`text-base font-bold transition-colors cursor-pointer hover:underline ${
                                isDone
                                  ? 'line-through text-stone-500 dark:text-emerald-300/70'
                                  : 'text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300'
                              }`}
                              title="Klik untuk membuka tata cara & dalil lengkap"
                            >
                              {item.title}
                            </h3>

                            {isCurrentSlot && !isDone && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
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
                          {/* Lencana Status Sunnah Mu'akkadah */}
                          <span className="px-2.5 py-1 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                            <span>Sunnah Mu&apos;akkadah</span>
                          </span>

                          <button
                            onClick={() => setSelectedDetailAmalan(item)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[11px] font-bold flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Buka Panduan Tata Cara, Bacaan & Dalil Shahih"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Panduan & Dalil</span>
                          </button>

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

                          {item.virtue && (
                            <button
                              onClick={() => setExpandedVirtueId(isVirtueExpanded ? null : item.id)}
                              className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Keutamaan</span>
                            </button>
                          )}
                        </div>

                        {isVirtueExpanded && item.virtue && (
                          <div className="mt-3 p-3 rounded-2xl bg-emerald-100/60 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed animate-fade-in">
                            <strong className="block mb-0.5 text-emerald-950 dark:text-amber-300 font-semibold">
                              Fadhilah & Dalil:
                            </strong>
                            {item.virtue}
                          </div>
                        )}

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

          {/* Sekat 3: Dzikir, Tilawah & Amal Sunnah Harian */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-purple-800/5 to-transparent border-l-4 border-purple-600 dark:border-purple-400 pl-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="text-base">📿</span>
                  <span>Dzikir, Tilawah &amp; Amal Sunnah Harian</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  {sunnahGhairuDoneCount} / 10 Selesai
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                Wirid, sedekah fajar, surat pilihan (Al-Waqi&apos;ah &amp; Al-Mulk), dan muhasabah pelapang rezeki serta penenang jiwa.
              </p>
            </div>
            <div className="space-y-3">
              {sunnahGhairuList.map((item) => {
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
                      <button
                        onClick={() => handleToggle(item)}
                        className={`mt-1 flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-stone-300 dark:border-emerald-700 hover:border-emerald-500 bg-white dark:bg-emerald-900/30'
                        }`}
                        aria-label={`Tandai ${item.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3
                              onClick={() => setSelectedDetailAmalan(item)}
                              className={`text-base font-bold transition-colors cursor-pointer hover:underline ${
                                isDone
                                  ? 'line-through text-stone-500 dark:text-emerald-300/70'
                                  : 'text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300'
                              }`}
                              title="Klik untuk membuka tata cara & dalil lengkap"
                            >
                              {item.title}
                            </h3>

                            {isCurrentSlot && !isDone && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
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
                          {/* Lencana Status Sunnah & Dzikir */}
                          <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>{item.hukum || 'Sunnah & Dzikir'}</span>
                          </span>

                          <button
                            onClick={() => setSelectedDetailAmalan(item)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[11px] font-bold flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Buka Panduan Tata Cara, Bacaan & Dalil Shahih"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Panduan & Dalil</span>
                          </button>

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
                              className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Keutamaan</span>
                            </button>
                          )}
                        </div>

                        {isVirtueExpanded && item.virtue && (
                          <div className="mt-3 p-3 rounded-2xl bg-emerald-100/60 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed animate-fade-in">
                            <strong className="block mb-0.5 text-emerald-950 dark:text-amber-300 font-semibold">
                              Fadhilah & Dalil:
                            </strong>
                            {item.virtue}
                          </div>
                        )}

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
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAmalan.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-emerald-950/20 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 text-stone-500">
              <p className="text-sm font-medium">Tidak ada amalan yang sesuai dengan filter yang dipilih.</p>
              <button
                onClick={() => { setSelectedHukum('semua'); setSelectedCategory('semua'); }}
                className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Tampilkan Semua Amalan
              </button>
            </div>
          ) : (
            filteredAmalan.map((item) => {
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
              const hukumType = getAmalanHukumType(item);

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
                      className={`mt-1 flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
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
                            onClick={() => setSelectedDetailAmalan(item)}
                            className={`text-base font-bold transition-colors cursor-pointer hover:underline ${
                              isDone
                                ? 'line-through text-stone-500 dark:text-emerald-300/70'
                                : 'text-stone-900 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300'
                            }`}
                            title="Klik untuk membuka tata cara & dalil lengkap"
                          >
                            {item.title}
                          </h3>

                          {isCurrentSlot && !isDone && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-xs animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
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
                        {/* Lencana Status Hukum Fikih */}
                        {hukumType === 'wajib' && (
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>Wajib (Fardhu &apos;Ain)</span>
                          </span>
                        )}
                        {hukumType === 'sunnah_muakkadah' && (
                          <span className="px-2.5 py-1 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                            <span>Sunnah Mu&apos;akkadah</span>
                          </span>
                        )}
                        {hukumType === 'sunnah_ghairu' && (
                          <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>{item.hukum || 'Sunnah & Dzikir'}</span>
                          </span>
                        )}

                        {/* Tombol Panduan & Dalil Lengkap Modal */}
                        <button
                          onClick={() => setSelectedDetailAmalan(item)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[11px] font-bold flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="Buka Panduan Tata Cara, Bacaan & Dalil Shahih"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Panduan & Dalil</span>
                        </button>

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
                            className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-stone-300 hover:bg-stone-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
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

                      {/* Cross-Menu Action Link Button */}
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
            })
          )}
        </div>
      )}
      {/* Amalan Detail & Dalil Modal */}
      <AmalanDetailModal
        item={selectedDetailAmalan}
        isOpen={!!selectedDetailAmalan}
        onClose={() => setSelectedDetailAmalan(null)}
        isCompleted={selectedDetailAmalan ? isAmalanCompleted(selectedDate, selectedDetailAmalan.id) : false}
        onToggleComplete={() => {
          if (selectedDetailAmalan) {
            handleToggle(selectedDetailAmalan);
          }
        }}
        dynamicTimeRange={
          selectedDetailAmalan
            ? getDynamicAmalanTimeRange(
                selectedDetailAmalan.id,
                selectedDetailAmalan.category,
                userLocation?.prayerTimes,
                userLocation?.timezoneOffset
              )
            : undefined
        }
        onNavigateToTab={navigateToTab}
      />

      {/* Qiyamul Lail Guided Flow Modal */}
      <QiyamulLailModal
        isOpen={isQiyamModalOpen}
        onClose={() => setIsQiyamModalOpen(false)}
        onNavigateToTab={navigateToTab}
      />
    </div>
  );
};
