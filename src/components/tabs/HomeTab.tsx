'use client';

import React from 'react';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Heart, 
  BookOpen, 
  ArrowRight,
  Award,
  Droplets,
  Smile,
  Disc,
  Image as ImageIcon,
  HeartHandshake,
  ExternalLink,
  Sun,
  Moon,
  Compass,
  FileText,
  Calculator,
  Headphones,
  Layers
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { DEFAULT_AMALAN_LIST, INSPIRATIONAL_QUOTES, TASBIH_PRESETS } from '@/data/amalanData';
import { ActiveTab } from '@/components/Navigation';
import { CalendarMonthView } from '@/components/CalendarMonthView';
import { formatDateIndonesian } from '@/utils/dateUtils';

interface HomeTabProps {
  onNavigateToTab: (tabId: ActiveTab) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToTab }) => {
  const { 
    selectedDate,
    completedAmalan, 
    hajatList, 
    sedekahLogs, 
    quranCompletedJuz,
    getDateCompletionPercentage,
    glowUpMap,
    dailyTasbihMap,
    visionBoardItems,
    todayAffirmation,
    quranTadabburList,
    kajianNotes,
    appTheme,
    setIsDrawerOpen,
    setDrawerActiveTab,
    featureVotes
  } = useJalurLangitStore();

  const handleOpenRoadmap = () => {
    setDrawerActiveTab('lab');
    setIsDrawerOpen(true);
  };

  const totalAmalan = DEFAULT_AMALAN_LIST.length;
  const currentCompletion = getDateCompletionPercentage(selectedDate, totalAmalan);
  const completedTodayCount = (completedAmalan[selectedDate] || []).length;

  const totalCompletedAllDays = Object.values(completedAmalan).reduce(
    (acc, list) => acc + list.length, 
    0
  );

  // Glow up data for selectedDate
  const currentGlowUp = glowUpMap[selectedDate] || {
    waterGlasses: 4,
    morningSkincare: false,
    nightSkincare: false,
    workout30Min: false,
    reading15Min: false,
    sleep7Hours: false,
    healthyFood: false,
    mood: 'grateful' as const,
    brainDump: '',
  };

  // Tasbih data for selectedDate
  const currentTasbih = dailyTasbihMap[selectedDate] || { totalCount: 0, completedPresetIds: [] };

  // Sedekah on selectedDate
  const sedekahToday = sedekahLogs.find(s => s.date === selectedDate);

  const currentQuote = INSPIRATIONAL_QUOTES[0];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* 1. HERO WELCOME CARD */}
      <div className={`relative overflow-hidden rounded-3xl text-white p-6 md:p-8 shadow-xl transition-all ${
        appTheme === 'dark'
          ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 shadow-emerald-950/20 border border-emerald-800/40'
          : 'bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-900 shadow-emerald-800/15'
      }`}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kalender Jalur Langit & Daily Planner</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
              {formatDateIndonesian(selectedDate)}
            </h1>

            <p className="text-xs sm:text-sm text-stone-100 max-w-md leading-relaxed">
              Kuatkan ikhtiar bumi, pasrahkan hasil di langit. Amalan dan kebiasaan baik hari ini adalah kunci pembuka pintu kemudahan hidupmu.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigateToTab('amalan')}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>Checklist Amalan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateToTab('glowup')}
                className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs backdrop-blur-md transition-all active:scale-95"
              >
                Glow Up 🌿
              </button>

              <button
                onClick={() => onNavigateToTab('tasbih')}
                className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs backdrop-blur-md transition-all active:scale-95"
              >
                Tasbih 📿
              </button>

              <button
                onClick={() => onNavigateToTab('vision')}
                className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs backdrop-blur-md transition-all active:scale-95"
              >
                Vision ✨
              </button>
            </div>
          </div>

          {/* Circular Progress Gauge */}
          <div className="flex items-center gap-5 bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-300 transition-all duration-1000 ease-out"
                  strokeDasharray={`${currentCompletion}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg sm:text-xl font-black">{currentCompletion}%</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-200">Amalan Tanggal Ini</div>
              <div className="text-base sm:text-lg font-bold">
                {completedTodayCount} <span className="text-xs font-normal text-stone-200">/ {totalAmalan} Selesai</span>
              </div>
              <div className="text-[11px] text-amber-200 font-medium mt-0.5">
                {currentCompletion === 100 
                  ? '✨ Masya Allah Selesai!' 
                  : `${totalAmalan - completedTodayCount} amalan lagi`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DAILY ALL-IN-ONE COMMAND CENTER (RANGKUMAN SELURUH MODUL HARI INI) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Target & Capaian Tanggal Ini</span>
            </h2>
            <p className="text-xs text-stone-500">
              Pantau progres harian di setiap modul: Amalan, Glow Up, Tasbih, Vision, Hajat, & Quran.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {/* Module 1: Amalan Jalur Langit */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Amalan Langit
                </span>
                <span className="text-xs font-black text-stone-900 dark:text-stone-100">
                  {currentCompletion}%
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-800 dark:text-stone-100">
                {completedTodayCount} / {totalAmalan} Amalan
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Sholat fardhu, tahajjud, dhuha, & wirid harian.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('amalan')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Buka Checklist Amalan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 2: Glow Up & Self Care */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> Glow Up Self-Care
                </span>
                <span className="text-xs font-black text-sky-600">
                  {currentGlowUp.waterGlasses * 250} ml
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-800 dark:text-stone-100">
                💧 {currentGlowUp.waterGlasses}/8 Gelas Air
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                <span>Skincare:</span>
                <span className={currentGlowUp.morningSkincare ? 'text-emerald-600 font-bold' : 'text-stone-400'}>
                  Pagi {currentGlowUp.morningSkincare ? '✓' : '✕'}
                </span>
                <span>•</span>
                <span className={currentGlowUp.nightSkincare ? 'text-emerald-600 font-bold' : 'text-stone-400'}>
                  Malam {currentGlowUp.nightSkincare ? '✓' : '✕'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('glowup')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Buka Glow Up Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 3: Tasbih & Dzikir */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Disc className="w-3.5 h-3.5" /> Dzikir & Tasbih
                </span>
                <span className="text-xs font-bold text-amber-600">
                  {currentTasbih.completedPresetIds.length} target tuntas
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                {currentTasbih.totalCount}x Ketukan Hari Ini
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentTasbih.completedPresetIds.length > 0
                  ? `Selesai: ${currentTasbih.completedPresetIds.join(', ')}`
                  : 'Belum ada target wirid yang tuntas hari ini.'}
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('tasbih')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Mulai Berdzikir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 4: Vision Board & Manifesting */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Vision Board
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {visionBoardItems.filter(v => v.isAchieved).length} Terkabul
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                {visionBoardItems.length} Impian Visual
              </div>
              <p className="text-xs text-stone-500 italic line-clamp-1 mt-0.5">
                “{todayAffirmation}”
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('vision')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Lihat Vision Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 5: Quran & Kajian */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Quran & Ilmu
                </span>
                <span className="text-xs font-black text-teal-600">
                  {quranCompletedJuz.length}/30 Juz
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                {quranTadabburList.length} Tadabbur • {kajianNotes.length} Kajian
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Target khatam 30 juz Al-Qur'an dan refleksi ayat.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('quran')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Buka Quran Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 6: Hajat & Sedekah Subuh */}
          <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" /> Hajat & Sedekah
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {hajatList.filter(h => h.status === 'berikhtiar').length} Dalam Ikhtiar
                </span>
              </div>
              <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                {sedekahToday ? `Rp ${sedekahToday.amount?.toLocaleString('id-ID')} Sedekah` : 'Sedekah Belum Dicatat'}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {sedekahToday?.prayerWish ? `“${sedekahToday.prayerWish.slice(0, 35)}...”` : 'Selipkan doa hajatmu di fajar hari.'}
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('hajat')}
              className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>Buka Hajat & Sedekah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. JALUR LANGIT LAB & ROADMAP TEASER CARD (OPSI 2) */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden shadow-sm ${
        appTheme === 'dark'
          ? 'bg-gradient-to-br from-emerald-950/80 via-[#0e2119] to-[#081510] border-emerald-800/60 shadow-emerald-950/40'
          : 'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-amber-50/60 border-emerald-200/90 shadow-emerald-900/5'
      }`}>
        {/* Glow ambient circle */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Jalur Langit Lab • Update Mendatang (Coming Soon)</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>🚀 Roadmap Inovasi & Fitur Baru</span>
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 max-w-xl">
                Fitur pelengkap di luar menu utama yang sedang dipersiapkan. Dukung fitur favoritmu melalui voting interaktif!
              </p>
            </div>

            <button
              onClick={handleOpenRoadmap}
              className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <span>Buka Roadmap & Vote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Preview Grid 4 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* Card 1 */}
            <div 
              onClick={handleOpenRoadmap}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-800/50 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                  v1.3 Segera
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Kiblat & Adzan GPS
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Kompas Ka'bah & jadwal sholat otomatis
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">85% Siap</span>
                <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" /> {featureVotes['kiblat_adzan'] || 128}
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={handleOpenRoadmap}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-800/50 cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  Dikerjakan
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Rapor 30 Hari PDF
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Grafik evaluasi & cetak rapor digital
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                <span className="font-semibold text-amber-600 dark:text-amber-400">68% Dikerjakan</span>
                <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" /> {featureVotes['rapor_pdf'] || 164}
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={handleOpenRoadmap}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-800/50 cursor-pointer hover:border-sky-400 dark:hover:border-sky-600 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                  Riset Fiqih
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Kalkulator Zakat
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Hitung zakat mal, profesi & fidyah
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                <span className="font-semibold text-sky-600 dark:text-sky-400">45% Riset</span>
                <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" /> {featureVotes['kalkulator_zakat'] || 95}
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div 
              onClick={handleOpenRoadmap}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-800/50 cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                  Rencana
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Murottal & Audio
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Soundscape alam & dzikir malam
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                <span className="font-semibold text-purple-600 dark:text-purple-400">30% Konsep</span>
                <span className="flex items-center gap-0.5 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" /> {featureVotes['soundscape_murottal'] || 142}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. REAL MONTHLY CALENDAR VIEW (Januari s/d Desember) */}
      <CalendarMonthView
        onOpenDateDetails={(date) => {
          onNavigateToTab('amalan');
        }}
      />

      {/* 4. INSPIRATIONAL QUOTE CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-emerald-950/40 border border-amber-200/70 dark:border-amber-900/40">
        <div className="flex gap-4">
          <div className="text-amber-500 text-3xl font-serif">“</div>
          <div className="space-y-2">
            <p className="text-sm italic font-serif text-stone-800 dark:text-stone-200 leading-relaxed">
              {currentQuote.quote}
            </p>
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              — {currentQuote.author}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
