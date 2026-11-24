'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, HandCoins, Heart, Pencil, CheckCircle } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';
import { SedekahItem } from '@/types';

interface AddSedekahModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: SedekahItem | null;
}

export const AddSedekahModal: React.FC<AddSedekahModalProps> = ({
  isOpen,
  onClose,
  editingItem,
}) => {
  const { addSedekah, updateSedekah } = useJalurLangitStore();
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [prayer, setPrayer] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setRecipient(editingItem.recipientOrPlace || '');
      setAmount(editingItem.amount ? String(editingItem.amount) : '');
      setPrayer(editingItem.prayerWish || '');
    } else {
      setRecipient('');
      setAmount('');
      setPrayer('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;

    const parsedAmount = amount ? parseInt(amount.replace(/\D/g, ''), 10) : undefined;
    const finalPrayer = prayer.trim() || 'Ya Allah jadikan sedekah ini wasilah terkabulnya hajat dan penolak bala.';

    if (editingItem) {
      updateSedekah(editingItem.id, {
        recipientOrPlace: recipient.trim(),
        amount: parsedAmount,
        prayerWish: finalPrayer,
      });
    } else {
      addSedekah({
        date: getTodayKey(),
        amount: parsedAmount,
        recipientOrPlace: recipient.trim(),
        prayerWish: finalPrayer,
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
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              {editingItem ? <Pencil className="w-5 h-5" /> : <HandCoins className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                {editingItem ? 'Edit Catatan Sedekah Subuh' : 'Catat Sedekah Subuh'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {editingItem
                  ? 'Perbarui rincian infak subuh dan doa hajat Anda.'
                  : 'Doa malaikat fajar mengiringi setiap infak yang ikhlas.'}
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
              Penyaluran / Wadah Sedekah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kotak Amal Subuh Rumah / QRIS Yatim / Anak Yatim"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
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
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
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
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25"
            >
              {editingItem ? <CheckCircle className="w-4 h-4" /> : <Heart className="w-4 h-4 text-rose-300" />}
              <span>{editingItem ? 'Simpan Perubahan Sedekah' : 'Simpan Sedekah Subuh'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
