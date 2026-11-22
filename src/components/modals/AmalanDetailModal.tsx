'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Check, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Copy, 
  CheckCheck, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Award,
  Lightbulb,
  Share2
} from 'lucide-react';
import { AmalanItem, ActiveTab } from '@/types';

interface AmalanDetailModalProps {
  item: AmalanItem | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  dynamicTimeRange?: string;
  onNavigateToTab?: (tab: ActiveTab, subTab?: string, meta?: any) => void;
}

export const AmalanDetailModal: React.FC<AmalanDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
  dynamicTimeRange,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'tatacara' | 'bacaan' | 'dalil'>('tatacara');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Reset tab saat amalan baru dibuka
  useEffect(() => {
    if (isOpen) {
      setActiveTab('tatacara');
      setCopiedIndex(null);
    }
  }, [isOpen, item]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleCopyBacaan = (text: string, idx: number) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1813] rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-emerald-800/70 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] text-stone-900 dark:text-stone-100 z-10">
        
        {/* 1. MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-amber-50/40 dark:from-emerald-950/70 dark:via-teal-950/40 dark:to-emerald-900/40">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {item.hukum && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    {item.hukum}
                  </span>
                )}
                {item.dalil?.grade && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{item.dalil.grade}</span>
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                {item.title}
              </h2>

              {item.arabicTitle && (
                <div className="font-arabic text-sm text-emerald-800 dark:text-amber-300 dir-rtl font-medium">
                  {item.arabicTitle}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-emerald-900/40 transition-colors shrink-0"
              title="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time & Target Info Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/50 text-[11px] text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{dynamicTimeRange || item.timeRange}</span>
            </span>

            {item.targetCount && (
              <>
                <span className="text-stone-400">•</span>
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  Target: {item.targetCount} {item.targetUnit}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. SEGMENTED TABS CONTROLLER */}
        <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-stone-200/60 dark:border-emerald-800/40 bg-white dark:bg-[#0c1813]">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 dark:bg-emerald-950/60 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tatacara')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'tatacara'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tata Cara</span>
            </button>

            <button
              onClick={() => setActiveTab('bacaan')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'bacaan'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bacaan & Doa</span>
            </button>

            <button
              onClick={() => setActiveTab('dalil')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'dalil'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Dalil Shahih</span>
            </button>
          </div>
        </div>

        {/* 3. MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: TATA CARA */}
          {activeTab === 'tatacara' && (
            <div className="space-y-3.5 animate-fade-in">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {item.description}
              </p>

              {item.tataCara && item.tataCara.length > 0 ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Panduan Praktis Langkah demi Langkah:
                  </h4>
                  <div className="space-y-2">
                    {item.tataCara.map((step) => (
                      <div 
                        key={step.step}
                        className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/50 flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-700 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {step.step}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {step.title}
                          </div>
                          <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/70 text-xs text-stone-600 dark:text-stone-300">
                  Kerjakan amalan ini dengan tulus dan menghadirkan hati kepada Allah SWT.
                </div>
              )}

              {/* Tips Istiqomah Box */}
              {item.tipsIstiqomah && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block">
                      Kunci Istiqomah:
                    </span>
                    <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                      {item.tipsIstiqomah}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BACAAN & DOA */}
          {activeTab === 'bacaan' && (
            <div className="space-y-4 animate-fade-in">
              {item.bacaanList && item.bacaanList.length > 0 ? (
                item.bacaanList.map((bacaan, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-3xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{bacaan.title}</span>
                      </span>

                      <button
                        onClick={() => handleCopyBacaan(`${bacaan.arabic}\n\n${bacaan.latin}\n\nArtinya:\n${bacaan.translation}`, idx)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-emerald-900/60 border border-stone-200 dark:border-emerald-700 text-[10px] font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-700 flex items-center gap-1 shadow-2xs transition-colors"
                        title="Salin Bacaan & Terjemahan"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <CheckCheck className="w-3 h-3 text-emerald-600" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-400" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Teks Arab Berharakat */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-900/50">
                      <p className="font-arabic text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-loose text-right dir-rtl tracking-wide">
                        {bacaan.arabic}
                      </p>
                    </div>

                    {/* Transliterasi Latin */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Transliterasi Latin:
                      </span>
                      <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 italic leading-relaxed">
                        {bacaan.latin}
                      </p>
                    </div>

                    {/* Terjemahan Bahasa Indonesia */}
                    <div className="pt-2 border-t border-stone-200/60 dark:border-emerald-900/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Artinya:
                      </span>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {bacaan.translation}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-3xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/70 text-center text-xs text-stone-500 py-6">
                  Amalan ini dikerjakan dengan bacaan sholat atau dzikir umum seperti tasbih, tahmid, dan takbir.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DALIL & KEUTAMAAN */}
          {activeTab === 'dalil' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/70 dark:via-teal-950/40 dark:to-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-amber-300">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Sumber Dalil & Landasan Hadis</span>
                  </div>

                  {item.dalil?.grade && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                      {item.dalil.grade}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {item.dalil?.source || 'Rujukan Hadits Shahih'}
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-200 leading-relaxed italic">
                    "{item.dalil?.indonesianText || item.virtue}"
                  </p>
                </div>

                {item.dalil?.notes && (
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    📌 <strong>Catatan:</strong> {item.dalil.notes}
                  </p>
                )}
              </div>

              {/* Fadhilah Tambahan */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/70 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Keutamaan Amalan:
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.virtue}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* 4. MODAL FOOTER ACTIONS */}
        <div className="p-4 border-t border-stone-200/80 dark:border-emerald-800/60 bg-stone-50/70 dark:bg-emerald-950/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Tombol Checklist Selesai */}
          <button
            onClick={onToggleComplete}
            className={`w-full sm:w-auto flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-emerald-600' : 'text-white'}`} />
            <span>{isCompleted ? 'Sudah Selesai Dikerjakan ✓' : 'Tandai Selesai di Checklist'}</span>
          </button>

          {/* Tombol Lintas Menu (jika ada) */}
          {item.linkedMenu && (
            <Link
              href={item.linkedMenu.tab === 'home' ? '/dashboard' : `/${item.linkedMenu.tab}`}
              onClick={() => {
                if (onNavigateToTab && item.linkedMenu) {
                  onNavigateToTab(item.linkedMenu.tab, item.linkedMenu.subTab, {
                    presetId: item.linkedMenu.presetId,
                    targetCount: item.targetCount,
                    amalanId: item.id,
                  });
                }
                onClose();
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span>{item.linkedMenu.actionLabel} →</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
