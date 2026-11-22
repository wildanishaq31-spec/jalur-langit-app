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
  Eye,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Flame,
  Leaf,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { QuranTadabburItem, KajianItem } from '@/types';
import { AddKajianModal } from '@/components/modals/AddKajianModal';
import { AddTadabburModal } from '@/components/modals/AddTadabburModal';
import { SurahReaderModal } from '@/components/modals/SurahReaderModal';
import { EditBookmarkModal } from '@/components/modals/EditBookmarkModal';
import { TADABBUR_AYAT_FALLBACK } from '@/data/surahReaderData';
import { ALL_30_JUZ, QURAN_PACE_CONFIGS, QuranPaceMode } from '@/data/quranJuzCatalog';
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
    isAmalanCompleted,
    quranBookmark,
    quranPaceMode,
    setQuranPaceMode,
    dailyCicilSholatMap,
    toggleDailyCicilSholat
  } = useJalurLangitStore();

  const isWaqiahDone = isAmalanCompleted(selectedDate, 'surah_waqiah');
  const isMulkDone = isAmalanCompleted(selectedDate, 'surah_mulk');
  const isKahfiDone = isAmalanCompleted(selectedDate, 'surah_kahfi');
  const isGratitudeAmalanDone = isAmalanCompleted(selectedDate, 'muhasabah_gratitude');
  const isTilawahDone = isAmalanCompleted(selectedDate, 'tilawah_one_day_one_juz');

  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [isTadabburModalOpen, setIsTadabburModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [activeInspectJuz, setActiveInspectJuz] = useState<number>(1);
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

  // Helper: cari daftar syukur terakhir yang terisi dari tanggal mana pun (Persistent Vault)
  const getLatestGratitudeList = (map: Record<string, string[]>, currentDate: string): string[] => {
    const currentList = map[currentDate];
    if (currentList && currentList.some(item => item && item.trim() !== '')) {
      return currentList;
    }
    // Cari tanggal lain yang memiliki data terisi (terbaru lebih dahulu)
    const sortedDates = Object.keys(map).sort().reverse();
    for (const d of sortedDates) {
      const items = map[d];
      if (items && items.some(item => item && item.trim() !== '')) {
        return items;
      }
    }
    // Default awal jika aplikasi baru pertama kali dibuka
    return [
      'Masih diberikan nikmat nafas dan kesempatan sholat Subuh hari ini',
      'Kesehatan badan, kejernihan pikiran, dan ketenangan hati',
      'Keluarga dan sahabat yang senantiasa saling mendoakan dalam kebaikan'
    ];
  };

  // Gratitude for selectedDate (Persistent Gratitude Vault)
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(() => {
    return getLatestGratitudeList(gratitudeMap, selectedDate);
  });
  const [isSavedGratitude, setIsSavedGratitude] = useState(false);

  React.useEffect(() => {
    const list = getLatestGratitudeList(gratitudeMap, selectedDate);
    setGratitudeItems(list);
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
    const validItems = gratitudeItems.filter(item => item.trim() !== '');
    const toSave = validItems.length > 0 ? validItems : gratitudeItems;
    setGratitudeList(selectedDate, toSave);
    setIsSavedGratitude(true);
    markAmalanCompleted(selectedDate, 'muhasabah_gratitude');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setIsSavedGratitude(false), 2500);
  };

  const handleToggleGratitudeAmalan = () => {
    if (isGratitudeAmalanDone) {
      markAmalanIncomplete(selectedDate, 'muhasabah_gratitude');
    } else {
      markAmalanCompleted(selectedDate, 'muhasabah_gratitude');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 } });
    }
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
          <span className="truncate">Tilawah ({quranCompletedJuz.length}/30)</span>
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

      {/* SUB-TAB 2: TILAWAH & QURAN HABIT BUILDER (1 DAY 1 JUZ + TILAWAH BERTAHAP) */}
      {quranActiveSubTab === 'juz' && (
        <div className="space-y-5">
          {/* 1. Header & Overall Progress Banner */}
          <div className="p-4 sm:p-5 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Tilawah &amp; Quran Habit Builder</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Bangun kebiasaan tilawah harian sesuai kemampuan, cicil per waktu sholat, dan pantau kemajuan 30 juz.
                </p>
              </div>

              {/* Progress Summary Pill */}
              <div className="flex items-center gap-2.5 bg-stone-50 dark:bg-emerald-900/30 p-2 sm:p-2.5 rounded-2xl border border-stone-200/80 dark:border-emerald-800/60 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                    {quranCompletedJuz.length} / 30 Juz
                  </div>
                  <div className="text-[10px] text-stone-500 font-semibold">
                    {Math.round((quranCompletedJuz.length / 30) * 100)}% Selesai
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {Math.round((quranCompletedJuz.length / 30) * 100)}%
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-stone-100 dark:bg-emerald-900/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-stone-200/60 dark:border-emerald-800/40">
                <div
                  className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${Math.max(4, Math.min(100, (quranCompletedJuz.length / 30) * 100))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 px-0.5">
                <span>Juz 1</span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  {30 - quranCompletedJuz.length === 0
                    ? '🎉 Ma Syaa Allah, Khatam 30 Juz!'
                    : `Tersisa ${30 - quranCompletedJuz.length} juz lagi`}
                </span>
                <span>Juz 30</span>
              </div>
            </div>

            {/* Sync with Checklist Amalan Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isTilawahDone ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Status Checklist Amalan Hari Ini ({formatDateIndonesian(selectedDate)}):
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isTilawahDone) {
                    markAmalanIncomplete(selectedDate, 'tilawah_one_day_one_juz');
                  } else {
                    markAmalanCompleted(selectedDate, 'tilawah_one_day_one_juz');
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  isTilawahDone
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-stone-100 dark:bg-emerald-900/30 hover:bg-emerald-50 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-emerald-800'
                }`}
              >
                {isTilawahDone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>✓ Selesai di Checklist</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full border border-stone-400" />
                    <span>Tandai Selesai Hari Ini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Digital Bookmark Card (Pembatas Terakhir Dibaca) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-teal-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-amber-300/70 dark:border-amber-700/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-xs">
                  <Bookmark className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Pembatas Terakhir Dibaca</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-[9px] font-black">
                      Bookmark
                    </span>
                  </h3>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                    Posisi bacaan mushaf terakhir agar langsung lanjut tanpa lupa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBookmarkModalOpen(true)}
                className="px-3 py-1.5 bg-white dark:bg-emerald-900 hover:bg-amber-50 dark:hover:bg-emerald-800 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl border border-amber-200 dark:border-amber-700 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Pencil className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Perbarui Pembatas</span>
              </button>
            </div>

            {/* Bookmark Info Box */}
            <div className="p-3.5 bg-white/90 dark:bg-emerald-950/70 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{quranBookmark.surahName}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Ayat {quranBookmark.ayahNumber}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 font-medium">
                  <span className="flex items-center gap-1">
                    📖 Halaman: <strong className="text-amber-700 dark:text-amber-400">{quranBookmark.pageNumber}</strong> / 604
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    ✨ Juz: <strong className="text-teal-700 dark:text-teal-400">{quranBookmark.juzNumber}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">Terakhir diperbarui:</span>
                <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                  {formatDateIndonesian(quranBookmark.updatedAt ? quranBookmark.updatedAt.slice(0, 10) : selectedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Level Target Selector (Pemula, Menengah, Pejuang) */}
          <div className="p-4 sm:p-5 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pilih Level Target Harian (Bertahap &amp; Anti-Beban)</span>
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Pilihlah target yang paling realistis bagimu. Sedikit demi sedikit namun istiqomah lebih dicintai Allah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(QURAN_PACE_CONFIGS) as QuranPaceMode[]).map((modeKey) => {
                const config = QURAN_PACE_CONFIGS[modeKey];
                const isSelected = quranPaceMode === modeKey;

                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => setQuranPaceMode(modeKey)}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 flex flex-col justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-900/40 border-emerald-500 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-stone-50/60 dark:bg-emerald-950/20 border-stone-200/80 dark:border-emerald-900/60 hover:border-emerald-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-200 dark:bg-emerald-900 text-stone-700 dark:text-stone-300'
                        }`}>
                          {config.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {config.title}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {config.targetDailyText}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 dark:border-emerald-800/40 text-[10px] text-stone-500 leading-snug">
                      {config.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Strategi Cicil 5 Waktu Sholat Hari Ini */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-teal-50/70 via-emerald-50/50 to-white dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-stone-900 rounded-3xl border border-teal-200/70 dark:border-teal-800/60 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Strategi Cicil 5 Waktu Sholat ({formatDateIndonesian(selectedDate)})</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {quranPaceMode === 'pejuang' && 'Target: 4 Halaman (2 lembar) setiap selesai sholat fardhu (Total 20 Halaman = 1 Juz/Hari).'}
                  {quranPaceMode === 'menengah' && 'Target: ~1 Halaman setiap selesai sholat fardhu (Total 4 Halaman = 2 Lembar/Hari).'}
                  {quranPaceMode === 'pemula' && 'Target: 1 Halaman saat Subuh & Maghrib (Total 2 Halaman = 1 Lembar/Hari).'}
                </p>
              </div>

              {/* Counter Selesai */}
              {(() => {
                const todayCicil = dailyCicilSholatMap[selectedDate] || {
                  subuh: false,
                  dzuhur: false,
                  ashar: false,
                  maghrib: false,
                  isya: false,
                };
                const doneCount = Object.values(todayCicil).filter(Boolean).length;
                return (
                  <div className="text-xs font-bold px-3 py-1 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 self-start sm:self-center shrink-0">
                    {doneCount} / 5 Sholat Selesai
                  </div>
                );
              })()}
            </div>

            {/* 5 Sholat Interactive Pills */}
            {(() => {
              const todayCicil = dailyCicilSholatMap[selectedDate] || {
                subuh: false,
                dzuhur: false,
                ashar: false,
                maghrib: false,
                isya: false,
              };

              const prayers = [
                { key: 'subuh', label: 'Subuh', icon: Sunrise, target: quranPaceMode === 'pejuang' ? '4 hal (2 lbr)' : quranPaceMode === 'menengah' ? '1 hal' : '1 hal' },
                { key: 'dzuhur', label: 'Dzuhur', icon: Sun, target: quranPaceMode === 'pejuang' ? '4 hal (2 lbr)' : quranPaceMode === 'menengah' ? '1 hal' : 'Opsional' },
                { key: 'ashar', label: 'Ashar', icon: Sunset, target: quranPaceMode === 'pejuang' ? '4 hal (2 lbr)' : quranPaceMode === 'menengah' ? '1 hal' : 'Opsional' },
                { key: 'maghrib', label: 'Maghrib', icon: Moon, target: quranPaceMode === 'pejuang' ? '4 hal (2 lbr)' : quranPaceMode === 'menengah' ? '1 hal' : '1 hal' },
                { key: 'isya', label: 'Isya', icon: Sparkles, target: quranPaceMode === 'pejuang' ? '4 hal (2 lbr)' : quranPaceMode === 'menengah' ? '1 hal' : 'Opsional' },
              ] as const;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {prayers.map((p) => {
                    const isDone = todayCicil[p.key];
                    const IconComp = p.icon;

                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                          toggleDailyCicilSholat(selectedDate, p.key);
                          if (!isDone) {
                            const newCount = Object.values(todayCicil).filter(Boolean).length + 1;
                            if (newCount === 5) {
                              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                            }
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          isDone
                            ? 'bg-teal-700 text-white border-teal-800 shadow-xs font-bold'
                            : 'bg-white dark:bg-emerald-950/40 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-emerald-900/60 hover:border-teal-400'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <IconComp className={`w-3.5 h-3.5 ${isDone ? 'text-amber-300' : 'text-stone-400'}`} />
                          <span className="text-xs font-bold">{p.label}</span>
                        </div>
                        <span className={`text-[10px] ${isDone ? 'text-teal-100' : 'text-stone-400'}`}>
                          {p.target}
                        </span>
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                          isDone
                            ? 'bg-white text-teal-800 font-black shadow-xs'
                            : 'border border-stone-300 dark:border-emerald-800 text-transparent'
                        }`}>
                          ✓
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* 5. Interactive 30-Juz Map & Detail Inspector */}
          <div className="p-4 sm:p-5 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Peta 30 Juz &amp; Eksplorasi Tema</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Klik nomor Juz untuk melihat rentang surat, halaman, dan tema besar kandungannya.
                </p>
              </div>

              <span className="text-[11px] text-stone-500 font-medium">
                Pilih kotak di bawah untuk inspeksi:
              </span>
            </div>

            {/* 30 Juz Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {Array.from({ length: 30 }).map((_, idx) => {
                const juzNum = idx + 1;
                const isDone = quranCompletedJuz.includes(juzNum);
                const isInspected = activeInspectJuz === juzNum;

                return (
                  <button
                    key={juzNum}
                    type="button"
                    onClick={() => setActiveInspectJuz(juzNum)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer relative ${
                      isDone
                        ? 'bg-teal-700 text-white border-teal-800 shadow-xs font-bold'
                        : isInspected
                        ? 'bg-amber-50 dark:bg-emerald-900/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-500 shadow-sm font-bold'
                        : 'bg-stone-50 dark:bg-emerald-900/20 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-emerald-900 hover:border-teal-400'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider opacity-75">Juz</span>
                    <span className="text-sm font-extrabold">{juzNum}</span>
                    <span className="text-[9px] mt-0.5 font-bold">
                      {isDone ? '✓' : isInspected ? '•' : '—'}
                    </span>
                    {isInspected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-emerald-950" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Inspection Card for activeInspectJuz */}
            {(() => {
              const meta = ALL_30_JUZ.find((j) => j.juz === activeInspectJuz) || ALL_30_JUZ[0];
              const isDone = quranCompletedJuz.includes(meta.juz);

              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200/80 dark:border-emerald-800/60 space-y-3.5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-teal-800 text-white text-xs font-bold">
                          Juz {meta.juz}
                        </span>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                          {meta.startSurah} ➔ {meta.endSurah}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2">
                        <span>Halaman: <strong>{meta.startPage} - {meta.endPage}</strong> ({meta.pageCount} Halaman)</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleJuzWithCelebration(meta.juz)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          isDone
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                            : 'bg-teal-700 hover:bg-teal-800 text-white'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Batal Tandai Selesai</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tandai Juz {meta.juz} Selesai</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Theme Summary */}
                  <div className="p-3 bg-white dark:bg-emerald-950/60 rounded-xl border border-stone-200/60 dark:border-emerald-800/40 space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                      📖 Intisari &amp; Tema Kandungan Juz {meta.juz}:
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {meta.themeSummary}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 6. Mutiara Hadits Tilawah */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-800/40 text-xs text-amber-950 dark:text-amber-200 space-y-1 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Keutamaan Membaca Satu Huruf Al-Qur'an:</span>
            </div>
            <p className="italic">
              &quot;Barangsiapa membaca satu huruf dari Kitabullah (Al-Qur'an), maka baginya satu kebaikan, dan satu kebaikan dilipatgandakan menjadi sepuluh kali lipat semisalnya...&quot;
            </p>
            <p className="text-[10px] text-amber-800/80 dark:text-amber-400 font-semibold text-right">
              — HR. At-Tirmidzi no. 2910 (Shahih)
            </p>
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

                  {/* Poin Penting & Tadabbur (Multi-Point Support) */}
                  {note.notes && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 space-y-1.5">
                      <span className="font-bold text-teal-800 dark:text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        💡 Poin Penting &amp; Tadabbur Kajian
                      </span>
                      <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line pl-1">
                        {note.notes}
                      </div>
                    </div>
                  )}

                  {/* Rencana Aksi Nyata (Multi-Step Action Plan Support) */}
                  {note.actionPlan && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        <Bookmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Rencana Aksi Nyata &amp; Penerapan Hidup:</span>
                      </div>
                      <div className="text-xs text-emerald-950 dark:text-emerald-100/90 whitespace-pre-line leading-relaxed pl-5">
                        {note.actionPlan}
                      </div>
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
        <div className="p-5 sm:p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
          
          {/* Header Bar: Title, Counter & Tombol Checklist Baca Harian (Tersambung ke Checklist Amalan) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-emerald-900/50">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                  Gratitude Journal
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  {gratitudeItems.filter(t => t.trim().length > 0).length} Butir Nikmat
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {formatDateIndonesian(selectedDate)} • Refleksi Nikmat &amp; Pengingat Bersyukur Harian
              </p>
            </div>

            {/* Checklist Sudah Dibaca & Diresapi Hari Ini */}
            <button
              type="button"
              onClick={handleToggleGratitudeAmalan}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                isGratitudeAmalanDone
                  ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
              }`}
            >
              <Check className={`w-4 h-4 stroke-[3] ${isGratitudeAmalanDone ? 'text-emerald-600 dark:text-emerald-300' : 'text-white'}`} />
              <span>
                {isGratitudeAmalanDone
                  ? 'Sudah Dibaca & Diresapi Hari Ini ✓'
                  : 'Tandai Sudah Dibaca Hari Ini'}
              </span>
            </button>
          </div>

          {/* Kutipan Qalbu & Panduan Syukur */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
            <p className="text-xs text-amber-900 dark:text-amber-200 italic font-serif">
              &ldquo;Jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu.&rdquo; <span className="font-sans font-semibold text-[11px] not-italic text-amber-700 dark:text-amber-400">(QS. Ibrahim: 7)</span>
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Bacalah butir-butir rasa syukur di bawah ini dengan sepenuh hati. Catatan nikmat Anda tersimpan abadi dan dapat dibaca setiap hari, serta bebas Anda tambahi kapan pun ada nikmat baru.
            </p>
          </div>

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
              type="button"
              onClick={handleSaveGratitude}
              className="w-full py-3.5 px-4 text-white text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 bg-emerald-800 hover:bg-emerald-900 cursor-pointer"
            >
              {isSavedGratitude ? (
                <>
                  <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                  <span>Catatan Syukur Disimpan &amp; Amalan Selesai ✓</span>
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

      <EditBookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
      />
    </div>
  );
};
