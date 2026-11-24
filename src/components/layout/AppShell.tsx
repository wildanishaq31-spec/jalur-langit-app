'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { LoginTransitionLoader } from '@/components/auth/LoginTransitionLoader';
import { PwaNotificationManager } from '@/components/pwa/PwaNotificationManager';
import { TierGateView } from '@/components/layout/TierGateView';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { TIER_CONFIG, UserTier } from '@/types/auth';
import { getTodayDateString } from '@/utils/dateUtils';

interface AppShellProps {
  children: React.ReactNode;
}

// Variabel memori level-modul untuk menandai bahwa aplikasi sudah terhidrasi di sesi browser
let isAppHydrated = false;

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { appTheme, syncToTodayIfOutdated } = useJalurLangitStore();
  const { 
    isAuthenticated, 
    isTransitioning, 
    completeTransition, 
    touchUserActivity, 
    currentUser, 
    syncLicenseWithServer 
  } = useAuthStore();
  
  // Jika sudah terhidrasi di sesi klien, langsung mounted = true tanpa flash blank screen
  const [mounted, setMounted] = useState(() => isAppHydrated);
  const [upgradeToast, setUpgradeToast] = useState<string | null>(null);

  // 1. Sinkronisasi lisensi otomatis saat AppShell pertama kali dibuka / dimuat
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      syncLicenseWithServer().then((res) => {
        if (res.upgraded && res.newTier) {
          setUpgradeToast(
            `Alhamdulillah! Akun Anda berhasil di-upgrade ke ${TIER_CONFIG[res.newTier].name}. Seluruh fitur eksklusif telah terbuka.`
          );
        }
      });
    }
  }, [isAuthenticated, currentUser?.email, syncLicenseWithServer]);

  // 2. Deteksi otomatis saat pembeli kembali dari checkout upgrade / pembayaran Lynk.id (?upgrade=success / ?status=paid / ?payment=success / ?refId=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const upgradeParam = params.get('upgrade');
    const statusParam = params.get('status');
    const paymentParam = params.get('payment');
    const refIdParam = params.get('refId');

    const isPaymentReturn = Boolean(upgradeParam || statusParam === 'paid' || paymentParam === 'success' || refIdParam);

    if (isPaymentReturn) {
      if (currentUser?.email) {
        syncLicenseWithServer().then((res) => {
          const tierName = res.newTier ? TIER_CONFIG[res.newTier].name : 'Paket Baru';
          setUpgradeToast(`Alhamdulillah! Pembayaran berhasil diverifikasi. Akun Anda aktif pada ${tierName}. Seluruh fitur eksklusif telah terbuka.`);
        });
      }
      try {
        window.history.replaceState({}, '', pathname);
      } catch {}
    }
  }, [pathname, currentUser?.email, syncLicenseWithServer]);

  useEffect(() => {
    isAppHydrated = true;
    setMounted(true);
    if (isAuthenticated) {
      touchUserActivity();
    }
  }, [isAuthenticated, touchUserActivity]);

  // Auto-update tanggal mengikuti tanggal hari ini secara otomatis
  useEffect(() => {
    // 1. Sinkronisasi instan saat aplikasi pertama kali dimuat / dibuka
    syncToTodayIfOutdated();

    let lastKnownDate = getTodayDateString();

    // 2. Deteksi saat pengguna membuka/kembali ke tab PWA (layar HP aktif / tab focus)
    const handleVisibilityOrFocus = () => {
      const currentRealDate = getTodayDateString();
      if (currentRealDate !== lastKnownDate) {
        lastKnownDate = currentRealDate;
        syncToTodayIfOutdated();
      } else if (document.visibilityState === 'visible') {
        syncToTodayIfOutdated();
        if (isAuthenticated && currentUser?.email) {
          syncLicenseWithServer().then((res) => {
            if (res.upgraded && res.newTier) {
              setUpgradeToast(
                `Alhamdulillah! Akun Anda berhasil di-upgrade ke ${TIER_CONFIG[res.newTier].name}. Seluruh fitur eksklusif telah terbuka.`
              );
            }
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // 3. Interval pengecekan pergantian tanggal (misal berganti hari saat jam 00:00 tengah malam)
    const midnightCheckTimer = setInterval(() => {
      const currentRealDate = getTodayDateString();
      if (currentRealDate !== lastKnownDate) {
        lastKnownDate = currentRealDate;
        syncToTodayIfOutdated();
      }
    }, 10000); // Periksa setiap 10 detik

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(midnightCheckTimer);
    };
  }, [syncToTodayIfOutdated]);

  // Prefetch semua rute navigasi aplikasi agar perpindahan halaman 0 delay
  useEffect(() => {
    const routes = ['/dashboard', '/amalan', '/glowup', '/tasbih', '/vision', '/hajat', '/quran'];
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {}
    });
  }, [router]);

  useEffect(() => {
    if (appTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme]);

  useEffect(() => {
    if (mounted && !isAuthenticated && !isTransitioning) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, isTransitioning, router]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a1410]" />;
  }

  // Tampilkan animasi transisi loader jika sedang transitioning
  if (isTransitioning) {
    return <LoginTransitionLoader onComplete={completeTransition} />;
  }

  // Jika belum login, tampilkan fallback loading sementara router mengarahkan ke /login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] dark:bg-[#0a1410] text-stone-500 text-xs">
        Memeriksa hak akses...
      </div>
    );
  }

  // Deteksi perlindungan hak akses (Tier Gating)
  const currentTab = 
    pathname === '/dashboard' ? 'home' :
    pathname === '/amalan' ? 'amalan' :
    pathname === '/tasbih' ? 'tasbih' :
    pathname === '/glowup' ? 'glowup' :
    pathname === '/vision' ? 'vision' :
    pathname === '/hajat' ? 'hajat' :
    pathname === '/quran' ? 'quran' : null;

  const userTier: UserTier = currentUser?.tier || 'vip';
  const accessibleTabs = TIER_CONFIG[userTier]?.accessibleTabs || [
    'home', 'amalan', 'tasbih', 'glowup', 'vision', 'hajat', 'quran'
  ];

  const isTabLocked = currentTab !== null && !accessibleTabs.includes(currentTab);

  // Tentukan tier dan informasi yang dibutuhkan jika tab terkunci
  const gateInfo = {
    requiredTier: (currentTab === 'glowup' ? 'vip' : 'ultimate') as UserTier,
    featureTitle: 
      currentTab === 'glowup' ? 'Self-Care & Glow Up Habits' :
      currentTab === 'vision' ? 'Vision Board & Impian' :
      currentTab === 'hajat' ? 'Papan Hajat & Sedekah Subuh' :
      currentTab === 'quran' ? 'Al-Qur\'an Journaling & Tadabbur' : 'Fitur Eksklusif',
    featureDescription:
      currentTab === 'glowup' 
        ? 'Rutinitas perawatan diri islami, hidrasi harian, skincare sunnah, dan jurnal refleksi diri untuk muslimah istiqomah.'
        : currentTab === 'vision'
        ? 'Papan visualisasi impian, target ibadah jangka panjang, dan doa mustajab untuk masa depan yang berkah.'
        : currentTab === 'hajat'
        ? 'Manajemen doa spesifik, afirmasi langit, dan pencatatan kebiasaan sedekah subuh berlimpah kebaikan.'
        : 'Khatam Qur\'an planner harian, catatan mutaba\'ah tilawah, dan ruang tadabbur ayat suci Al-Qur\'an.'
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3]">
      <PwaNotificationManager />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-24">
        {upgradeToast && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-900 shadow-lg flex items-center justify-between gap-3 animate-fade-in border border-amber-600/30">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-stone-900 shrink-0 animate-pulse" />
              <div className="space-y-0.5">
                <span className="font-black text-[10px] uppercase tracking-wider block text-stone-800">
                  🎉 Upgrade Paket Berhasil!
                </span>
                <span className="text-xs sm:text-sm font-bold">{upgradeToast}</span>
              </div>
            </div>
            <button
              onClick={() => setUpgradeToast(null)}
              className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-stone-900 font-black cursor-pointer text-xs"
              title="Tutup Notifikasi"
            >
              ✕
            </button>
          </div>
        )}

        {isTabLocked ? (
          <TierGateView
            requiredTier={gateInfo.requiredTier}
            featureTitle={gateInfo.featureTitle}
            featureDescription={gateInfo.featureDescription}
          />
        ) : (
          children
        )}
      </main>
    </div>
  );
};
