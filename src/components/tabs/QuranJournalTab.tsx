'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Heart, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  PenTool,
  Bookmark,
  ExternalLink,
  Video,
  FileText,
  Pencil,
  Copy,
  CheckCheck,
  Eye
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { QuranTadabburItem, KajianItem } from '@/types';
import { AddKajianModal } from '@/components/modals/AddKajianModal';
import { AddTadabburModal } from '@/components/modals/AddTadabburModal';
import { SurahReaderModal } from '@/components/modals/SurahReaderModal';
import { TADABBUR_AYAT_FALLBACK } from '@/data/surahReaderData';
import { formatDateIndonesian } from '@/utils/dateUtils';

export const QuranJournalTab: React.FC = () => {
  const { 
    selectedDate,
    quranCompletedJuz, 
    toggleJuz, 
    gratitudeMap, 
    setGratitudeList, 
    kajianNotes, 
    deleteKajian,
    quranTadabburList,
    deleteQuranTadabbur,
    quranActiveSubTab,
    setQuranActiveSubTab,
    markAmalanCompleted,
    markAmalanIncomplete,
    isAmalanCompleted
  } = useJalurLangitStore();

  const isWaqiahDone = isAmalanCompleted(selectedDate, 'surah_waqiah');
  const isMulkDone = isAmalanCompleted(selectedDate, 'surah_mulk');
  const isKahfiDone = isAmalanCompleted(selectedDate, 'surah_kahfi');
  const isGratitudeAmalanDone = isAmalanCompleted(selectedDate, 'muhasabah_gratitude');

  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [isTadabburModalOpen, setIsTadabburModalOpen] = useState(false);
  const [editingTadabburItem, setEditingTadabburItem] = useState<QuranTadabburItem | null>(null);
  const [editingKajianItem, setEditingKajianItem] = useState<KajianItem | null>(null);
  const [readingSurahId, setReadingSurahId] = useState<'al-waqiah' | 'al-mulk' | 'al-kahfi' | null>(null);
  const [copiedCardAyahId, setCopiedCardAyahId] = useState<string | null>(null);

  const handleCopyCardAyah = (id: string, surahName: string, arabic?: string, latin?: string, trans?: string) => {
    const text = `${surahName}\n\n${arabic || ''}\n\n"${latin || ''}"\n\nArtinya: ${trans || ''}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCardAyahId(id);
      setTimeout(() => setCopiedCardAyahId(null), 2000);
    }
  };

  // Gratitude for selectedDate (dynamic list)
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(() => {
    const list = gratitudeMap[selectedDate];
    if (list && list.length > 0) {
      return list;
    }
    return ['', '', ''];
  });
  const [isSavedGratitude, setIsSavedGratitude] = useState(false);

  React.useEffect(() => {
    const list = gratitudeMap[selectedDate];
    if (list && list.length > 0) {
      setGratitudeItems(list);
    } else {
      setGratitudeItems(['', '', '']);
    }
    setIsSavedGratitude(false);
  }, [selectedDate, gratitudeMap]);

  const handleUpdateGratitude = (index: number, val: string) => {
    setGratitudeItems((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddGratitude = () => {
    setGratitudeItems((prev) => [...prev, '']);
  };

  const handleRemoveGratitude = (index: number) => {
    if (gratitudeItems.length <= 1) {
      setGratitudeItems(['']);
      return;
    }
    setGratitudeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGratitude = () => {
    setGratitudeList(selectedDate, gratitudeItems);
    setIsSavedGratitude(true);
    setTimeout(() => setIsSavedGratitude(false), 2500);
  };

  const handleToggleJuzWithCelebration = (juz: number) => {
    const wasDone = quranCompletedJuz.includes(juz);
    toggleJuz(juz);
    if (!wasDone && quranCompletedJuz.length + 1 === 30) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#0f3d2e', '#c9933b', '#fbbf24', '#22c55e']
      });
    }
  };

  return (
    <div className="space-y-6 pb-28 min-h-[calc(100vh-140px)] animate-fade-in">
      {/* Sub-tab Navigation - Responsive Grid Anti-Terpotong */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-stone-100 dark:bg-emerald-950/60 p-1.5 rounded-2xl border border-stone-200/80 dark:border-emerald-800/60">
        <button
          onClick={() => setQuranActiveSubTab('tadabbur')}
          className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            quranActiveSubTab === 'tadabbur'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">Tadabbur ({quranTadabburList.length})</span>
        </button>

        <button
          onClick={() => setQuranActiveSubTab('juz')}
          className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            quranActiveSubTab === 'juz'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">1 Day 1 Juz ({quranCompletedJuz.length}/30)</span>
        </button>

        <button
          onClick={() => setQuranActiveSubTab('kajian')}
          className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            quranActiveSubTab === 'kajian'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">1 Day 1 Kajian ({kajianNotes.length})</span>
        </button>

        <button
          onClick={() => setQuranActiveSubTab('syukur')}
          className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            quranActiveSubTab === 'syukur'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span className="truncate">Gratitude Journal</span>
        </button>
      </div>

      {/* SUB-TAB 1: DEEP QURAN TADABBUR (SHEET 8) */}
      {quranActiveSubTab === 'tadabbur' && (
        <div className="space-y-4">
          {/* Daily Surah Routine Card: Al-Waqi'ah (Petang), Al-Mulk (Malam), Al-Kahfi (Jum'at) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-amber-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-700 text-white dark:bg-emerald-600 shadow-xs">
                  <BookOpen className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Surah Rutin Harian (Terhubung ke Checklist Amalan)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Langsung baca teks Arab, Latin &amp; terjemahan, atau tandai selesai di checklist.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-stone-500 font-semibold">{formatDateIndonesian(selectedDate)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* QS. Al-Waqi'ah */}
              <div className="p-3.5 bg-white dark:bg-emerald-900/40 rounded-2xl border border-stone-200/70 dark:border-emerald-800/50 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isWaqiahDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">QS. Al-Waqi&apos;ah</span>
                    </div>
                    <span className="text-xs font-arabic text-teal-800 dark:text-amber-300">سُورَةُ الْوَاقِعَةِ</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Amalan Waktu Petang • Pelapang Rezeki</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                  <button
                    onClick={() => setReadingSurahId('al-waqiah')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Surah</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isWaqiahDone) {
                        markAmalanIncomplete(selectedDate, 'surah_waqiah');
                      } else {
                        markAmalanCompleted(selectedDate, 'surah_waqiah');
                        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
                      }
                    }}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 shrink-0 ${
                      isWaqiahDone
                        ? 'bg-emerald-100 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isWaqiahDone ? '✓' : 'Tandai'}</span>
                  </button>
                </div>
              </div>

              {/* QS. Al-Mulk */}
              <div className="p-3.5 bg-white dark:bg-emerald-900/40 rounded-2xl border border-stone-200/70 dark:border-emerald-800/50 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isMulkDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">QS. Al-Mulk</span>
                    </div>
                    <span className="text-xs font-arabic text-teal-800 dark:text-amber-300">سُورَةُ الْمُلْكِ</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Amalan Waktu Malam • Penyelamat Kubur</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                  <button
                    onClick={() => setReadingSurahId('al-mulk')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Surah</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isMulkDone) {
                        markAmalanIncomplete(selectedDate, 'surah_mulk');
                      } else {
                        markAmalanCompleted(selectedDate, 'surah_mulk');
                        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
                      }
                    }}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 shrink-0 ${
                      isMulkDone
                        ? 'bg-emerald-100 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isMulkDone ? '✓' : 'Tandai'}</span>
                  </button>
                </div>
              </div>

              {/* QS. Al-Kahfi */}
              <div className="p-3.5 bg-white dark:bg-emerald-900/40 rounded-2xl border border-stone-200/70 dark:border-emerald-800/50 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isKahfiDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                      <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">QS. Al-Kahfi</span>
                    </div>
                    <span className="text-xs font-arabic text-teal-800 dark:text-amber-300">سُورَةُ الْكَهْفِ</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">Khusus Hari Jum&apos;at • Perisai Dajjal</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                  <button
                    onClick={() => setReadingSurahId('al-kahfi')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Surah</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isKahfiDone) {
                        markAmalanIncomplete(selectedDate, 'surah_kahfi');
                      } else {
                        markAmalanCompleted(selectedDate, 'surah_kahfi');
                        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
                      }
                    }}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 shrink-0 ${
                      isKahfiDone
                        ? 'bg-emerald-100 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isKahfiDone ? '✓' : 'Tandai'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Header & Tombol Tulis Tadabbur Baru */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
                <span>Quran Journaling &amp; Tadabbur</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Format lengkap: Ayat (Arab &amp; Latin), Kisah, Topik, Hikmah, dan Rencana Aksi Nyata
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTadabburItem(null);
                setIsTadabburModalOpen(true);
              }}
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tulis Lembar Tadabbur Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {quranTadabburList.map((item) => {
              const fallback = TADABBUR_AYAT_FALLBACK[item.id] || (
                item.surahName.toLowerCase().includes('waqi') ? TADABBUR_AYAT_FALLBACK['tadabbur-1'] :
                item.surahName.toLowerCase().includes('talaq') ? TADABBUR_AYAT_FALLBACK['tadabbur-2'] :
                item.surahName.toLowerCase().includes('mulk') ? TADABBUR_AYAT_FALLBACK['tadabbur-3'] :
                item.surahName.toLowerCase().includes('kahf') ? TADABBUR_AYAT_FALLBACK['tadabbur-4'] : null
              );
              const arabic = item.arabicText || fallback?.arabic;
              const latin = item.latinText || fallback?.latin;
              const translation = item.translationText || fallback?.translation;
              const isCopied = copiedCardAyahId === item.id;

              // Check if matches routine surah
              const matchingSurahKey: 'al-waqiah' | 'al-mulk' | 'al-kahfi' | null = 
                item.surahName.toLowerCase().includes('waqi') ? 'al-waqiah' :
                item.surahName.toLowerCase().includes('mulk') ? 'al-mulk' :
                item.surahName.toLowerCase().includes('kahf') ? 'al-kahfi' : null;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-2xl shadow-xs">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                          {item.surahName}
                        </h3>
                        <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                          {item.ayahRange}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {matchingSurahKey && (
                        <button
                          onClick={() => setReadingSurahId(matchingSurahKey)}
                          className="px-2.5 py-1 text-xs font-bold text-teal-800 dark:text-amber-300 bg-teal-50 dark:bg-emerald-900/60 hover:bg-teal-100 dark:hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                          title="Buka Pembaca Surah Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Baca Lengkap</span>
                        </button>
                      )}
                      {item.youtubeLink && (
                        <a
                          href={item.youtubeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-emerald-900/40 transition-colors"
                          title="Buka Link Kajian"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingTadabburItem(item);
                          setIsTadabburModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                        title="Edit Lembar Tadabbur"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuranTadabbur(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Tadabbur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 1. BAGIAN AYAT AL-QUR'AN (ARAB, LATIN, TERJEMAHAN) */}
                  {(arabic || latin || translation) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-emerald-900/25 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-amber-200/50 dark:border-emerald-800/40 pb-2">
                        <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>📖 Ayat Al-Qur&apos;an ({item.ayahRange})</span>
                        </span>

                        <button
                          onClick={() => handleCopyCardAyah(item.id, item.surahName, arabic, latin, translation)}
                          className="px-2 py-1 text-[11px] font-medium text-stone-500 hover:text-teal-700 dark:hover:text-amber-300 rounded-lg hover:bg-white dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                        >
                          {isCopied ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Ayat</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Teks Arab Berharakat */}
                      {arabic && (
                        <div className="text-right pt-1">
                          <p dir="rtl" className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-amber-100 leading-[2.6rem] sm:leading-[3.2rem] font-normal tracking-wide">
                            {arabic}
                          </p>
                        </div>
                      )}

                      {/* Transliterasi Latin */}
                      {latin && (
                        <div className="pt-2 border-t border-amber-200/40 dark:border-emerald-900/30">
                          <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-300/90 leading-relaxed">
                            {latin}
                          </p>
                        </div>
                      )}

                      {/* Terjemahan Bahasa Indonesia */}
                      {translation && (
                        <div className="pt-0.5">
                          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                            <span className="font-semibold text-stone-900 dark:text-stone-200">Artinya: </span>
                            {translation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. 4 PILAR TADABBUR (KISAH, TOPIK, HIKMAH, AKSI NYATA) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 space-y-1">
                      <span className="font-bold text-teal-800 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        📜 Kisah &amp; Konteks Ayat
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {item.story}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 space-y-1">
                      <span className="font-bold text-teal-800 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        🎯 Topik Mengenai Ayat
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {item.topic}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                      <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        💡 Hikmah yang Didapat
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic">
                        &ldquo;{item.wisdom}&rdquo;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        🌱 Rencana Aksi Nyata &amp; Muhasabah
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                        {item.actionPlan}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 1 DAY 1 JUZ TRACKER */}
      {quranActiveSubTab === 'juz' && (
        <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>1 Day 1 Juz Tracker (Target Khatam 30 Hari)</span>
              </h2>
              <p className="text-xs text-stone-500">
                Selesaikan 1 juz setiap hari agar khatam sebulan terasa ringan.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-bold">
              {quranCompletedJuz.length} / 30 Juz ({Math.round((quranCompletedJuz.length / 30) * 100)}%)
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const juzNum = idx + 1;
              const isDone = quranCompletedJuz.includes(juzNum);

              return (
                <button
                  key={juzNum}
                  onClick={() => handleToggleJuzWithCelebration(juzNum)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all active:scale-95 ${
                    isDone
                      ? 'bg-teal-700 text-white border-teal-800 shadow-md font-bold'
                      : 'bg-stone-50 dark:bg-emerald-900/20 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-emerald-900 hover:border-teal-400'
                  }`}
                >
                  <span className="text-[9px] uppercase opacity-75">Juz</span>
                  <span className="text-sm font-extrabold">{juzNum}</span>
                  <span className="text-[9px] mt-0.5">{isDone ? '✓' : '—'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 1 DAY 1 KAJIAN (SHEET 4) */}
      {quranActiveSubTab === 'kajian' && (
        <div className="space-y-4">
          {/* Header 1 Day 1 Kajian & Tombol Aksi */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-500 shrink-0" />
                <span>1 Day 1 Kajian Daily Checklist</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Simpan ringkasan video YouTube atau podcast kajian dan aksi nyatanya dengan bantuan AI.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingKajianItem(null);
                setIsKajianModalOpen(true);
              }}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tulis Resume Kajian Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {kajianNotes.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white dark:bg-emerald-950/20 rounded-3xl border border-dashed border-stone-300 dark:border-emerald-800 text-stone-500">
                Belum ada resume kajian. Luangkan 10-15 menit untuk menyimak ceramah bermanfaat.
              </div>
            ) : (
              kajianNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl bg-white dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {note.title}
                      </h3>
                      <div className="text-xs text-emerald-700 dark:text-amber-300 font-medium">
                        Pemateri: {note.speaker} • {note.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {note.videoUrl && (
                        <a
                          href={note.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-emerald-900/40 transition-colors"
                          title="Buka Video Kajian"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingKajianItem(note);
                          setIsKajianModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                        title="Edit Catatan Kajian"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteKajian(note.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Kajian"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {note.notes && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-stone-100 dark:border-emerald-900/30">
                      {note.notes}
                    </p>
                  )}

                  {note.actionPlan && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <Bookmark className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>Penerapan Hidup: {note.actionPlan}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GRATITUDE & SYUKUR */}
      {quranActiveSubTab === 'syukur' && (
        <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
          {/* Linked Amalan Sync Banner: Muhasabah & Gratitude Journal */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-amber-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isGratitudeAmalanDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <span>Terhubung ke Amalan: Muhasabah & Gratitude Journal</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isGratitudeAmalanDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {isGratitudeAmalanDone ? 'Selesai ✓' : 'Belum Selesai'}
                  </span>
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Menyimpan catatan syukur hari ini otomatis menandai amalan ini selesai di Checklist Amalan.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isGratitudeAmalanDone) {
                  markAmalanIncomplete(selectedDate, 'muhasabah_gratitude');
                } else {
                  markAmalanCompleted(selectedDate, 'muhasabah_gratitude');
                  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 ${
                isGratitudeAmalanDone
                  ? 'bg-stone-200 dark:bg-emerald-900/60 text-stone-700 dark:text-stone-200 hover:bg-stone-300'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isGratitudeAmalanDone ? 'Batal Selesai' : 'Tandai Selesai di Checklist ✓'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/20" />
              <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                Gratitude Journal ({formatDateIndonesian(selectedDate)})
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              {gratitudeItems.filter(t => t.trim().length > 0).length} Hal Disyukuri
            </span>
          </div>

          <p className="text-xs text-stone-500 italic">
            “Jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu.” (QS. Ibrahim: 7)
          </p>

          <div className="space-y-3">
            {gratitudeItems.map((item, index) => {
              const defaultPlaceholders = [
                'Hal pertama yang sangat kamu syukuri hari ini...',
                'Kebaikan kecil atau kemudahan yang kamu rasakan...',
                'Kesehatan, orang terkasih, atau rezeki tak terduga...'
              ];
              const placeholderText = index < defaultPlaceholders.length
                ? defaultPlaceholders[index]
                : `Hal lain yang kamu syukuri ke-${index + 1}...`;

              return (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-amber-600 dark:text-amber-400">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      placeholder={placeholderText}
                      value={item}
                      onChange={(e) => handleUpdateGratitude(index, e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {gratitudeItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGratitude(index)}
                      className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0"
                      title={`Hapus nomor ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* BUTTON TAMBAH GRATITUDE (BISA LEBIH DARI 3) */}
            <button
              type="button"
              onClick={handleAddGratitude}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Poin Rasa Syukur (+ Baris Baru)</span>
            </button>

            {/* BUTTON SIMPAN */}
            <button
              onClick={handleSaveGratitude}
              className="w-full py-3 px-4 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 bg-emerald-800 hover:bg-emerald-900"
            >
              {isSavedGratitude ? (
                <>
                  <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                  <span>Catatan Syukur Berhasil Disimpan!</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>Simpan Catatan Syukur</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <SurahReaderModal
        isOpen={Boolean(readingSurahId)}
        surahId={readingSurahId}
        onClose={() => setReadingSurahId(null)}
      />

      <AddTadabburModal
        isOpen={isTadabburModalOpen}
        editingItem={editingTadabburItem}
        onClose={() => {
          setIsTadabburModalOpen(false);
          setEditingTadabburItem(null);
        }}
      />

      <AddKajianModal
        isOpen={isKajianModalOpen}
        editingItem={editingKajianItem}
        onClose={() => {
          setIsKajianModalOpen(false);
          setEditingKajianItem(null);
        }}
      />
    </div>
  );
};
