'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Plus, 
  Image as ImageIcon, 
  CheckCircle2, 
  Mail, 
  Heart, 
  Calendar, 
  Trash2, 
  Unlock, 
  Lock, 
  RefreshCw,
  Send,
  Pencil,
  X
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { VisionBoardItem } from '@/types';
import { AddVisionModal } from '@/components/modals/AddVisionModal';

const AFFIRMATION_PRESETS = [
  'Hari ini aku bersyukur dengan tenang, percaya diri, dan menerima hal baik yang Allah hadirkan untukku.',
  'Rezekiku sudah dijamin oleh Allah Yang Maha Kaya. Tugasku adalah taat, berikhtiar, dan berbaik sangka.',
  'Aku melepaskan rasa cemas dan menyerahkan seluruh urusanku kepada sebaik-baiknya Perencana.',
  'Setiap kebaikan dan amalan yang kulakukan hari ini akan menjadi pembuka kemudahan di masa depan.',
  'Aku pantas bahagia, sukses, dan menjadi pribadi yang bertakwa, berkualitas, serta membawa manfaat bagi banyak orang.'
];

export const VisionBoardTab: React.FC = () => {
  const { 
    visionBoardItems, 
    addVisionItem, 
    deleteVisionItem, 
    toggleVisionItemAchieved,
    todayAffirmation, 
    setTodayAffirmation,
    futureLetters, 
    addFutureLetter, 
    toggleOpenFutureLetter, 
    deleteFutureLetter 
  } = useJalurLangitStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVisionItem, setEditingVisionItem] = useState<VisionBoardItem | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const affirmationRef = useRef<HTMLTextAreaElement | null>(null);

  // Form states for future letter
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterOpenDate, setLetterOpenDate] = useState('Hari ke-30');

  useEffect(() => {
    if (affirmationRef.current) {
      affirmationRef.current.style.height = 'auto';
      affirmationRef.current.style.height = `${affirmationRef.current.scrollHeight}px`;
    }
  }, [todayAffirmation]);

  const handleToggleAchieved = (id: string, currentlyAchieved: boolean) => {
    toggleVisionItemAchieved(id);
    if (!currentlyAchieved) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8']
      });
    }
  };

  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterContent.trim()) return;

    addFutureLetter({
      title: letterTitle.trim(),
      content: letterContent.trim(),
      writeDate: new Date().toLocaleDateString('id-ID'),
      openDate: letterOpenDate,
    });

    setLetterTitle('');
    setLetterContent('');
    setIsLetterModalOpen(false);
  };

  const randomizeAffirmation = () => {
    const next = AFFIRMATION_PRESETS[Math.floor(Math.random() * AFFIRMATION_PRESETS.length)];
    setTodayAffirmation(next);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* 1. TODAY'S AFFIRMATION (Sheet 1) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 dark:from-rose-950/30 dark:via-emerald-950/40 dark:to-pink-950/20 border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Today's Self-Affirmation (Afirmasi Positif)
            </h2>
          </div>
          <button
            onClick={randomizeAffirmation}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-white/60 transition-colors"
            title="Ganti Afirmasi Acak"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <textarea
          ref={affirmationRef}
          rows={1}
          value={todayAffirmation}
          onChange={(e) => {
            setTodayAffirmation(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full bg-white/80 dark:bg-emerald-900/30 p-3.5 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 text-sm font-serif italic text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed resize-none overflow-hidden block min-h-[50px] transition-all"
          placeholder="Tuliskan afirmasi positifmu hari ini..."
        />
        <div className="text-[11px] text-stone-500">
          Ucapkan dan renungkan di pagi hari untuk menumbuhkan energi positif.
        </div>
      </div>

      {/* 2. VISUAL VISION BOARD (Sheet 1 & 2) */}
      <div className="space-y-3.5">
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>Vision Board & Papan Impian</span>
          </h2>
          <p className="text-xs text-stone-500">
            Visualisasikan cita-cita besarmu. Apa yang sering kamu lihat akan tertanam kuat dalam doa.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVisionItem(null);
            setIsAddModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Impian Baru</span>
        </button>

        {/* Vision Board Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visionBoardItems.map((item) => (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-3xl border transition-all ${
                item.isAchieved
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-emerald-950/30 border-stone-200/80 dark:border-emerald-800/60 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback image if broken
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                  {item.category}
                </span>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingVisionItem(item);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md transition-colors"
                    title="Edit Impian"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Hapus impian ini dari Vision Board?')) {
                        deleteVisionItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                    title="Hapus Impian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {item.description && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-emerald-900/40">
                  <span className="text-[11px] text-stone-400">
                    {item.targetDate ? `Target: ${item.targetDate}` : 'Ikhtiar Berkelanjutan'}
                  </span>

                  <button
                    onClick={() => handleToggleAchieved(item.id, item.isAchieved)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.isAchieved
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-emerald-900/40 text-stone-700 dark:text-stone-300 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item.isAchieved ? 'Terkabul! ✨' : 'Tandai Tercapai'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. LETTER TO FUTURE SELF (Sheet 1) */}
      <div className="p-5 sm:p-6 bg-white dark:bg-emerald-950/40 rounded-3xl border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Mail className="w-5 h-5 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
            Letter to Future Self (Surat untuk Diri di Masa Depan)
          </h2>
        </div>

        <button
          onClick={() => setIsLetterModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-2xl text-xs sm:text-sm font-bold border border-indigo-200 dark:border-indigo-800 transition-all active:scale-98 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tulis Surat untuk Masa Depan</span>
        </button>

        <div className="space-y-3">
          {futureLetters.map((letter) => (
            <div
              key={letter.id}
              className="p-5 rounded-3xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200 dark:border-emerald-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    {letter.isOpened ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                    <span>{letter.title}</span>
                  </h3>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Ditulis: {letter.writeDate} • Dibuka saat: <strong>{letter.openDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleOpenFutureLetter(letter.id)}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-emerald-900 border text-xs font-semibold hover:bg-stone-100"
                  >
                    {letter.isOpened ? 'Tutup Surat' : 'Buka & Baca'}
                  </button>

                  <button
                    onClick={() => deleteFutureLetter(letter.id)}
                    className="p-1 text-stone-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {letter.isOpened && (
                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-stone-200/60 dark:border-emerald-800/40 text-xs italic font-serif leading-relaxed text-stone-700 dark:text-stone-200 animate-fade-in">
                  “{letter.content}”
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD / EDIT VISION ITEM */}
      <AddVisionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVisionItem(null);
        }}
        editingItem={editingVisionItem}
      />

      {/* MODAL: ADD FUTURE LETTER */}
      {isLetterModalOpen && (
        <div className="fixed inset-0 z-35 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pb-24 flex items-center justify-center animate-fade-in">
          <div className="relative w-full max-w-md my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                    Surat untuk Diri Masa Depan
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Tuliskan pesan berharga yang akan kamu buka nanti.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLetterModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
                title="Tutup Popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLetter} className="p-5 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul Surat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pesan untukku saat selesai 30 hari..."
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Isi Surat Curahan Hati</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan harapanmu, pengingat agar tidak sombong jika terkabul, dan janji untuk terus istiqomah..."
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Kapan Surat Ini Boleh Dibuka?</label>
                <input
                  type="text"
                  placeholder="Contoh: Hari ke-30 / Akhir Tahun"
                  value={letterOpenDate}
                  onChange={(e) => setLetterOpenDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLetterModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Kunci & Simpan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

