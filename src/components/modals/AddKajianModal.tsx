'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CheckCircle, 
  Edit3, 
  Video, 
  Sparkles, 
  Wand2, 
  Loader2, 
  CheckCircle2, 
  Link2, 
  AlertCircle
} from 'lucide-react';
import { useJalurLangitStore, getTodayKey } from '@/store/useJalurLangitStore';
import { KajianItem } from '@/types';
import { CURATED_KAJIAN_PRESETS, summarizeKajianFromUrl } from '@/utils/smartKajianSummarizer';

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

  // State untuk Fitur AI Resume
  const [aiInputUrl, setAiInputUrl] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

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
      setAiInputUrl(editingItem.videoUrl || '');
      setAiSuccessMessage(null);
      setAiErrorMessage(null);
    } else {
      setTitle('');
      setSpeaker('');
      setVideoUrl('');
      setNotes('');
      setActionPlan('');
      setAiInputUrl('');
      setAiSuccessMessage(null);
      setAiErrorMessage(null);
    }
  }, [editingItem, isOpen]);

  // Handler Rangkum AI Otomatis dari Link
  const handleAiSummarize = async (targetUrl?: string) => {
    const linkToAnalyze = (targetUrl || aiInputUrl || videoUrl).trim();
    if (!linkToAnalyze) {
      setAiErrorMessage('Silakan tempel (paste) link YouTube atau podcast kajian terlebih dahulu.');
      return;
    }

    setIsAiLoading(true);
    setAiErrorMessage(null);
    setAiSuccessMessage(null);

    try {
      // Panggil API Route Server-Side terlebih dahulu
      const res = await fetch('/api/kajian/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkToAnalyze })
      });

      let data;
      if (res.ok) {
        const json = await res.json();
        data = json.data;
      } else {
        // Fallback langsung ke engine client jika API server terkendala
        data = await summarizeKajianFromUrl(linkToAnalyze);
      }

      if (data) {
        setTitle(data.title);
        setSpeaker(data.speaker);
        setVideoUrl(data.videoUrl);
        setAiInputUrl(data.videoUrl);
        setNotes(data.notes);
        setActionPlan(data.actionPlan);
        setAiSuccessMessage(`✨ Berhasil dirangkum oleh AI! Judul: "${data.title}" oleh ${data.speaker}`);
      } else {
        throw new Error('Data rangkuman kosong');
      }
    } catch (err: unknown) {
      console.warn('Fallback to local summarizer engine:', err);
      try {
        const fallbackData = await summarizeKajianFromUrl(linkToAnalyze);
        setTitle(fallbackData.title);
        setSpeaker(fallbackData.speaker);
        setVideoUrl(fallbackData.videoUrl);
        setAiInputUrl(fallbackData.videoUrl);
        setNotes(fallbackData.notes);
        setActionPlan(fallbackData.actionPlan);
        setAiSuccessMessage(`✨ Berhasil dirangkum oleh AI! Judul: "${fallbackData.title}" oleh ${fallbackData.speaker}`);
      } catch {
        setAiErrorMessage('Gagal merangkum video. Mohon periksa kembali link Anda atau isi formulir secara manual.');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handler untuk Preset 1-Tap
  const handleApplyPreset = (presetId: string) => {
    const preset = CURATED_KAJIAN_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setTitle(preset.title);
    setSpeaker(preset.speaker);
    setVideoUrl(preset.videoUrl);
    setAiInputUrl(preset.videoUrl);
    setNotes(preset.notes);
    setActionPlan(preset.actionPlan);
    setAiSuccessMessage(`✨ Kajian rekomendasi "${preset.title}" berhasil dimuat otomatis!`);
    setAiErrorMessage(null);
  };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Fixed Header with Title & Close Button (Always visible at top) */}
        <div className="p-4 sm:p-5 pb-3.5 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isEditing
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            }`}>
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                {isEditing ? 'Edit Resume Kajian' : 'Resume Kajian Ilmu & Tadabbur'}
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
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            title="Tutup Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          
          {/* FITUR CERDAS: AI ASISTEN RANGKUM KAJIAN OTOMATIS */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50/60 to-emerald-50/80 dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  AI Asisten Resume Kajian (1-Klik Cerdas)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                Otomatis &amp; Cerdas
              </span>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
              Tempel link YouTube kajian di bawah, lalu klik <b>Rangkum dengan AI</b>. Judul, pemateri, intisari poin penting, serta rencana aksi nyata akan terisi otomatis.
            </p>

            {/* Input Link + Tombol Rangkum AI */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="url"
                  placeholder="Tempel link YouTube (cth: https://youtube.com/watch?v=...)"
                  value={aiInputUrl}
                  onChange={(e) => {
                    setAiInputUrl(e.target.value);
                    setVideoUrl(e.target.value);
                  }}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              <button
                type="button"
                disabled={isAiLoading}
                onClick={() => handleAiSummarize()}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Rangkum dengan AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Rekomendasi Cepat Kajian Populer (1-Tap Preset) */}
            <div className="space-y-1 pt-1 border-t border-emerald-200/50 dark:border-emerald-800/50">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium block">
                Atau pilih rekomendasi kajian siap rangkum:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CURATED_KAJIAN_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p.id)}
                    className="text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all border bg-white dark:bg-emerald-900/50 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Indikator Loading */}
            {isAiLoading && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                <span className="text-[11px] leading-snug">
                  AI sedang mempelajari isi video kajian, mendeteksi ustadz, dan merumuskan rencana aksi nyata...
                </span>
              </div>
            )}

            {/* Banner Sukses Ter-generate */}
            {aiSuccessMessage && !isAiLoading && (
              <div className="p-2.5 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0" />
                  <span className="text-[11px] leading-snug">{aiSuccessMessage}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAiSuccessMessage(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Banner Error */}
            {aiErrorMessage && !isAiLoading && (
              <div className="p-2.5 rounded-xl bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span className="text-[11px] leading-snug">{aiErrorMessage}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAiErrorMessage(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Form Bagian Identitas Judul & Pemateri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Tema / Judul Kajian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rahasia Doa Terkabul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
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
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Link YouTube / Podcast (Tersimpan)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setAiInputUrl(e.target.value);
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                💡 Poin Penting &amp; Tadabbur
              </label>
              <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                Bebas banyak poin sesuai kajian
              </span>
            </div>
            <textarea
              rows={6}
              placeholder="Tuliskan butir-butir hikmah utama dan ilmu yang didapatkan (bisa 5, 7, atau lebih banyak poin)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11.5px]"
            />
            <p className="text-[10px] text-stone-500 mt-0.5">
              💡 Tip: Format butir dengan awalan tanda &bull; atau nomor urut agar rapi saat dibaca.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                🌱 Rencana Aksi Nyata (Penerapan Sehari-hari)
              </label>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                Bisa banyak langkah nyata
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="Langkah-langkah konkret yang akan kulakukan (bisa banyak poin aksi nyata harian/mingguan)..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11.5px]"
            />
            <p className="text-[10px] text-stone-500 mt-0.5">
              🌱 Tip: Buat rencana aksi yang bertahap (harian, mingguan, evaluasi diri).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
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
