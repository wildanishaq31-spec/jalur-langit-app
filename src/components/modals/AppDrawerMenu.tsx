'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Sparkles, 
  Compass, 
  FileText, 
  Calculator, 
  Headphones, 
  Mail, 
  Heart, 
  Send, 
  Check, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Database, 
  Download, 
  Upload,
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  ArrowRight,
  Flame,
  CheckCircle2,
  LogOut,
  Smartphone,
  KeyRound,
  BellRing,
  FileJson,
  AlertTriangle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROADMAP_FEATURES } from '@/data/roadmapData';
import { RoadmapFeatureItem, JalurLangitBackupData } from '@/types';

interface AppDrawerMenuProps {
  onOpenLogoutModal?: () => void;
}

export const AppDrawerMenu: React.FC<AppDrawerMenuProps> = ({ onOpenLogoutModal }) => {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen,
    drawerActiveTab,
    setDrawerActiveTab,
    featureVotes,
    userVotedFeatures,
    voteFeature,
    userFeatureRequests,
    addFeatureRequest,
    appTheme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    vibrationEnabled,
    toggleVibration,
    notificationsEnabled,
    userLocation,
    setIsAlarmModalOpen,
    resetAllData,
    resetToFreshUser,
    completedAmalan,
    hajatList,
    sedekahLogs,
    visionBoardItems,
    dailyTasbihMap,
    tasbihTotalLifetime,
    glowUpMap,
    roadmapFeatures,
    exportBackupData,
    restoreBackupData
  } = useJalurLangitStore();

  const { currentUser, logout } = useAuthStore();

  const [newIdeaText, setNewIdeaText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Backup & Restore State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [pendingBackup, setPendingBackup] = useState<{
    data: Partial<JalurLangitBackupData>;
    fileName: string;
    fileSizeKb: number;
    stats: {
      amalanDays: number;
      hajatCount: number;
      sedekahCount: number;
      tasbihDays: number;
      glowUpDays: number;
    };
  } | null>(null);
  const [restoreFeedback, setRestoreFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    stats?: {
      amalanDays: number;
      hajatCount: number;
      sedekahCount: number;
      tasbihDays: number;
      glowUpDays: number;
    };
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    addFeatureRequest(newIdeaText.trim());
    setNewIdeaText('');
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 4000);
  };

  const handleExportBackup = () => {
    try {
      const backupData = exportBackupData();
      const jsonString = JSON.stringify(backupData, null, 2);
      
      // Copy to clipboard
      try {
        navigator.clipboard.writeText(jsonString);
      } catch {}

      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 3500);

      // Download file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const datePart = new Date().toISOString().slice(0, 10);
      link.download = `jalur-langit-cadangan-${datePart}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal mengekspor data cadangan:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFeedback(null);

    // Validasi ekstensi
    if (!file.name.toLowerCase().endsWith('.json')) {
      setRestoreFeedback({
        type: 'error',
        message: 'File harus berformat .json cadangan resmi Jalur Langit.',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as Partial<JalurLangitBackupData>;

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Format JSON tidak valid');
        }

        // Hitung data yang terdeteksi
        const amalanDays = Object.keys(parsed.completedAmalan || {}).length;
        const hajatCount = Array.isArray(parsed.hajatList) ? parsed.hajatList.length : 0;
        const sedekahCount = Array.isArray(parsed.sedekahLogs) ? parsed.sedekahLogs.length : 0;
        const tasbihDays = Object.keys(parsed.dailyTasbihMap || {}).length;
        const glowUpDays = Object.keys(parsed.glowUpMap || {}).length;

        if (amalanDays === 0 && hajatCount === 0 && sedekahCount === 0 && tasbihDays === 0 && glowUpDays === 0 && !parsed.app) {
          setRestoreFeedback({
            type: 'error',
            message: 'File ini kosong atau tidak memiliki struktur data Jalur Langit.',
          });
          return;
        }

        setPendingBackup({
          data: parsed,
          fileName: file.name,
          fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
          stats: {
            amalanDays,
            hajatCount,
            sedekahCount,
            tasbihDays,
            glowUpDays
          }
        });
      } catch (err) {
        console.error('Error membaca file cadangan:', err);
        setRestoreFeedback({
          type: 'error',
          message: 'Gagal memproses file. Pastikan file JSON tidak korup atau rusak.',
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleExecuteRestore = (mode: 'merge' | 'replace') => {
    if (!pendingBackup) return;

    try {
      const res = restoreBackupData(pendingBackup.data, mode);
      if (res.success) {
        setRestoreFeedback({
          type: 'success',
          message: res.message,
          stats: res.stats,
        });
        setPendingBackup(null);
      } else {
        setRestoreFeedback({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err) {
      console.error('Gagal memulihkan data:', err);
      setRestoreFeedback({
        type: 'error',
        message: 'Terjadi kesalahan sistem saat memulihkan data.',
      });
    }
  };

  const renderFeatureIcon = (iconName: RoadmapFeatureItem['iconName']) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'FileText':
        return <FileText className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Headphones':
        return <Headphones className={iconClass} />;
      case 'Mail':
        return <Mail className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0c1813] border-l border-stone-200 dark:border-emerald-800/60 shadow-2xl flex flex-col justify-between text-stone-900 dark:text-stone-100">
          
          {/* 1. DRAWER HEADER */}
          <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-emerald-800/60 bg-stone-50/70 dark:bg-emerald-950/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-amber-300 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-sm tracking-tight">
                      Jalur Langit Lab
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    Roadmap Fitur & Pusat Utilitas Aplikasi
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-emerald-900/40 transition-colors"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-200/60 dark:bg-emerald-900/30 text-xs font-bold">
              <button
                onClick={() => setDrawerActiveTab('lab')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  drawerActiveTab === 'lab'
                    ? 'bg-white dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Roadmap Fitur Lab</span>
              </button>

              <button
                onClick={() => setDrawerActiveTab('utilitas')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  drawerActiveTab === 'utilitas'
                    ? 'bg-white dark:bg-emerald-800 text-emerald-800 dark:text-white shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Utilitas & Data</span>
              </button>
            </div>
          </div>

          {/* 2. DRAWER BODY SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            
            {drawerActiveTab === 'lab' && (
              <>
                {/* Intro Lab Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Fitur Tambahan di Luar Bottom Bar</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    Koleksi fitur-fitur baru berikut ini sedang disiapkan dalam tahap riset dan pengembangan (Coming Soon). Berikan vote pada fitur favoritmu agar prioritas rilisnya semakin cepat!
                  </p>
                </div>

                {/* List Roadmap Features */}
                <div className="space-y-3.5">
                  {(roadmapFeatures && roadmapFeatures.length > 0 ? roadmapFeatures : ROADMAP_FEATURES)
                    .filter((feature) => !feature.isDraft)
                    .map((feature) => {
                    const votes = featureVotes[feature.id] || 0;
                    const hasVoted = userVotedFeatures.includes(feature.id);

                    return (
                      <div
                        key={feature.id}
                        className="p-4 rounded-3xl bg-stone-50/80 dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/50 shadow-xs space-y-3 transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
                      >
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-white dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs border border-stone-200/60 dark:border-emerald-700/60">
                              {renderFeatureIcon(feature.iconName)}
                            </div>
                            <div>
                              <h3 className="font-bold text-xs sm:text-sm font-serif text-stone-900 dark:text-stone-100">
                                {feature.title}
                              </h3>
                              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                                Target Rilis: {feature.estimatedRelease}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${feature.badgeColor}`}>
                            {feature.statusLabel}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {feature.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-700 dark:text-stone-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>

                        {/* Progress bar & Vote button */}
                        <div className="pt-2 border-t border-stone-200/60 dark:border-emerald-900/40 flex items-center justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-stone-500">
                              <span>Progres Pengembangan</span>
                              <span>{feature.progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200 dark:bg-emerald-900/60 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                                style={{ width: `${feature.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => voteFeature(feature.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all active:scale-95 shrink-0 border ${
                              hasVoted
                                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                : 'bg-white dark:bg-emerald-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-emerald-800'
                            }`}
                            title="Dukung fitur ini"
                          >
                            <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white text-white animate-pulse' : 'text-rose-500'}`} />
                            <span>{votes} Vote</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form Kirim Usulan Fitur Baru */}
                <div className="p-4 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      Punya Ide Fitur Lainnya?
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    Tuliskan ide fitur bermanfaat yang kamu inginkan untuk mempermudah perbaikan dirimu dan ibadah sehari-hari.
                  </p>

                  <form onSubmit={handleSubmitIdea} className="space-y-2">
                    <textarea
                      value={newIdeaText}
                      onChange={(e) => setNewIdeaText(e.target.value)}
                      placeholder="Contoh: Tambahkan fitur pengingat doa qunut subuh, doa setelah sholat, atau alarm tahajjud bertingkat..."
                      rows={2}
                      className="w-full text-xs p-3 rounded-2xl bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 resize-none"
                    />

                    <div className="flex items-center justify-between">
                      {submissionSuccess ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Usulan ide berhasil tercatat!
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">
                          Ide akan dicatat di backlog pengembang.
                        </span>
                      )}

                      <button
                        type="submit"
                        disabled={!newIdeaText.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1"
                      >
                        <span>Kirim Ide</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </form>

                  {/* List ide yang diajukan user */}
                  {userFeatureRequests.length > 0 && (
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                        Usulan Fitur Kamu ({userFeatureRequests.length}):
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {userFeatureRequests.map((req) => (
                          <div 
                            key={req.id} 
                            className="p-2 rounded-xl bg-white/80 dark:bg-emerald-950/80 border border-amber-200/50 dark:border-emerald-800 text-[11px] space-y-1"
                          >
                            <p className="text-stone-800 dark:text-stone-200">{req.text}</p>
                            <div className="flex justify-between items-center text-[9px] text-stone-400">
                              <span>Status: Dalam Tinjauan Tim</span>
                              <span>{new Date(req.submittedAt).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {drawerActiveTab === 'utilitas' && (
              <>
                {/* 0. Info Lisensi Pembeli Lynk.id */}
                {currentUser && (
                  <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-100/90 to-teal-50 dark:from-emerald-950/80 dark:to-teal-950/50 border border-emerald-300 dark:border-emerald-700/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                          {currentUser.name ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                            <span>{currentUser.name}</span>
                          </div>
                          <div className="text-[10px] text-stone-500">{currentUser.email}</div>
                        </div>
                      </div>

                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 shadow-xs">
                        {currentUser.tierLabel}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">Order: {currentUser.orderId}</span>
                      <button
                        onClick={() => {
                          if (onOpenLogoutModal) {
                            setIsDrawerOpen(false);
                            onOpenLogoutModal();
                          } else {
                            logout();
                            setIsDrawerOpen(false);
                          }
                        }}
                        className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
                      >
                        Ganti Akun / Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. Pengaturan Tampilan & Efek */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Pengaturan Tampilan & Sensori
                  </h4>

                  <div className="p-4 rounded-3xl bg-stone-50/80 dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/50 space-y-3.5">
                    {/* Theme switcher row */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          {appTheme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                          <span>Mode Tampilan Aplikasi</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {appTheme === 'dark' ? 'Saat ini: Tema Gelap (Hemat baterai)' : 'Saat ini: Tema Terang (Bersih & cerah)'}
                        </p>
                      </div>

                      <button
                        onClick={toggleTheme}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-900 border border-stone-200 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-200 shadow-xs active:scale-95 transition-all"
                      >
                        Ganti Tema
                      </button>
                    </div>

                    {/* Sound toggle row */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-emerald-900/40">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                          <span>Efek Suara Tasbih & Checklist</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Suara klik saat berdzikir dan centang amalan
                        </p>
                      </div>

                      <button
                        onClick={toggleSound}
                        className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                          soundEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          soundEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Vibration toggle row */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-emerald-900/40">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <Vibrate className="w-4 h-4 text-emerald-600" />
                          <span>Getaran Haptik Perangkat</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Sensasi ketukan saat menekan tombol tasbih
                        </p>
                      </div>

                      <button
                        onClick={toggleVibration}
                        className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                          vibrationEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          vibrationEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* GPS Prayer Times & Notification row */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-emerald-900/40">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <BellRing className="w-4 h-4 text-emerald-600" />
                          <span>Pengingat & Jadwal Sholat GPS</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {userLocation?.cityName?.split(',')[0] || 'Situbondo'} • {notificationsEnabled ? '🟢 Notifikasi Aktif' : '⚪ Belum Aktif'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsAlarmModalOpen(true);
                          setIsDrawerOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                      >
                        Buka
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Manajemen Data & Backup */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Penyimpanan & Cadangan Data
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      100% Offline-First
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-stone-50/80 dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/50 space-y-4">
                    {/* Ringkasan Data Aktif di HP */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-emerald-900/40 border border-stone-200/70 dark:border-emerald-800/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
                        <span className="flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-emerald-600" />
                          <span>Status Data Lokal di Perangkat Ini</span>
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Tersimpan Aman" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10.5px] text-stone-600 dark:text-stone-300">
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                          <span className="text-stone-400 block text-[9.5px]">Amalan Harian:</span>
                          <strong className="text-emerald-700 dark:text-emerald-300">{Object.keys(completedAmalan || {}).length} Hari</strong> Tercatat
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                          <span className="text-stone-400 block text-[9.5px]">Impian & Hajat:</span>
                          <strong className="text-emerald-700 dark:text-emerald-300">{hajatList?.length || 0} Doa</strong> Aktif
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                          <span className="text-stone-400 block text-[9.5px]">Sedekah Subuh:</span>
                          <strong className="text-emerald-700 dark:text-emerald-300">{sedekahLogs?.length || 0} Catatan</strong> Riwayat
                        </div>
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                          <span className="text-stone-400 block text-[9.5px]">Dzikir Tasbih:</span>
                          <strong className="text-emerald-700 dark:text-emerald-300">{tasbihTotalLifetime || 0}x</strong> Ketukan
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-400 leading-relaxed italic">
                        Semua data tersimpan aman di memori HP. Cadangkan file secara berkala agar bisa dipulihkan saat ganti HP.
                      </p>
                    </div>

                    {/* Tombol Aksi Cadangkan & Pulihkan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Tombol Cadangkan */}
                      <button
                        onClick={handleExportBackup}
                        className="w-full py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        {copiedBackup ? <Check className="w-4 h-4 text-amber-300" /> : <Download className="w-4 h-4" />}
                        <span>{copiedBackup ? 'File Berhasil Diunduh!' : 'Cadangkan Data (.json)'}</span>
                      </button>

                      {/* Tombol Pulihkan */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Pulihkan Data</span>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Feedback Toast / Status Banner */}
                    {restoreFeedback && (
                      <div className={`p-3 rounded-2xl text-xs space-y-1 animate-fade-in border ${
                        restoreFeedback.type === 'success' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                          : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 font-bold">
                          {restoreFeedback.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                          <span>{restoreFeedback.message}</span>
                        </div>
                        {restoreFeedback.stats && (
                          <p className="text-[10.5px] opacity-90 pl-6">
                            Total terkini: {restoreFeedback.stats.amalanDays} hari amalan • {restoreFeedback.stats.hajatCount} hajat • {restoreFeedback.stats.sedekahCount} sedekah • {restoreFeedback.stats.tasbihDays} hari tasbih.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Pending Restore Confirmation Card */}
                    {pendingBackup && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/70 space-y-3 animate-fade-in text-stone-900 dark:text-stone-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                          <FileJson className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>File Cadangan Terdeteksi ({pendingBackup.fileName})</span>
                        </div>

                        <div className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
                          <div>Data yang ditemukan di dalam file:</div>
                          <ul className="grid grid-cols-2 gap-1 text-[10.5px] font-semibold text-stone-800 dark:text-stone-200 pl-1">
                            <li>📅 {pendingBackup.stats.amalanDays} Hari Amalan</li>
                            <li>🤲 {pendingBackup.stats.hajatCount} Doa Hajat</li>
                            <li>💰 {pendingBackup.stats.sedekahCount} Sedekah Subuh</li>
                            <li>📿 {pendingBackup.stats.tasbihDays} Hari Dzikir</li>
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60 flex flex-col gap-2">
                          <div className="text-[10.5px] font-medium text-stone-500">Pilih metode pemulihan:</div>
                          
                          <button
                            onClick={() => handleExecuteRestore('merge')}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Gabungkan Data (Disarankan)</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('PERINGATAN: Menggantikan seluruh data akan menimpa data yang saat ini ada di HP dengan data dari file cadangan. Lanjutkan?')) {
                                handleExecuteRestore('replace');
                              }
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-amber-200/80 dark:bg-amber-900/50 hover:bg-amber-300/80 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Gantikan Seluruh Data HP</span>
                          </button>

                          <button
                            onClick={() => setPendingBackup(null)}
                            className="w-full py-1.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-xs font-medium cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reset Button */}
                    <div className="pt-2 border-t border-stone-200/60 dark:border-emerald-900/40 space-y-1.5">
                      <button
                        onClick={() => {
                          if (confirm('Apakah kamu yakin ingin mengosongkan progres checklist kalender amalan? Seluruh centang amalan akan di-reset.')) {
                            resetAllData();
                            setIsDrawerOpen(false);
                          }
                        }}
                        className="w-full py-2 px-3 rounded-2xl bg-stone-100 dark:bg-emerald-900/40 hover:bg-stone-200 dark:hover:bg-emerald-900 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Centang Kalender Amalan</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Mulai perjalanan dari nol? Semua checklist, hajat, air minum, dan catatan di perangkat ini akan dikosongkan agar akun bersih.')) {
                            resetToFreshUser();
                            setIsDrawerOpen(false);
                            alert('Alhamdulillah, seluruh data akun telah dibersihkan ke kosongan awal.');
                          }
                        }}
                        className="w-full py-2 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200 dark:border-rose-900/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Mulai dari Nol (Reset Akun Bersih)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Akses Halaman & Rute Aplikasi */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Navigasi Halaman Langsung
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      href="/download"
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 hover:border-emerald-500 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Panduan Download & Pasang PWA</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/roadmap"
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 hover:border-emerald-500 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-amber-500" />
                        <span>Halaman Penuh Roadmap Lab</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/panel-admin"
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 hover:border-emerald-500 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Panel Admin & Lisensi Lynk.id</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* 4. Info Aplikasi */}
                <div className="p-4 rounded-3xl bg-emerald-950 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-xs text-amber-300">
                      Jalur Langit PWA
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-200">
                      v3.0.0 Stable
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Aplikasi web progresif (PWA) untuk mendukung perbaikan diri dan rutinitas ibadah harian. Dapat diinstal langsung ke layar utama HP kamu tanpa instalasi play store.
                  </p>
                </div>
              </>
            )}

          </div>

          {/* 3. DRAWER FOOTER */}
          <div className="p-4 border-t border-stone-200/80 dark:border-emerald-800/60 bg-stone-50/70 dark:bg-emerald-950/40 flex items-center justify-between gap-2">
            <div className="space-y-0.5 max-w-[200px]">
              <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate">
                {currentUser?.email || 'Jalur Langit PWA'}
              </div>
              <p className="text-[9px] text-stone-400">
                Self Improvement & Spiritual
              </p>
            </div>

            <button
              onClick={() => {
                if (onOpenLogoutModal) {
                  setIsDrawerOpen(false);
                  onOpenLogoutModal();
                } else {
                  logout();
                  setIsDrawerOpen(false);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-950/80 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 transition-all active:scale-95 shrink-0"
              title="Keluar dari akun aplikasi"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
