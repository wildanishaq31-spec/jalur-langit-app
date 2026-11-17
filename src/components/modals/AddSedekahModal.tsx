'use client';

import React, { useState } from 'react';
import { X, HandCoins, Heart } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';

interface AddSedekahModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSedekahModal: React.FC<AddSedekahModalProps> = ({ isOpen, onClose }) => {
  const addSedekah = useJalurLangitStore((s) => s.addSedekah);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [prayer, setPrayer] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;

    addSedekah({
      date: getTodayKey(),
      amount: amount ? parseInt(amount.replace(/\D/g, ''), 10) : undefined,
      recipientOrPlace: recipient.trim(),
      prayerWish: prayer.trim() || 'Ya Allah jadikan sedekah ini wasilah terkabulnya hajat dan penolak bala.',
    });

    setAmount('');
    setRecipient('');
    setPrayer('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-emerald-950/90 rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800 text-stone-900 dark:text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-2xl">
            <HandCoins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
              Catat Sedekah Subuh
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Doa malaikat fajar mengiringi setiap infak yang ikhlas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Penyaluran / Wadah Sedekah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kotak Amal Subuh Rumah / QRIS Yatim / Anak Tetangga"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Nominal (Rp) - Opsional
            </label>
            <input
              type="number"
              placeholder="Contoh: 10000, 20000, 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Doa Hajat yang Diselipkan
            </label>
            <textarea
              rows={3}
              placeholder="Ya Allah, dengan wasilah sedekah subuh ini, kabulkanlah hajat..."
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 text-rose-300" />
              Simpan Sedekah Subuh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

