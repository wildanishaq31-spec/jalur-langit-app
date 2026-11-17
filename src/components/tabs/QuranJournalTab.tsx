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
  FileText
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { AddKajianModal } from '@/components/modals/AddKajianModal';
import { AddTadabburModal } from '@/components/modals/AddTadabburModal';
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
    deleteQuranTadabbur
  } = useJalurLangitStore();

  const [activeSubTab, setActiveSubTab] = useState<'tadabbur' | 'juz' | 'kajian' | 'syukur'>('tadabbur');
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [isTadabburModalOpen, setIsTadabburModalOpen] = useState(false);

  // Gratitude for selectedDate
  const currentGratitude = gratitudeMap[selectedDate] || ['', '', ''];
  const [gratitude1, setGratitude1] = useState(currentGratitude[0] || '');
  const [gratitude2, setGratitude2] = useState(currentGratitude[1] || '');
  const [gratitude3, setGratitude3] = useState(currentGratitude[2] || '');
  const [isSavedGratitude, setIsSavedGratitude] = useState(false);

  React.useEffect(() => {
    const list = gratitudeMap[selectedDate] || ['', '', ''];
    setGratitude1(list[0] || '');
    setGratitude2(list[1] || '');
    setGratitude3(list[2] || '');
    setIsSavedGratitude(false);
  }, [selectedDate, gratitudeMap]);

  const handleSaveGratitude = () => {
    setGratitudeList(selectedDate, [gratitude1, gratitude2, gratitude3]);
    setIsSavedGratitude(true);
    setTimeout(() => setIsSavedGratitude(false), 2000);
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
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Sub-tab Navigation */}
      <div className="flex bg-stone-100 dark:bg-emerald-950/60 p-1 rounded-2xl border border-stone-200/80 dark:border-emerald-800/60 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('tadabbur')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'tadabbur'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Quran Tadabbur ({quranTadabburList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('juz')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'juz'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>1 Day 1 Juz ({quranCompletedJuz.length}/30)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kajian')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'kajian'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-500" />
          <span>1 Day 1 Kajian ({kajianNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('syukur')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'syukur'
              ? 'bg-white dark:bg-emerald-900 text-teal-900 dark:text-teal-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-pink-500" />
          <span>Gratitude Journal</span>
        </button>
      </div>

      {/* SUB-TAB 1: DEEP QURAN TADABBUR (SHEET 8) */}
      {activeSubTab === 'tadabbur' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                Quran Journaling & Tadabbur
              </h2>
              <p className="text-xs text-stone-500">
                Format lengkap: Ayat, Kisah, Topik, Hikmah, dan Rencana Aksi Nyata
              </p>
            </div>

            <button
              onClick={() => setIsTadabburModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Tadabbur</span>
            </button>
          </div>

          <div className="space-y-4">
            {quranTadabburList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-xl">
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

                  <div className="flex items-center gap-2">
                    {item.youtubeLink && (
                      <a
                        href={item.youtubeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        title="Buka Link Kajian"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => deleteQuranTadabbur(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Pillars of Tadabbur based on Spreadsheet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 space-y-1">
                    <span className="font-bold text-teal-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
                      📜 Kisah & Konteks Ayat
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40 space-y-1">
                    <span className="font-bold text-teal-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
                      🎯 Topik Mengenai Ayat
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {item.topic}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
                      💡 Hikmah yang Didapat
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      “{item.wisdom}”
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                      🌱 Aksi Nyata & Muhasabah
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                      {item.actionPlan}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 1 DAY 1 JUZ TRACKER */}
      {activeSubTab === 'juz' && (
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
      {activeSubTab === 'kajian' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-500" />
                <span>1 Day 1 Kajian Daily Checklist</span>
              </h2>
              <p className="text-xs text-stone-500">
                Simpan ringkasan video YouTube atau podcast kajian dan aksi nyatanya.
              </p>
            </div>

            <button
              onClick={() => setIsKajianModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kajian</span>
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

                    <button
                      onClick={() => deleteKajian(note.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
      {activeSubTab === 'syukur' && (
        <div className="p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Heart className="w-5 h-5" />
            <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
              Gratitude Journal ({formatDateIndonesian(selectedDate)})
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            “Jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu.” (QS. Ibrahim: 7)
          </p>

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-amber-600">1.</span>
              <input
                type="text"
                placeholder="Hal pertama yang sangat kamu syukuri hari ini..."
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border text-xs focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-amber-600">2.</span>
              <input
                type="text"
                placeholder="Kebaikan kecil atau kemudahan yang kamu rasakan..."
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border text-xs focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-amber-600">3.</span>
              <input
                type="text"
                placeholder="Kesehatan, orang terkasih, atau rezeki tak terduga..."
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleSaveGratitude}
              className="w-full py-2.5 px-4 bg-stone-900 dark:bg-emerald-800 text-white text-xs font-bold rounded-2xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              {isSavedGratitude ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tersimpan untuk Tanggal Ini!</span>
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
      <AddTadabburModal
        isOpen={isTadabburModalOpen}
        onClose={() => setIsTadabburModalOpen(false)}
      />

      <AddKajianModal
        isOpen={isKajianModalOpen}
        onClose={() => setIsKajianModalOpen(false)}
      />
    </div>
  );
};
