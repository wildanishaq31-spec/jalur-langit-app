'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bookmark, CheckCircle, ChevronDown } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { ALL_114_SURAHS } from '@/data/quranSurahCatalog';
import { getJuzByPage } from '@/data/quranJuzCatalog';

interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({ isOpen, onClose }) => {
  const { quranBookmark, setQuranBookmark } = useJalurLangitStore();

  const [surahNumber, setSurahNumber] = useState<number>(1);
  const [ayahNumber, setAyahNumber] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [juzNumber, setJuzNumber] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (quranBookmark) {
      setSurahNumber(quranBookmark.surahNumber || 1);
      setAyahNumber(quranBookmark.ayahNumber || 1);
      setPageNumber(quranBookmark.pageNumber || 1);
      setJuzNumber(quranBookmark.juzNumber || 1);
    }
  }, [quranBookmark, isOpen]);

  const handlePageChange = (p: number) => {
    const valid = Math.max(1, Math.min(604, p));
    setPageNumber(valid);
    setJuzNumber(getJuzByPage(valid));
  };

  const handleSurahChange = (sNum: number) => {
    setSurahNumber(sNum);
    setAyahNumber(1);
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const surahMeta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];

    setQuranBookmark({
      surahName: `QS. ${surahMeta.name}`,
      surahNumber: surahMeta.number,
      ayahNumber: Math.max(1, ayahNumber),
      pageNumber: Math.max(1, Math.min(604, pageNumber)),
      juzNumber: Math.max(1, Math.min(30, juzNumber)),
    });

    onClose();
  };

  const activeSurahMeta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <Bookmark className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                Pembatas Terakhir Dibaca
              </h3>
              <p className="text-[11px] text-stone-500">
                Tandai ayat &amp; halaman mushaf agar mudah melanjutkan tilawah.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Tutup Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          {/* Pilih Surah */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Surah Terakhir Dibaca
            </label>
            <div className="relative">
              <select
                value={surahNumber}
                onChange={(e) => handleSurahChange(Number(e.target.value))}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                {ALL_114_SURAHS.map((s) => (
                  <option key={s.number} value={s.number}>
                    QS. {s.number}. {s.name} ({s.arabic}) - {s.ayahCount} Ayat
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Ayat & Halaman */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Ayat Terakhir
              </label>
              <input
                type="number"
                min={1}
                max={activeSurahMeta.ayahCount}
                value={ayahNumber}
                onChange={(e) => setAyahNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Maksimal {activeSurahMeta.ayahCount} ayat
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Halaman Mushaf (1 - 604)
              </label>
              <input
                type="number"
                min={1}
                max={604}
                value={pageNumber}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Otomatis: Juz {juzNumber}
              </span>
            </div>
          </div>

          {/* Preview Badge Penanda */}
          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block tracking-wider">
                Posisi Penanda Tilawah
              </span>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                QS. {activeSurahMeta.name} • Ayat {ayahNumber} (Hal. {pageNumber})
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
              Juz {juzNumber}
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Pembatas Tilawah</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
