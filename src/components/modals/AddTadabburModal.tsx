'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, CheckCircle, Edit3 } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { QuranTadabburItem } from '@/types';

interface AddTadabburModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: QuranTadabburItem | null;
}

export const AddTadabburModal: React.FC<AddTadabburModalProps> = ({ isOpen, onClose, editingItem }) => {
  const { addQuranTadabbur, updateQuranTadabbur } = useJalurLangitStore();

  const [surahName, setSurahName] = useState('');
  const [ayahRange, setAyahRange] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [latinText, setLatinText] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [story, setStory] = useState('');
  const [topic, setTopic] = useState('');
  const [wisdom, setWisdom] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [mounted, setMounted] = useState(false);

  const isEditing = Boolean(editingItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setSurahName(editingItem.surahName || '');
      setAyahRange(editingItem.ayahRange || '');
      setArabicText(editingItem.arabicText || '');
      setLatinText(editingItem.latinText || '');
      setTranslationText(editingItem.translationText || '');
      setYoutubeLink(editingItem.youtubeLink || '');
      setStory(editingItem.story || '');
      setTopic(editingItem.topic || '');
      setWisdom(editingItem.wisdom || '');
      setActionPlan(editingItem.actionPlan || '');
    } else {
      setSurahName('');
      setAyahRange('');
      setArabicText('');
      setLatinText('');
      setTranslationText('');
      setYoutubeLink('');
      setStory('');
      setTopic('');
      setWisdom('');
      setActionPlan('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surahName.trim()) return;

    if (isEditing && editingItem) {
      updateQuranTadabbur(editingItem.id, {
        surahName: surahName.trim(),
        ayahRange: ayahRange.trim() || 'Ayat Pilihan',
        arabicText: arabicText.trim() || undefined,
        latinText: latinText.trim() || undefined,
        translationText: translationText.trim() || undefined,
        youtubeLink: youtubeLink.trim() || undefined,
        story: story.trim() || '-',
        topic: topic.trim() || '-',
        wisdom: wisdom.trim() || '-',
        actionPlan: actionPlan.trim() || '-',
      });
    } else {
      addQuranTadabbur({
        surahName: surahName.trim(),
        ayahRange: ayahRange.trim() || 'Ayat Pilihan',
        arabicText: arabicText.trim() || undefined,
        latinText: latinText.trim() || undefined,
        translationText: translationText.trim() || undefined,
        youtubeLink: youtubeLink.trim() || undefined,
        story: story.trim() || '-',
        topic: topic.trim() || '-',
        wisdom: wisdom.trim() || '-',
        actionPlan: actionPlan.trim() || '-',
      });
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-35 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pb-24 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header with Title & Close Button (Always visible) */}
        <div className="p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isEditing
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
            }`}>
              {isEditing ? <Edit3 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                {isEditing ? 'Edit Lembar Tadabbur Al-Qur\'an' : 'Quran Journaling & Tadabbur'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEditing
                  ? 'Perbarui renungan, hikmah, atau rencana aksi nyata ayat ini.'
                  : 'Refleksi mendalam dan perenungan ayat suci Al-Qur\'an.'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Nama Surah *</label>
              <input
                type="text"
                required
                placeholder="Contoh: QS. Al-Mulk"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Ayat yang Dibaca</label>
              <input
                type="text"
                placeholder="Contoh: Ayat 1-5"
                value={ayahRange}
                onChange={(e) => setAyahRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Link Murattal / Penjelasan (Opsional)</label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Form Bagian Ayat Al-Qur'an (Arab, Latin, Terjemahan) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2.5">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              📖 Teks Ayat Al-Qur&apos;an (Agar Bisa Langsung Dibaca)
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Teks Arab Berharakat</label>
              <textarea
                dir="rtl"
                rows={3}
                placeholder="Tuliskan teks Arab ayat di sini..."
                value={arabicText}
                onChange={(e) => setArabicText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-base font-arabic focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Transliterasi Latin</label>
              <textarea
                rows={2}
                placeholder="Cara pengucapan / bacaan latin ayat..."
                value={latinText}
                onChange={(e) => setLatinText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs font-medium text-amber-900 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">Arti & Terjemahan Bahasa Indonesia</label>
              <textarea
                rows={2}
                placeholder="Terjemahan resmi ayat dalam bahasa Indonesia..."
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">📜 Kisah pada Ayat (Asbabun Nuzul / Konteks)</label>
            <textarea
              rows={2}
              placeholder="Ceritakan latar belakang atau kisah yang ada dalam ayat ini..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">🎯 Topik Mengenai Ayat Ini</label>
            <input
              type="text"
              placeholder="Contoh: Kekuasaan Allah menciptakan kematian dan kehidupan"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">💡 Hikmah yang Didapat (Tadabbur Jiwa)</label>
            <textarea
              rows={2}
              placeholder="Pelajaran apa yang menyentuh hatimu saat membaca ayat ini..."
              value={wisdom}
              onChange={(e) => setWisdom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">🌱 Rencana Muhasabah & Penerapan Sehari-hari</label>
            <input
              type="text"
              placeholder="Aksi konkret yang akan kulakukan mulai hari ini..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 bg-emerald-800 hover:bg-emerald-900"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Tadabbur' : 'Simpan Lembar Tadabbur'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
