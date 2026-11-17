'use client';

import React, { useState } from 'react';
import { X, BookOpen, CheckCircle } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';

interface AddKajianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddKajianModal: React.FC<AddKajianModalProps> = ({ isOpen, onClose }) => {
  const addKajian = useJalurLangitStore((s) => s.addKajian);

  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [notes, setNotes] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addKajian({
      date: getTodayKey(),
      title: title.trim(),
      speaker: speaker.trim() || 'Ustadz / Kajian',
      notes: notes.trim(),
      actionPlan: actionPlan.trim(),
    });

    setTitle('');
    setSpeaker('');
    setNotes('');
    setActionPlan('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-emerald-950/90 rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
              Resume Kajian Ilmu
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ikat ilmu dengan mencatat dan menjadikannya aksi nyata.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Tema / Judul Kajian <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rahasia Istiqomah di Sepertiga Malam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Pemateri / Ustadz
            </label>
            <input
              type="text"
              placeholder="Contoh: Ustadz Adi Hidayat / Buya Yahya"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Poin Penting & Tadabbur
            </label>
            <textarea
              rows={3}
              placeholder="Hikmah utama dan ilmu baru yang didapatkan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Rencana Aksi Nyata (Amalan yang akan dipraktikkan)
            </label>
            <input
              type="text"
              placeholder="Contoh: Bangun 30 menit sebelum Subuh & rutin istighfar"
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              Simpan Catatan Kajian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

