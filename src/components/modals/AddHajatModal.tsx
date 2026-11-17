'use client';

import React, { useState } from 'react';
import { X, Sparkles, HeartHandshake } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { HajatCategory } from '@/types';

interface AddHajatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: HajatCategory; label: string }[] = [
  { value: 'rezeki', label: '💰 Rezeki & Finansial' },
  { value: 'karir', label: '💼 Karir & Bisnis' },
  { value: 'jodoh', label: '💍 Jodoh & Pernikahan' },
  { value: 'keluarga', label: '👨‍👩‍👧 Keluarga & Keturunan' },
  { value: 'kesehatan', label: '🌿 Kesehatan & Kesembuhan' },
  { value: 'spiritual', label: '🕌 Ketaatan & Ketenangan Jiwa' },
  { value: 'lainnya', label: '✨ Hajat / Impian Lainnya' },
];

export const AddHajatModal: React.FC<AddHajatModalProps> = ({ isOpen, onClose }) => {
  const addHajat = useJalurLangitStore((s) => s.addHajat);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HajatCategory>('rezeki');
  const [specificDua, setSpecificDua] = useState('');
  const [targetDate, setTargetDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHajat({
      title: title.trim(),
      category,
      specificDua: specificDua.trim() || 'Semoga Allah mengabulkan hajat ini dengan cara yang paling indah dan waktu yang paling tepat.',
      targetDate: targetDate || undefined,
      status: 'berikhtiar',
    });

    setTitle('');
    setSpecificDua('');
    setTargetDate('');
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
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
              Tulis Hajat & Impian
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sebutkan hajat spesifik Anda di hadapan Allah SWT.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Judul Hajat / Impian <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kelunasan KPR Rumah & Bebas Riba"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HajatCategory)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Lafadz Doa Spesifik (Afirmasi Langit)
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan doa yang sering Anda ulang di sujud terakhir atau setelah sedekah subuh..."
              value={specificDua}
              onChange={(e) => setSpecificDua(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Target Waktu / Harapan (Opsional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-amber-300" />
              Simpan & Pasrahkan ke Langit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

