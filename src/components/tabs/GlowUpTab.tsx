'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Droplets, 
  Smile, 
  Moon, 
  Sun, 
  Heart, 
  BookOpen, 
  Activity, 
  Coffee, 
  Check, 
  Edit3,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { GlowUpHabits } from '@/types';
import { formatDateIndonesian } from '@/utils/dateUtils';

const MOODS: { id: GlowUpHabits['mood']; label: string; emoji: string }[] = [
  { id: 'grateful', label: 'Bersyukur', emoji: '🤲' },
  { id: 'peaceful', label: 'Tenang & Damai', emoji: '🌸' },
  { id: 'happy', label: 'Senang & Ceria', emoji: '✨' },
  { id: 'hopeful', label: 'Penuh Harap', emoji: '🌱' },
  { id: 'tired', label: 'Lelah / Butuh Istirahat', emoji: '🌙' },
  { id: 'stressed', label: 'Overthinking / Butuh Dzikir', emoji: '💭' },
];

export const GlowUpTab: React.FC = () => {
  const { 
    selectedDate, 
    glowUpMap, 
    setWaterGlasses, 
    toggleGlowUpHabit, 
    setDailyMood, 
    setBrainDump 
  } = useJalurLangitStore();

  const currentGlowUp = glowUpMap[selectedDate] || {
    waterGlasses: 0,
    morningSkincare: false,
    nightSkincare: false,
    workout30Min: false,
    reading15Min: false,
    sleep7Hours: false,
    healthyFood: false,
    mood: 'grateful',
    brainDump: '',
  };

  const handleGlassClick = (index: number) => {
    const newCount = index + 1 === currentGlowUp.waterGlasses ? index : index + 1;
    setWaterGlasses(selectedDate, newCount);

    if (newCount === 8) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0284c7', '#f472b6', '#c084fc']
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Hero Header with Active Real Date */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-50 dark:from-emerald-950/50 dark:via-teal-950/30 dark:to-amber-950/30 border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Adab & Self-Care Nabawi</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-black/30 text-xs font-bold text-stone-800 dark:text-stone-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{formatDateIndonesian(selectedDate)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
            Adab & Self-Care Nabawi
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
            Glow Up Syar&apos;i
          </span>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-lg leading-relaxed">
          Menyeimbangkan kebugaran lahiriah dan kejernihan batiniah untuk Ikhwan &amp; Akhwat. Merawat kebersihan raga (thaharah), kebugaran jasmani, serta kesehatan mental adalah bagian dari sunnah Rasulullah ﷺ dan wujud rasa syukur atas amanah Allah.
        </p>
      </div>

      {/* Nabawi Sunnah Health & Hygiene Principles Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-850 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Prinsip Kebugaran &amp; Adab Sunnah</span>
          </div>
          <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">
            Universal Ikhwan &amp; Akhwat
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/40 space-y-1">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>💧 Thaharah &amp; Kesucian</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
              &quot;Kesucian adalah separuh dari keimanan.&quot; (HR. Muslim no. 223). Rawat kebersihan wajah, kuku, dan wudhu harian.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 space-y-1">
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>💪 Jasmani Kuat &amp; Berkah</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
              &quot;Mukmin yang kuat lebih baik dan lebih dicintai Allah daripada mukmin yang lemah.&quot; (HR. Muslim no. 2664).
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/40 space-y-1">
            <div className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <span>🪥 Siwak &amp; Adab Istirahat</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
              Menjaga kesegaran gigi/mulut, tidur miring ke sisi kanan, serta berdzikir sebelum memejamkan mata.
            </p>
          </div>
        </div>
      </div>

      {/* 1. WATER INTAKE TRACKER (2 LITERS / 8 GLASSES) */}
      <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Droplets className="w-5 h-5" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hidrasi Harian (Target 2 Liter)
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
            {currentGlowUp.waterGlasses} / 8 Gelas ({currentGlowUp.waterGlasses * 250} ml)
          </span>
        </div>

        {/* Interactive 8 Glasses Row */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < currentGlowUp.waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => handleGlassClick(idx)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${
                  isFilled
                    ? 'bg-gradient-to-t from-sky-500 to-sky-400 text-white border-sky-500 shadow-xs'
                    : 'bg-stone-50 dark:bg-emerald-900/20 text-stone-400 border-stone-200 dark:border-emerald-850 hover:border-sky-300'
                }`}
              >
                <Droplets className={`w-6 h-6 mb-1 ${isFilled ? 'fill-white stroke-white animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold">250ml</span>
                <span className="text-[9px] opacity-80">Gelas {idx + 1}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
          💡 Adab Minum Sunnah: Duduk tenang, baca bismillah, minum bertahap (2-3 nafas), dan akhiri dengan alhamdulillah.
        </p>
      </div>

      {/* 2. DAILY GLOW UP & SELF-CARE CHECKLIST */}
      <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Rutinitas Perawatan Diri &amp; Adab ({formatDateIndonesian(selectedDate)})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'morningSkincare')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.morningSkincare
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Thaharah &amp; Skincare Pagi Halal</div>
                <div className="text-xs text-stone-500">Cuci muka bersih, moisturizer/pelembap halal, &amp; perlindungan UV</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.morningSkincare ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.morningSkincare && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'nightSkincare')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.nightSkincare
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Thaharah Malam, Siwak &amp; Wudhu Tidur</div>
                <div className="text-xs text-stone-500">Bersihkan kotoran wajah, sikat gigi/siwak, &amp; berwudhu sebelum lelap</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.nightSkincare ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.nightSkincare && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'workout30Min')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.workout30Min
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Olahraga &amp; Kebugaran Jasmani (30 Menit)</div>
                <div className="text-xs text-stone-500">Jalan pagi, stretching, lari, gym/push-up, atau senam ringan</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.workout30Min ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.workout30Min && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'reading15Min')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.reading15Min
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-teal-500 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Membaca Buku / Sirah Nabawiyah (15 Menit)</div>
                <div className="text-xs text-stone-500">Buku pengembangan diri, ilmu agama, atau keteladanan Nabi ﷺ</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.reading15Min ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.reading15Min && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'sleep7Hours')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.sleep7Hours
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-purple-500 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Tidur Cukup (Adab Tidur Miring ke Kanan)</div>
                <div className="text-xs text-stone-500">Tidur 7-8 jam diawali Al-Mulk agar bugar bangun Qiyamul Lail</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.sleep7Hours ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.sleep7Hours && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'healthyFood')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.healthyFood
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Makanan Sehat, Halal &amp; Thayyib</div>
                <div className="text-xs text-stone-500">Sayur, buah, protein bergizi &amp; batasi konsumsi gula berlebih</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${
              currentGlowUp.healthyFood ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-stone-300 dark:border-emerald-800'
            }`}>
              {currentGlowUp.healthyFood && <Check className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE MOOD TRACKER */}
      <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Suasana Hati Tanggal Ini (Mood Tracker)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MOODS.map((m) => {
            const isSelected = currentGlowUp.mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setDailyMood(selectedDate, m.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex items-center gap-2.5 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : 'bg-stone-50 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. BRAIN DUMP & DAILY UNBURDEN */}
      <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
          <Edit3 className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold">
            Brain Dump & Curahan Hati
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          Tuangkan hal-hal yang membebani pikiranmu agar pikiranmu kembali ringan dan fokus beribadah.
        </p>

        <textarea
          rows={4}
          placeholder="Tuliskan apapun isi pikiran, ide, uneg-uneg, atau to-do list mendesak di sini..."
          value={currentGlowUp.brainDump}
          onChange={(e) => setBrainDump(selectedDate, e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800/60 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
    </div>
  );
};
