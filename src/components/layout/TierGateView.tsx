'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck,
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { TIER_CONFIG, UserTier } from '@/types/auth';

interface TierGateViewProps {
  requiredTier: UserTier;
  featureTitle: string;
  featureDescription: string;
}

export const TierGateView: React.FC<TierGateViewProps> = ({
  requiredTier,
  featureTitle,
  featureDescription
}) => {
  const { currentUser, loginWithEmail } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const currentTier = currentUser?.tier || 'starter';
  const targetConfig = TIER_CONFIG[requiredTier];

  const handleRefreshAccess = async () => {
    if (!currentUser?.email) return;
    setIsRefreshing(true);
    setRefreshMessage(null);

    try {
      const success = await loginWithEmail(currentUser.email);
      if (success) {
        setRefreshMessage('Akses berhasil diperbarui! Memuat ulang fitur...');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setRefreshMessage('Pembayaran belum terdeteksi. Silakan selesaikan pembayaran di Lynk.id terlebih dahulu.');
      }
    } catch {
      setRefreshMessage('Gagal menghubungi server verifikasi. Coba beberapa saat lagi.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 max-w-lg mx-auto text-center space-y-6 animate-fade-in select-none">
      
      {/* Icon Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/10 to-purple-500/20 dark:from-amber-400/10 dark:to-purple-900/20 border-2 border-amber-300 dark:border-amber-500/40 flex items-center justify-center shadow-xl">
          {requiredTier === 'vip' ? (
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-pulse" />
          ) : (
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-pulse" />
          )}
        </div>
        <div className="absolute -top-2 -right-2 p-1.5 rounded-xl bg-purple-600 text-white shadow-md">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-[10px] sm:text-xs font-black uppercase tracking-wider">
          <span>Tersedia di {targetConfig.name}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 dark:text-stone-100 tracking-tight">
          Buka Akses {featureTitle}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-md mx-auto">
          {featureDescription}
        </p>
      </div>

      {/* User Status Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs text-left space-y-2.5">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 dark:border-emerald-900/60">
          <span className="text-stone-500">Email Akun:</span>
          <span className="font-bold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
            {currentUser?.email || '-'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-500">Paket Saat Ini:</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-stone-100 dark:bg-emerald-900/60 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-emerald-700/60">
            {TIER_CONFIG[currentTier]?.name || 'Paket Starter'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <a
          href={`${targetConfig.lynkUrl || 'https://lynk.id/jalurlangitapp'}${currentUser?.email ? `?email=${encodeURIComponent(currentUser.email)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Upgrade ke {targetConfig.name} ({targetConfig.price})</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>

        {/* Real-time re-verify button */}
        <button
          type="button"
          onClick={handleRefreshAccess}
          disabled={isRefreshing}
          className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 dark:bg-emerald-950/60 hover:bg-stone-200 dark:hover:bg-emerald-900/60 text-stone-700 dark:text-stone-200 font-bold text-xs border border-stone-300 dark:border-emerald-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          <span>{isRefreshing ? 'Memverifikasi Pembayaran...' : 'Sudah Bayar? Cek Status Lisensi'}</span>
        </button>

        {refreshMessage && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 animate-fade-in">
            {refreshMessage}
          </p>
        )}
      </div>

      {/* Informative Security Notice */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 text-left space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300">
        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Garansi Data Aman &amp; Otomatis</span>
        </div>
        <p className="leading-relaxed">
          Saat checkout upgrade di Lynk.id, <b>gunakan email yang sama</b> ({currentUser?.email}). Sistem webhook akan langsung menaikkan paket lisensimu tanpa menghilangkan data amalan, target ibadah, atau catatan yang sudah tersimpan.
        </p>
      </div>

      {/* Back to Home Link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

    </div>
  );
};
