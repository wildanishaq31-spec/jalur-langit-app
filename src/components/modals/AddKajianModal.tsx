'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle, Edit3, Video } from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';
import { KajianItem } from '@/types';

interface AddKajianModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: KajianItem | null;
}

export const AddKajianModal: React.FC<AddKajianModalProps> = ({ isOpen, onClose, editingItem }) => {
  const { addKajian, updateKajian, appTheme } = useJalurLangitStore();

  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  const isEditing = Boolean(editingItem);

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

  if (!isOpen) return null;

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
          <div className={`p-3 rounded-2xl ${
            isEditing
              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
          }`}>
            {isEditing ? <Edit3 className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
              {isEditing ? 'Edit Resume Kajian' : 'Resume Kajian Ilmu'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isEditing
                ? 'Perbarui ringkasan materi ceramah dan rencana aksi nyata.'
                : 'Ikat ilmu dengan mencatat dan menjadikannya aksi nyata.'}
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
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
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
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Link YouTube / Podcast (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
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
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
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
              <span>{isEditing ? 'Simpan Perubahan Kajian' : 'Simpan Catatan Kajian'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
