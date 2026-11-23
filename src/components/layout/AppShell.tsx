'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { LoginTransitionLoader } from '@/components/auth/LoginTransitionLoader';
import { PwaNotificationManager } from '@/components/pwa/PwaNotificationManager';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getTodayDateString } from '@/utils/dateUtils';

interface AppShellProps {
  children: React.ReactNode;
}

// Variabel memori level-modul untuk menandai bahwa aplikasi sudah terhidrasi di sesi browser
let isAppHydrated = false;

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const { appTheme, syncToTodayIfOutdated } = useJalurLangitStore();
  const { isAuthenticated, isTransitioning, completeTransition, touchUserActivity } = useAuthStore();
  
  // Jika sudah terhidrasi di sesi klien, langsung mounted = true tanpa flash blank screen
  const [mounted, setMounted] = useState(() => isAppHydrated);

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

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3]">
      <PwaNotificationManager />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-24">
        {children}
      </main>
    </div>
  );
};
