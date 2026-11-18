'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sparkles, 
  Minus,
  CheckCircle,
  Edit2,
  Calendar,
  Layers,
  ChevronRight,
  Flame,
  Check,
  ArrowRight
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { TASBIH_PRESETS } from '@/data/amalanData';
import { formatDateIndonesian } from '@/utils/dateUtils';
import { TasbihPreset } from '@/types';

// Web Audio API click sound generator
const playSoftBeep = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // ignore
  }
};

const SHOLAT_STAGES = [
  {
    stage: 0,
    name: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    meaning: 'Maha Suci Allah dari segala kekurangan dan cela',
  },
  {
    stage: 1,
    name: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Segala puji dan syukur hanya bagi Allah Tuhan semesta alam',
  },
  {
    stage: 2,
    name: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah Maha Besar melampaui segala sesuatu',
  },
];

export const TasbihTab: React.FC = () => {
  const {
    selectedDate,
    tasbihPresetId,
    tasbihTarget,
    tasbihTotalLifetime,
    dailyTasbihMap,
    soundEnabled,
    vibrationEnabled,
    incrementTasbih,
    setTasbihPreset,
    setCustomTarget,
    toggleSound,
    toggleVibration,
  } = useJalurLangitStore();

  const [isPressing, setIsPressing] = useState(false);
  const [isCustomTargetOpen, setIsCustomTargetOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'semua' | 'sholat' | 'sholawat' | 'istighfar' | 'hajat'>('semua');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Stepper state for Paket Sholat:
  // 0 = Subhanallah, 1 = Alhamdulillah, 2 = Allahu Akbar
  const isPaketSholat = tasbihPresetId === 'paket_sholat' || tasbihPresetId === 'tasbih_fathimah';
  const [stageIndex, setStageIndex] = useState(0); 
  const [currentCounter, setCurrentCounter] = useState(0); // Starts at 0 for each stage!
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Target per stage or per preset
  const activeTarget = tasbihTarget > 0 ? tasbihTarget : 33;

  // Active preset object
  const activePreset = TASBIH_PRESETS.find((p) => p.id === tasbihPresetId) || TASBIH_PRESETS[0];

  const currentDaily = dailyTasbihMap[selectedDate] || { totalCount: 0, completedPresetIds: [] };

  const filteredPresets = selectedCategory === 'semua'
    ? TASBIH_PRESETS
    : TASBIH_PRESETS.filter((p) => p.category === selectedCategory);

  // Synchronize when switching presets
  useEffect(() => {
    setCurrentCounter(0);
    setStageIndex(0);
    setStatusBanner(null);
  }, [tasbihPresetId]);

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    if (soundEnabled) {
      playSoftBeep();
    }

    // Always increment lifetime and daily counter
    incrementTasbih();

    const nextCount = currentCounter + 1;

    if (isPaketSholat) {
      if (nextCount >= activeTarget) {
        // Current stage reached its target!
        if (stageIndex === 0) {
          // Subhanallah reached target -> Reset to 0 and advance to Alhamdulillah!
          if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([60, 40, 100]);
          }
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
          setStageIndex(1);
          setCurrentCounter(0); // RESET TO 0!
          setStatusBanner(`✨ ${activeTarget}x Subhanallah Selesai! Beralih ke Alhamdulillah...`);
        } else if (stageIndex === 1) {
          // Alhamdulillah reached target -> Reset to 0 and advance to Allahu Akbar!
          if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([60, 40, 100]);
          }
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          setStageIndex(2);
          setCurrentCounter(0); // RESET TO 0!
          setStatusBanner(`✨ ${activeTarget}x Alhamdulillah Selesai! Beralih ke Allahu Akbar...`);
        } else {
          // Allahu Akbar reached target -> Completed all 3 stages!
          if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([100, 50, 200]);
          }
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0f3d2e', '#c9933b', '#fbbf24', '#34d399']
          });
          setCurrentCounter(0); // Reset for another round or fresh start
          setStageIndex(0); // Return to Subhanallah for next cycle
          setStatusBanner(`🎉 Masya Allah! Rangkaian Subhanallah, Alhamdulillah, Allahu Akbar (${activeTarget * 3}x) Tuntas!`);
        }
      } else {
        setCurrentCounter(nextCount);
      }
    } else {
      // Standard single preset counter
      if (nextCount >= activeTarget) {
        if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([80, 50, 150]);
        }
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0f3d2e', '#c9933b', '#fbbf24', '#34d399']
        });
        setCurrentCounter(0); // Reset to 0 so user can do next cycle!
        setStatusBanner(`✨ Target ${activePreset.name} (${activeTarget}x) Selesai & Tersimpan!`);
      } else {
        setCurrentCounter(nextCount);
      }
    }
  };

  const handleSelectPreset = (preset: TasbihPreset) => {
    setTasbihPreset(preset.id);
    setCustomTarget(preset.target);
    setStageIndex(0);
    setCurrentCounter(0);
    setStatusBanner(null);
    setIsPresetModalOpen(false);
  };

  const handleSelectTarget = (t: number) => {
    setCustomTarget(t);
    setCurrentCounter(0);
    setStatusBanner(null);
  };

  const handleSaveCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInputValue, 10);
    if (!isNaN(val) && val > 0) {
      setCustomTarget(val);
      setCurrentCounter(0);
      setStatusBanner(null);
      setIsCustomTargetOpen(false);
      setCustomInputValue('');
    }
  };

  const handleManualReset = () => {
    if (confirm('Ulang hitungan dzikir ini dari 0?')) {
      setCurrentCounter(0);
      setStageIndex(0);
      setStatusBanner(null);
    }
  };

  const handleDecrement = () => {
    setCurrentCounter((prev) => Math.max(0, prev - 1));
  };

  // Determine active texts to display
  const currentStage = SHOLAT_STAGES[stageIndex];
  const displayArabic = isPaketSholat ? currentStage.arabic : activePreset.arabic;
  const displayTransliteration = isPaketSholat ? currentStage.transliteration : activePreset.transliteration;
  const displayMeaning = isPaketSholat ? currentStage.meaning : activePreset.meaning;
  const progressPercentage = Math.min(100, Math.round((currentCounter / activeTarget) * 100));

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-170px)] pb-24 space-y-5 animate-fade-in">
      {/* 1. TOP HEADER CONTROLS & DZIKIR SELECTOR BAR */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-emerald-950/40 text-stone-700 dark:text-stone-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{formatDateIndonesian(selectedDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-stone-100 dark:bg-emerald-950/40 border-stone-200 text-stone-400'
              }`}
              title="Toggle Suara Ketukan"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleVibration}
              className={`p-2 rounded-xl border transition-colors ${
                vibrationEnabled
                  ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 text-amber-800 dark:text-amber-300'
                  : 'bg-stone-100 dark:bg-emerald-950/40 border-stone-200 text-stone-400'
              }`}
              title="Toggle Getar (Haptic)"
            >
              <Vibrate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Dzikir Card with "Pilih Dzikir" Button (No Cutoff!) */}
        <div className="p-4 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Mode Dzikir Aktif
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 truncate">
              {isPaketSholat ? 'Paket Ba\'da Sholat (Subhanallah ➔ Alhamdulillah ➔ Allahu Akbar)' : activePreset.name}
            </h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Target Tiap Dzikir: {activeTarget} kali
            </span>
          </div>

          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0 bg-emerald-700 hover:bg-emerald-800"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pilih Dzikir</span>
          </button>
        </div>
      </div>

      {/* 2. CENTER DZIKIR DISPLAY CARD */}
      <div className="w-full text-center p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-3">
        {/* If Paket Ba'da Sholat: Show Interactive 3-Step Badges */}
        {isPaketSholat && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pb-1">
            {SHOLAT_STAGES.map((st, idx) => {
              const isCurrent = idx === stageIndex;
              const isPast = idx < stageIndex;
              return (
                <div
                  key={st.stage}
                  className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs scale-105'
                      : isPast
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-stone-100 dark:bg-emerald-900/20 text-stone-400'
                  }`}
                >
                  {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : <span>{idx + 1}.</span>}
                  <span>{st.name} ({isCurrent ? `${currentCounter}/${activeTarget}` : `${activeTarget}x`})</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Display ONLY the current active phrase! */}
        <div className="font-arabic text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 leading-loose">
          {displayArabic}
        </div>

        <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
          “{displayTransliteration}”
        </div>

        <div className="text-xs text-stone-500 max-w-sm mx-auto">
          {displayMeaning}
        </div>
      </div>

      {/* 3. TARGET EDIT & QUICK PRESETS (33x, 100x, 500x, 1000x, Custom) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
        <span className="text-xs font-semibold text-stone-500 mr-1">Target Dzikir:</span>
        {[33, 100, 500, 1000].map((t) => (
          <button
            key={t}
            onClick={() => handleSelectTarget(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeTarget === t
                ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-xs'
                : 'bg-white dark:bg-emerald-950/40 border-stone-200 dark:border-emerald-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {t}x
          </button>
        ))}

        <button
          onClick={() => setIsCustomTargetOpen(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 flex items-center gap-1 transition-all"
        >
          <Edit2 className="w-3 h-3" />
          <span>Edit...</span>
        </button>
      </div>

      {/* 4. MASSIVE TACTILE TAP COUNTER BUTTON */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-xl pointer-events-none" />

        <button
          onClick={handleTap}
          className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-100 active:scale-95 select-none ${
            isPressing
              ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-200 scale-95 shadow-inner'
              : 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-950 text-white shadow-emerald-900/40 hover:brightness-105'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Subtle Outer SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-1 pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-white/15"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-amber-300 transition-all duration-200"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progressPercentage / 100)}
              fill="none"
            />
          </svg>

          <span className="text-[11px] uppercase tracking-widest text-stone-200 font-medium mb-1">
            Ketuk di Sini
          </span>

          {/* Big number starts from 0 for each phase! */}
          <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight">
            {currentCounter}
          </span>

          <span className="text-xs font-semibold text-amber-200 mt-2 bg-black/30 px-3 py-1 rounded-full border border-white/20">
            {isPaketSholat
              ? `Fase ${stageIndex + 1}/3: ${currentStage.name} (${currentCounter}/${activeTarget})`
              : `Target: ${activeTarget} kali`}
          </span>
        </button>

        {/* Dynamic Status / Transition Banner */}
        {statusBanner && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-2 text-xs font-bold animate-bounce text-center">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}
      </div>

      {/* 5. BOTTOM CONTROLS & DAILY SAVED RESULTS */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={handleDecrement}
            disabled={currentCounter === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-100 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-200 transition-colors disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
            <span>Kurang 1</span>
          </button>

          <div className="text-center">
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Total Seluruh Dzikir</div>
            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
              {tasbihTotalLifetime}x
            </div>
          </div>

          <button
            onClick={handleManualReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-100 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke 0</span>
          </button>
        </div>

        {/* Daily Saved Result Box */}
        <div className="p-4 bg-white dark:bg-emerald-950/30 rounded-2xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              Hasil Dzikir Tanggal Ini:
            </span>
            <span className="font-extrabold text-stone-900 dark:text-stone-100">
              {currentDaily.totalCount}x ketukan
            </span>
          </div>

          {currentDaily.completedPresetIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                Tuntas:
              </span>
              {currentDaily.completedPresetIds.map((pid) => {
                const found = TASBIH_PRESETS.find((p) => p.id === pid);
                return (
                  <span
                    key={pid}
                    className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold"
                  >
                    ✓ {found ? found.name.split('(')[0].trim() : pid}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CHOOSE DZIKIR PRESET (No Cutoff, Clean Full Categories) */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif">Pilih Dzikir & Wirid</h3>
                <p className="text-xs text-stone-500">Pilih bacaan yang ingin Anda lantunkan</p>
              </div>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900 text-stone-400"
              >
                ✕
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['semua', 'sholat', 'sholawat', 'istighfar', 'hajat'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 dark:bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-emerald-900/30 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {cat === 'sholat' ? 'Ba\'da Sholat' : cat}
                </button>
              ))}
            </div>

            {/* List of Presets */}
            <div className="space-y-2 pt-1">
              {filteredPresets.map((preset) => {
                const isSelected = preset.id === activePreset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-700 shadow-xs'
                        : 'bg-stone-50 dark:bg-emerald-900/20 border-stone-200 dark:border-emerald-800/40 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {preset.name}
                      </div>
                      <div className="font-arabic text-base text-emerald-800 dark:text-amber-300 my-0.5">
                        {preset.arabic}
                      </div>
                      <div className="text-xs text-stone-500">
                        Default target: {preset.target}x
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM TARGET INPUT */}
      {isCustomTargetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs p-6 bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100">
            <h3 className="text-base font-bold font-serif mb-2">Edit Target Hitungan</h3>
            <p className="text-xs text-stone-500 mb-4">Masukkan target jumlah dzikir yang ingin Anda capai per sesi.</p>

            <form onSubmit={handleSaveCustomTarget} className="space-y-4">
              <input
                type="number"
                min="1"
                required
                placeholder="Contoh: 33, 100, 313, 1000"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border bg-stone-50 dark:bg-emerald-900/30 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomTargetOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-700 text-white text-xs font-bold"
                >
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
