'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { AnimatedTasbihBeads, TasbihTheme } from '@/components/tasbih/AnimatedTasbihBeads';
import { playTasbihGlassClick, preloadTasbihSound } from '@/utils/tasbihAudio';

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
  const router = useRouter();
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
    markAmalanCompleted,
    markAmalanIncomplete,
    isAmalanCompleted,
    navigateToTab,
    lastSourceAmalanId,
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

  const PRESET_TO_AMALAN_MAP: Record<string, string> = {
    sholawat_jibril: 'sholawat_jibril',
    istighfar_sahur: 'istighfar_sahur',
    istighfar_1000: 'istighfar_sahur',
    dzikir_pagi: 'dzikir_pagi',
    dzikir_petang: 'dzikir_petang',
    sayyidul_istighfar: 'sayyidul_istighfar',
  };

  const effectiveAmalanId = lastSourceAmalanId || PRESET_TO_AMALAN_MAP[tasbihPresetId];
  const isDone = effectiveAmalanId ? isAmalanCompleted(selectedDate, effectiveAmalanId) : false;
  const [localClicked, setLocalClicked] = useState(false);
  const isChecked = isDone || localClicked;

  // Reset status klik lokal ketika berpindah preset atau tanggal
  useEffect(() => {
    setLocalClicked(false);
  }, [tasbihPresetId, selectedDate]);

  // Aksi ketika tombol lingkaran "Sudah" di sebelah kanan tasbih diklik:
  // Ubah centang abu-abu menjadi kuning, tandai selesai di checklist lalu kembali otomatis ke amalan
  const handleCompleteAndReturn = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setLocalClicked(true);

    if (effectiveAmalanId) {
      markAmalanCompleted(selectedDate, effectiveAmalanId);
    }

    // Efek perayaan fadhilah
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0f3d2e', '#c9933b', '#2dd4bf', '#fbbf24']
    });

    if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 60, 40]);
    }

    // Beri jeda halus ~350ms agar pengguna melihat centang berubah kuning dan konfeti muncul
    setTimeout(() => {
      navigateToTab('amalan');
      router.push('/amalan');
    }, 350);
  };

  // Preload realistic crystal/glass bead sound on mount
  useEffect(() => {
    preloadTasbihSound();
  }, []);

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
      playTasbihGlassClick();
    }
    if (vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15]);
      } catch {}
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
        if (effectiveAmalanId) {
          markAmalanCompleted(selectedDate, effectiveAmalanId);
        }
        setCurrentCounter(0); // Reset to 0 so user can do next cycle!
        setStatusBanner(
          effectiveAmalanId
            ? `✨ Target ${activePreset.name} (${activeTarget}x) Selesai! Amalan checklist otomatis SELESAI 🎉`
            : `✨ Target ${activePreset.name} (${activeTarget}x) Selesai & Tersimpan!`
        );
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

  // Determine Stage Theme & Atmosphere (Matches Video reference 1:1)
  const getStageTheme = (): {
    theme: TasbihTheme;
    accentColor: string;
    bgGradient: string;
    glowColor: string;
    referenceText: string;
  } => {
    if (isPaketSholat) {
      if (stageIndex === 0) {
        return {
          theme: 'gold',
          accentColor: '#fbbf24',
          bgGradient: 'from-[#1c150c] via-[#120e07] to-[#080703]',
          glowColor: 'rgba(251, 191, 36, 0.25)',
          referenceText: 'SAHIH MUSLIM 597',
        };
      } else if (stageIndex === 1) {
        return {
          theme: 'emerald',
          accentColor: '#34d399',
          bgGradient: 'from-[#071a12] via-[#05130d] to-[#020a07]',
          glowColor: 'rgba(52, 211, 153, 0.25)',
          referenceText: 'SAHIH MUSLIM 597',
        };
      } else {
        return {
          theme: 'sapphire',
          accentColor: '#60a5fa',
          bgGradient: 'from-[#071324] via-[#050e1a] to-[#02070e]',
          glowColor: 'rgba(96, 165, 250, 0.25)',
          referenceText: 'SAHIH MUSLIM 597',
        };
      }
    }

    if (tasbihPresetId.includes('sholawat')) {
      return {
        theme: 'rose',
        accentColor: '#fb7185',
        bgGradient: 'from-[#1f0a12] via-[#14060b] to-[#080204]',
        glowColor: 'rgba(251, 113, 133, 0.25)',
        referenceText: "HR. AHMAD & AN-NASA'I",
      };
    }

    if (tasbihPresetId.includes('istighfar')) {
      return {
        theme: 'emerald',
        accentColor: '#34d399',
        bgGradient: 'from-[#071a12] via-[#05130d] to-[#020a07]',
        glowColor: 'rgba(52, 211, 153, 0.25)',
        referenceText: 'HR. BUKHARI & MUSLIM',
      };
    }

    return {
      theme: 'gold',
      accentColor: '#fbbf24',
      bgGradient: 'from-[#1c150c] via-[#120e07] to-[#080703]',
      glowColor: 'rgba(251, 191, 36, 0.25)',
      referenceText: 'KEUTAMAAN DZIKIR',
    };
  };

  const stageTheme = getStageTheme();

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

      {/* 2. MAIN IMMERSIVE TASBIH CARD (Matches the reference video 1:1) */}
      <div 
        onClick={handleTap}
        className={`relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 select-none cursor-pointer touch-manipulation transition-all duration-300 shadow-2xl border border-white/10 bg-gradient-to-b ${stageTheme.bgGradient}`}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Ambient Floating Bokeh Lights in Background */}
        <div 
          className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500" 
          style={{ backgroundColor: stageTheme.glowColor }} 
        />
        <div 
          className="absolute top-1/3 -right-12 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-500" 
          style={{ backgroundColor: stageTheme.glowColor }} 
        />
        <div 
          className="absolute -bottom-10 left-1/4 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-25 transition-colors duration-500" 
          style={{ backgroundColor: stageTheme.glowColor }} 
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          {/* Reference Tag: e.g. SAHIH MUSLIM 597 */}
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-amber-200/80 drop-shadow-sm">
            {stageTheme.referenceText}
          </div>

          {/* Glowing Arabic Calligraphy */}
          <div 
            className="font-arabic text-4xl sm:text-5xl drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] leading-relaxed select-none transition-all duration-300"
            style={{
              color: stageTheme.accentColor,
              textShadow: `0 0 25px ${stageTheme.accentColor}80`
            }}
          >
            {displayArabic}
          </div>

          {/* Transliteration */}
          <div className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-white drop-shadow-sm">
            {displayTransliteration}
          </div>

          {/* Meaning / Translation */}
          <div 
            className="text-xs font-semibold max-w-xs leading-relaxed uppercase tracking-wider"
            style={{ color: stageTheme.accentColor }}
          >
            {displayMeaning}
          </div>

          {/* Big Punchy Counter: e.g. 1 / 33 */}
          <div className="pt-2 flex items-baseline justify-center gap-1.5">
            <span 
              className={`text-6xl sm:text-7xl font-black font-mono tracking-tight transition-transform duration-100 ${
                isPressing ? 'scale-110' : 'scale-100'
              }`}
              style={{
                color: stageTheme.accentColor,
                textShadow: `0 0 30px ${stageTheme.accentColor}60`
              }}
            >
              {currentCounter}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-400/80 font-mono">
              /{activeTarget}
            </span>
          </div>

          {/* 3 Stage Segmented Progress Bars (for Ba'da Sholat) */}
          {isPaketSholat ? (
            <div className="w-full max-w-xs pt-1 flex items-center justify-center gap-2">
              {SHOLAT_STAGES.map((st, idx) => {
                const isCurrent = idx === stageIndex;
                const isPast = idx < stageIndex;
                const fillPct = isPast ? 100 : isCurrent ? Math.min(100, Math.round((currentCounter / activeTarget) * 100)) : 0;
                const stageColor = idx === 0 ? '#fbbf24' : idx === 1 ? '#34d399' : '#60a5fa';
                
                return (
                  <div key={st.stage} className="flex-1 space-y-1">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${fillPct}%`,
                          backgroundColor: stageColor,
                          boxShadow: isCurrent ? `0 0 10px ${stageColor}` : undefined
                        }}
                      />
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400 truncate">
                      {st.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full max-w-xs pt-1">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: stageTheme.accentColor,
                    boxShadow: `0 0 12px ${stageTheme.accentColor}`
                  }}
                />
              </div>
            </div>
          )}

          {/* THE 3D SLIDING BEADS STREAM */}
          <div className="w-full -my-2 relative">
            <AnimatedTasbihBeads
              currentCount={currentCounter}
              targetCount={activeTarget}
              theme={stageTheme.theme}
              stageIndex={isPaketSholat ? stageIndex : undefined}
              isPaketSholat={isPaketSholat}
              isPressing={isPressing}
              onTap={handleTap}
            />

            {/* Tombol Lingkaran "Sudah" di Sebelah Kanan Tasbih */}
            <div className="absolute right-2 sm:right-6 bottom-4 sm:bottom-8 z-30 flex flex-col items-center">
              <button
                type="button"
                onClick={handleCompleteAndReturn}
                className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 border-2 border-amber-300 text-white transition-all cursor-pointer touch-manipulation select-none active:scale-90 hover:scale-105 ${
                  isChecked
                    ? 'shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                    : 'shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                }`}
                title="Tandai amalan ini sudah selesai dan kembali ke checklist"
                aria-label="Tandai amalan sudah selesai dan kembali ke checklist"
              >
                {/* Subtle pulsing background glow ring */}
                <span className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${
                  isChecked ? 'bg-amber-400 opacity-40' : 'bg-emerald-400 opacity-25'
                }`} />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/50 to-emerald-400/50 blur-xs -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

                <Check 
                  className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5] drop-shadow-md group-hover:scale-110 transition-all duration-300 ${
                    isChecked 
                      ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110' 
                      : 'text-stone-300'
                  }`} 
                />
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white drop-shadow-sm leading-none mt-0.5">
                  Sudah
                </span>
              </button>
            </div>
          </div>

          {/* Subtle tap helper text */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400/80 animate-pulse pt-1">
            👆 Ketuk Layar atau Biji untuk Menghitung
          </div>
        </div>

        {/* Dynamic Status / Transition Banner */}
        {statusBanner && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-amber-400/20 text-amber-200 border border-amber-400/40 flex items-center justify-center gap-2 text-xs font-bold animate-bounce text-center backdrop-blur-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}
      </div>

      {/* 3. TARGET EDIT & QUICK PRESETS (33x, 100x, 500x, 1000x, Custom) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 w-full pt-1">
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

            {/* Category Filter Pills - Responsive Wrap Anti-Terpotong */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {(['semua', 'sholat', 'sholawat', 'istighfar', 'hajat'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 dark:bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-emerald-900/30 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-emerald-900/50'
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
