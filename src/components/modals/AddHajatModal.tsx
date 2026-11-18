'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';

interface AddHajatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddHajatModal: React.FC<AddHajatModalProps> = ({ isOpen, onClose }) => {
  const { addHajat, appTheme } = useJalurLangitStore();

  const [title, setTitle] = useState('');
  const [specificDua, setSpecificDua] = useState('');
  const [targetDate, setTargetDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHajat({
      title: title.trim(),
      specificDua: specificDua.trim(),
      targetDate: targetDate || undefined,
      category: 'spiritual',
      status: 'berikhtiar',
    });

    setTitle('');
    setSpecificDua('');
    setTargetDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-md my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              appTheme === 'blush'
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                Tulis Hajat & Impian
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Sebutkan hajat spesifik Anda di hadapan Allah SWT.
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Hajat / Impian Utama <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Lulus Ujian / Rezeki Berkah Melimpah"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Doa Spesifik (Bahasa Sendiri)
            </label>
            <textarea
              rows={4}
              placeholder="Ya Allah, mudahkanlah urusanku... kabulkanlah dengan cara terbaik-Mu..."
              value={specificDua}
              onChange={(e) => setSpecificDua(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Target Waktu Tercapai (Opsional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-xs text-white ${
                appTheme === 'blush'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Hajat & Mulai Doakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
