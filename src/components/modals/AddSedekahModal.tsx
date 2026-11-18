'use client';

import React, { useState } from 'react';
import { X, HandCoins, Heart } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';

interface AddSedekahModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSedekahModal: React.FC<AddSedekahModalProps> = ({ isOpen, onClose }) => {
  const { addSedekah, appTheme } = useJalurLangitStore();

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-md my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              appTheme === 'blush'
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            }`}>
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                Catat Sedekah Subuh
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Doa malaikat fajar mengiringi setiap infak yang ikhlas.
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

