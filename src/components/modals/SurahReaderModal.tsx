'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { 
  X, 
  BookOpen, 
  Check, 
  Copy, 
  CheckCheck, 
  Share2, 
  Sparkles, 
  SlidersHorizontal,
  Bookmark,
  Volume2
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { SURAH_READER_DATA, SurahContent } from '@/data/surahReaderData';

interface SurahReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahId: 'al-waqiah' | 'al-mulk' | 'al-kahfi' | null;
}

export const SurahReaderModal: React.FC<SurahReaderModalProps> = ({
  isOpen,
  onClose,
  surahId,
}) => {
  const { selectedDate, markAmalanCompleted, markAmalanIncomplete, isAmalanCompleted } = useJalurLangitStore();

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [displayMode, setDisplayMode] = useState<'all' | 'arabic_only' | 'arabic_translation'>('all');
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted || !surahId) return null;

  const surah: SurahContent | undefined = SURAH_READER_DATA[surahId];
  if (!surah) return null;

  const isDone = isAmalanCompleted(selectedDate, surah.amalanId);

  const handleToggleCompletion = () => {
    if (isDone) {
      markAmalanIncomplete(selectedDate, surah.amalanId);
    } else {
      markAmalanCompleted(selectedDate, surah.amalanId);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0f3d2e', '#c9933b', '#22c55e', '#fbbf24']
      });
    }
  };

  const handleCopyAyah = (ayahNum: number, arabic: string, latin: string, trans: string) => {
    const textToCopy = `${surah.name} : Ayat ${ayahNum}\n\n${arabic}\n\n"${latin}"\n\nArtinya: ${trans}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedAyah(ayahNum);
      setTimeout(() => setCopiedAyah(null), 2000);
    }
  };

  const arabicSizeClass = 
    fontSize === 'normal' 
      ? 'text-xl leading-[2.2rem]' 
      : fontSize === 'large' 
      ? 'text-2xl sm:text-3xl leading-[2.8rem] sm:leading-[3.5rem]' 
      : 'text-3xl sm:text-4xl leading-[3.4rem] sm:leading-[4.2rem]';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Pembaca Surah */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/80 dark:via-teal-950/70 dark:to-amber-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-800 text-amber-300 dark:bg-emerald-800 dark:text-amber-300 shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-serif text-teal-950 dark:text-amber-200">
                  {surah.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  {surah.ayahCount} Ayat • {surah.revelation}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                {surah.meaning} ({surah.timeDescription})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/50 dark:hover:bg-emerald-900/50 transition-colors"
              title="Tutup Pembaca Surah"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Keutamaan & Pengaturan Membaca */}
        <div className="p-3 sm:px-5 bg-stone-50 dark:bg-emerald-950/60 border-b border-stone-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] italic line-clamp-1 sm:line-clamp-none">
              {surah.virtue}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end shrink-0">
            {/* Font Size Toggle */}
            <div className="flex items-center bg-white dark:bg-emerald-900/60 border border-stone-200 dark:border-emerald-800 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'normal' ? 'bg-teal-700 text-white' : 'text-stone-500'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'large' ? 'bg-teal-700 text-white' : 'text-stone-500'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'xlarge' ? 'bg-teal-700 text-white' : 'text-stone-500'}`}
              >
                A+
              </button>
            </div>

            {/* Display Mode Toggle */}
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as any)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-emerald-900/60 border border-stone-200 dark:border-emerald-800 text-[11px] font-semibold text-stone-700 dark:text-stone-200 focus:outline-none"
            >
              <option value="all">Arab + Latin + Arti</option>
              <option value="arabic_translation">Arab + Terjemahan</option>
              <option value="arabic_only">Teks Arab Saja</option>
            </select>
          </div>
        </div>

        {/* Scrollable Surah Verses */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Basmalah */}
          <div className="text-center py-2 border-b border-stone-100 dark:border-emerald-900/40">
            <p className="font-arabic text-2xl sm:text-3xl text-teal-900 dark:text-amber-200 leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xs text-stone-500 italic mt-1">
              Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
            </p>
          </div>

          {/* Ayat-ayat */}
          <div className="space-y-6">
            {surah.verses.map((ayah) => {
              const isCopied = copiedAyah === ayah.number;
              return (
                <div 
                  key={ayah.number} 
                  className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 hover:border-teal-400 dark:hover:border-emerald-600 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200/50 dark:border-emerald-800/40 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-amber-300 text-xs font-bold font-serif flex items-center justify-center border border-teal-200 dark:border-teal-800">
                        {ayah.number}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {surah.name} : {ayah.number}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyAyah(ayah.number, ayah.arabic, ayah.latin, ayah.translation)}
                      className="p-1.5 text-stone-400 hover:text-teal-700 dark:hover:text-amber-300 rounded-lg hover:bg-white dark:hover:bg-emerald-900/60 transition-colors flex items-center gap-1 text-[11px]"
                      title="Salin Ayat Ini"
                    >
                      {isCopied ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Teks Arab Berharakat */}
                  <div className="text-right pt-1">
                    <p 
                      dir="rtl" 
                      className={`font-arabic text-stone-900 dark:text-amber-100 font-normal tracking-wide ${arabicSizeClass}`}
                    >
                      {ayah.arabic} ۝
                    </p>
                  </div>

                  {/* Transliterasi Latin */}
                  {displayMode === 'all' && (
                    <div className="pt-1 border-t border-stone-200/40 dark:border-emerald-900/30">
                      <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300/90 leading-relaxed">
                        {ayah.latin}
                      </p>
                    </div>
                  )}

                  {/* Terjemahan Bahasa Indonesia */}
                  {(displayMode === 'all' || displayMode === 'arabic_translation') && (
                    <div className="pt-0.5">
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                        {ayah.translation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Tombol Tandai Selesai di Checklist */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-emerald-900/60 bg-stone-50 dark:bg-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Selesai membaca? Tandai langsung untuk checklist harian tanggal {selectedDate}.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-emerald-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-900 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleToggleCompletion}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isDone
                  ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-600'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isDone ? 'Sudah Dibaca di Checklist ✓' : 'Tandai Selesai di Checklist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
