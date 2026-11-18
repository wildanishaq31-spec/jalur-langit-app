'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Edit3, Video } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';
import { KajianItem } from '@/types';

interface AddKajianModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: KajianItem | null;
}

export const AddKajianModal: React.FC<AddKajianModalProps> = ({ isOpen, onClose, editingItem }) => {
  const { addKajian, updateKajian } = useJalurLangitStore();

  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [mounted, setMounted] = useState(false);

  const isEditing = Boolean(editingItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || '');
      setSpeaker(editingItem.speaker || '');
      setVideoUrl(editingItem.videoUrl || '');
      setNotes(editingItem.notes || '');
      setActionPlan(editingItem.actionPlan || '');
    } else {
      setTitle('');
      setSpeaker('');
      setVideoUrl('');
      setNotes('');
      setActionPlan('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && editingItem) {
      updateKajian(editingItem.id, {
        title: title.trim(),
        speaker: speaker.trim() || 'Ustadz / Kajian',
        videoUrl: videoUrl.trim() || undefined,
        notes: notes.trim(),
        actionPlan: actionPlan.trim(),
      });
    } else {
      addKajian({
        date: getTodayKey(),
        title: title.trim(),
        speaker: speaker.trim() || 'Ustadz / Kajian',
        videoUrl: videoUrl.trim() || undefined,
        notes: notes.trim(),
        actionPlan: actionPlan.trim(),
      });
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-35 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pb-24 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden">
        {/* Header with Title & Close Button */}
        <div className="p-5 pb-3.5 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isEditing
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            }`}>
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                {isEditing ? 'Edit Resume Kajian' : 'Resume Kajian Ilmu'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isEditing
                  ? 'Perbarui ringkasan materi ceramah dan rencana aksi nyata.'
                  : 'Ikat ilmu dengan mencatat dan menjadikannya aksi nyata.'}
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

        {/* Compact Form Body (Matches Tadabbur Modal Layout) */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Tema / Judul Kajian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rahasia Istiqomah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Pemateri / Ustadz
              </label>
              <input
                type="text"
                placeholder="Contoh: Ustadz Adi Hidayat"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Link YouTube / Podcast (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Poin Penting & Tadabbur
            </label>
            <textarea
              rows={2}
              placeholder="Hikmah utama dan ilmu baru yang didapatkan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Rencana Aksi Nyata (Penerapan Sehari-hari)
            </label>
            <input
              type="text"
              placeholder="Contoh: Bangun 30 menit sebelum Subuh & rutin istighfar"
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Kajian' : 'Simpan Catatan Kajian'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
