'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, CheckCircle, Pencil } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { HajatItem, HajatCategory } from '@/types';

interface AddHajatModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: HajatItem | null;
}

const CATEGORIES: { value: HajatCategory; label: string }[] = [
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'rezeki', label: 'Rezeki' },
  { value: 'karir', label: 'Karir' },
  { value: 'jodoh', label: 'Jodoh' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const AddHajatModal: React.FC<AddHajatModalProps> = ({
  isOpen,
  onClose,
  editingItem,
}) => {
  const { addHajat, updateHajat } = useJalurLangitStore();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HajatCategory>('spiritual');
  const [specificDua, setSpecificDua] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category || 'spiritual');
      setSpecificDua(editingItem.specificDua || '');
      setTargetDate(editingItem.targetDate || '');
    } else {
      setTitle('');
      setCategory('spiritual');
      setSpecificDua('');
      setTargetDate('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      updateHajat(editingItem.id, {
        title: title.trim(),
        category,
        specificDua: specificDua.trim(),
        targetDate: targetDate || undefined,
      });
    } else {
      addHajat({
        title: title.trim(),
        category,
        specificDua: specificDua.trim(),
        targetDate: targetDate || undefined,
        status: 'berikhtiar',
      });
    }

    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-4 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-md my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              {editingItem ? <Pencil className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                {editingItem ? 'Edit Hajat & Doa' : 'Tulis Hajat & Impian'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {editingItem
                  ? 'Perbarui rincian hajat dan doa spesifik Anda.'
                  : 'Sebutkan hajat spesifik Anda di hadapan Allah SWT.'}
              </p>
            </div>
          </div>

          <button
            type="button"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                Kategori Hajat
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HajatCategory)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="dark:bg-emerald-950">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                Target Waktu (Opsional)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Doa Spesifik (Bahasa Sendiri / Afirmasi)
            </label>
            <textarea
              rows={3}
              placeholder="Ya Allah, mudahkanlah urusanku... kabulkanlah dengan cara terbaik-Mu..."
              value={specificDua}
              onChange={(e) => setSpecificDua(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{editingItem ? 'Simpan Perubahan Hajat' : 'Simpan Hajat & Mulai Doakan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
