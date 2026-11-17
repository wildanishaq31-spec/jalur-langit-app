'use client';

import React, { useState } from 'react';
import { X, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

interface AddTadabburModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTadabburModal: React.FC<AddTadabburModalProps> = ({ isOpen, onClose }) => {
  const addQuranTadabbur = useJalurLangitStore((s) => s.addQuranTadabbur);

  const [surahName, setSurahName] = useState('');
  const [ayahRange, setAyahRange] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [story, setStory] = useState('');
  const [topic, setTopic] = useState('');
  const [wisdom, setWisdom] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surahName.trim()) return;

    addQuranTadabbur({
      surahName: surahName.trim(),
      ayahRange: ayahRange.trim() || 'Ayat Pilihan',
      youtubeLink: youtubeLink.trim() || undefined,
      story: story.trim() || '-',
      topic: topic.trim() || '-',
      wisdom: wisdom.trim() || '-',
      actionPlan: actionPlan.trim() || '-',
    });

    setSurahName('');
    setAyahRange('');
    setYoutubeLink('');
    setStory('');
    setTopic('');
    setWisdom('');
    setActionPlan('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Quran Journaling & Tadabbur
            </h3>
            <p className="text-xs text-stone-500">
              Refleksi mendalam dan perenungan ayat suci Al-Qur'an.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Nama Surah *</label>
              <input
                type="text"
                required
                placeholder="Contoh: QS. Al-Mulk"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Ayat yang Dibaca</label>
              <input
                type="text"
                placeholder="Contoh: Ayat 1-5"
                value={ayahRange}
                onChange={(e) => setAyahRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
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
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Kisah pada Ayat (Asbabun Nuzul / Konteks)</label>
            <textarea
              rows={2}
              placeholder="Ceritakan latar belakang atau kisah yang ada dalam ayat ini..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Topik Mengenai Ayat Ini</label>
            <input
              type="text"
              placeholder="Contoh: Kekuasaan Allah menciptakan kematian dan kehidupan"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Hikmah yang Didapat (Tadabbur Jiwa)</label>
            <textarea
              rows={2}
              placeholder="Pelajaran apa yang menyentuh hatimu saat membaca ayat ini..."
              value={wisdom}
              onChange={(e) => setWisdom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Rencana Muhasabah & Penerapan Sehari-hari</label>
            <input
              type="text"
              placeholder="Aksi konkret yang akan kulakukan mulai hari ini..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Simpan Lembar Tadabbur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

