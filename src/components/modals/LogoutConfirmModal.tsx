'use client';

import React, { useEffect } from 'react';
import { LogOut, X, ShieldCheck, Sparkles } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/70 dark:bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Cool Centered Modal Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#0c1813] border border-stone-200 dark:border-emerald-800/80 p-6 shadow-2xl text-stone-900 dark:text-stone-100 space-y-5 transform transition-all duration-300 scale-100 z-10">
        
        {/* Close Corner Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-emerald-900/40 transition-colors"
          title="Batal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glowing Logout Icon Badge */}
        <div className="flex flex-col items-center text-center space-y-3 pt-1">
          <div className="relative flex items-center justify-center">
            {/* Ambient soft glow ring */}
            <div className="absolute w-16 h-16 rounded-full bg-rose-500/20 dark:bg-rose-500/15 animate-ping pointer-events-none" />
            
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 border-2 border-white dark:border-[#0c1813]">
              <LogOut className="w-7 h-7" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100">
              Keluar dari Aplikasi?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-[270px] mx-auto">
              Kamu akan kembali ke gerbang login Lynk.id. Catatan impian, dzikir, dan amalanmu tetap aman tersimpan di perangkat ini.
            </p>
          </div>
        </div>

        {/* User Account Info Chip */}
        {userEmail && (
          <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-stone-700 dark:text-stone-300 font-medium truncate text-[11px]">
                {userEmail}
              </span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-emerald-900/80 text-stone-600 dark:text-emerald-300 shrink-0">
              Aktif
            </span>
          </div>
        )}

        {/* 2 Mobile Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all active:scale-95"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
