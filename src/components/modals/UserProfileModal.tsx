'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Pencil,
  Check,
  LogOut,
  Download,
  Upload,
  ShieldCheck,
  Crown,
  FileJson,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { TIER_CONFIG, UserTier } from '@/types/auth';
import { downloadBackupJson, parseBackupFile, ParsedBackupPreview } from '@/utils/backupUtils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onRequestLogout,
}) => {
  const { currentUser, updateUserProfile } = useAuthStore();
  const { exportBackupData, restoreBackupData } = useJalurLangitStore();

  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Backup & Restore states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<ParsedBackupPreview | null>(null);
  const [restoreFeedback, setRestoreFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setIsEditing(false);
      setProfileFeedback(null);
      setPendingBackup(null);
      setRestoreFeedback(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !mounted) return null;

  const userTier: UserTier = currentUser?.tier || 'starter';
  const tierName = TIER_CONFIG[userTier]?.name || currentUser?.tierLabel || 'Paket Aktif';
  const displayName = currentUser?.name?.trim() || 'Pengguna Jalur Langit';
  const displayEmail = currentUser?.email || '-';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);
    setIsSaving(true);

    const res = await updateUserProfile({
      name: editName,
      email: editEmail,
    });

    setIsSaving(false);

    if (res.success) {
      setIsEditing(false);
      setProfileFeedback({ type: 'success', message: res.message });
      setTimeout(() => setProfileFeedback(null), 3500);
    } else {
      setProfileFeedback({ type: 'error', message: res.message });
    }
  };

  const handleExportBackup = () => {
    try {
      downloadBackupJson(exportBackupData());
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 3500);
    } catch (err) {
      console.error('Gagal mengekspor data cadangan:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFeedback(null);

    try {
      const preview = await parseBackupFile(file);
      setPendingBackup(preview);
    } catch (err) {
      setRestoreFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal memproses file cadangan.',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExecuteRestore = (mode: 'merge' | 'replace') => {
    if (!pendingBackup) return;

    const res = restoreBackupData(pendingBackup.data, mode);
    if (res.success) {
      setPendingBackup(null);
      setRestoreFeedback({ type: 'success', message: res.message });
      setTimeout(() => setRestoreFeedback(null), 4000);
    } else {
      setRestoreFeedback({ type: 'error', message: res.message });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-4 flex items-center justify-center animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md my-auto bg-white dark:bg-[#0c1813] rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800/80 text-stone-900 dark:text-stone-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between bg-white/95 dark:bg-[#0c1813]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-amber-300 font-black text-lg flex items-center justify-center shadow-md shrink-0">
              {avatarInitial}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                Profil Akun Saya
              </h3>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200/80 dark:border-amber-800/60 mt-0.5">
                <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{tierName}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            title="Tutup Profil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. IDENTITAS PROFIL (NAMA, EMAIL, EDIT) */}
          <div className="p-4 rounded-2xl bg-stone-50/90 dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 space-y-3">
            {!isEditing ? (
              <>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Nama Lengkap
                      </span>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {displayName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Email Terdaftar
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {profileFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      profileFeedback.type === 'success'
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{profileFeedback.message}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setEditName(currentUser?.name || '');
                    setEditEmail(currentUser?.email || '');
                    setProfileFeedback(null);
                    setIsEditing(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-stone-200 dark:border-emerald-700/70 shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Edit Profil</span>
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Akun
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Email terhubung langsung dengan lisensi pembelian Lynk.id Anda.
                  </span>
                </div>

                {profileFeedback && profileFeedback.type === 'error' && (
                  <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{profileFeedback.message}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setIsEditing(false);
                      setProfileFeedback(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-stone-200/80 dark:bg-emerald-900/40 hover:bg-stone-300/80 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. BACKUP & PULIHKAN DATA */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  Backup & Cadangkan Data
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed mt-0.5">
                  Amankan progres amalan, doa hajat, tasbih, dan tilawah Anda dalam file cadangan agar aman saat berganti HP.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {copiedBackup ? (
                  <>
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>File Cadangan Berhasil Diunduh!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Cadangkan Data (.json)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-emerald-900/40 hover:bg-stone-100 dark:hover:bg-emerald-900/70 text-stone-700 dark:text-stone-200 text-xs font-bold border border-stone-200 dark:border-emerald-800 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pulihkan Data dari File (.json)</span>
              </button>
            </div>

            {restoreFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  restoreFeedback.type === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200'
                }`}
              >
                {restoreFeedback.type === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{restoreFeedback.message}</span>
              </div>
            )}

            {pendingBackup && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/70 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <FileJson className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{pendingBackup.fileName}</span>
                </div>
                <ul className="grid grid-cols-2 gap-1 text-[10.5px] font-semibold text-stone-700 dark:text-stone-200">
                  <li>📅 {pendingBackup.stats.amalanDays} Hari Amalan</li>
                  <li>🤲 {pendingBackup.stats.hajatCount} Doa Hajat</li>
                  <li>💰 {pendingBackup.stats.sedekahCount} Sedekah</li>
                  <li>📿 {pendingBackup.stats.tasbihDays} Hari Dzikir</li>
                </ul>
                <div className="flex flex-col gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExecuteRestore('merge')}
                    className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Gabungkan dengan Data Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteRestore('replace')}
                    className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Ganti Total dengan Data Cadangan
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingBackup(null)}
                    className="w-full py-1 text-stone-500 text-[11px] font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. TOMBOL KELUAR AKUN */}
          <button
            type="button"
            onClick={onRequestLogout}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
