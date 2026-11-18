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
  Calendar
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
    waterGlasses: 4,
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-amber-950/30 border border-rose-200/80 dark:border-rose-900/40 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Self Improvement & Daily Habits</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-black/30 text-xs font-bold text-stone-800 dark:text-stone-200">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>{formatDateIndonesian(selectedDate)}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100">
          Glow Up Habits Tracker
        </h1>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-lg leading-relaxed">
          Menyeimbangkan kebugaran lahiriah dan kejernihan batiniah. Merawat tubuh dan pikiran adalah bentuk ikhtiar serta rasa syukur atas amanah yang Allah anugerahkan.
        </p>
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
      </div>

      {/* 2. DAILY GLOW UP & SELF-CARE CHECKLIST */}
      <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Rutinitas Perawatan Diri ({formatDateIndonesian(selectedDate)})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'morningSkincare')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.morningSkincare
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Morning Skincare & Sunscreen</div>
                <div className="text-xs text-stone-500">Cuci muka, moisturizer, & perlindungan UV</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.morningSkincare ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
            }`}>
              {currentGlowUp.morningSkincare && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'nightSkincare')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.nightSkincare
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Night Skincare & Wudhu Tidur</div>
                <div className="text-xs text-stone-500">Double cleansing & wudhu sebelum lelap</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.nightSkincare ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
            }`}>
              {currentGlowUp.nightSkincare && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'workout30Min')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.workout30Min
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Olahraga / Stretching 30 Menit</div>
                <div className="text-xs text-stone-500">Jalan pagi, senam ringan, atau yoga</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.workout30Min ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
            }`}>
              {currentGlowUp.workout30Min && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'reading15Min')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.reading15Min
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Membaca Buku 15 Menit</div>
                <div className="text-xs text-stone-500">Buku pengembangan diri / sirah nabawiyah</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.reading15Min ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
            }`}>
              {currentGlowUp.reading15Min && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'sleep7Hours')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.sleep7Hours
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Tidur Cukup (7-8 Jam)</div>
                <div className="text-xs text-stone-500">Tidur lebih awal setelah Isya & surat Al-Mulk</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.sleep7Hours ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
            }`}>
              {currentGlowUp.sleep7Hours && <Check className="w-4 h-4" />}
            </div>
          </button>

          <button
            onClick={() => toggleGlowUpHabit(selectedDate, 'healthyFood')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
              currentGlowUp.healthyFood
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-stone-50/60 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Makan Bergizi & Batasi Gula</div>
                <div className="text-xs text-stone-500">Buah, sayur, makanan halal & thayyib</div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              currentGlowUp.healthyFood ? 'bg-rose-500 border-rose-600 text-white' : 'border-stone-300'
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
