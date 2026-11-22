'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  BookOpen, 
  Moon,
  Sun,
  RotateCcw,
  Droplets,
  Image as ImageIcon,
  Compass,
  LogOut
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AppDrawerMenu } from '@/components/modals/AppDrawerMenu';
import { LogoutConfirmModal } from '@/components/modals/LogoutConfirmModal';
import { AlarmNotificationModal } from '@/components/modals/AlarmNotificationModal';

export type ActiveTab = 'home' | 'amalan' | 'tasbih' | 'glowup' | 'vision' | 'hajat' | 'quran';

interface NavigationProps {
  activeTab?: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { resetAllData, appTheme, toggleTheme, toggleDrawer, isAlarmModalOpen, setIsAlarmModalOpen } = useJalurLangitStore();
  const { logout, currentUser } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Deteksi tab aktif berdasarkan URL pathname atau fallback ke activeTab prop
  const currentTab: ActiveTab = 
    pathname === '/amalan' ? 'amalan' :
    pathname === '/glowup' ? 'glowup' :
    pathname === '/tasbih' ? 'tasbih' :
    pathname === '/vision' ? 'vision' :
    pathname === '/hajat' ? 'hajat' :
    pathname === '/quran' ? 'quran' :
    pathname === '/dashboard' ? 'home' : (activeTab || 'home');

  const handleNavigate = (tab: ActiveTab) => {
    if (onTabChange) onTabChange(tab);
    const targetRoute = tab === 'home' ? '/dashboard' : `/${tab}`;
    router.push(targetRoute);
  };

  const handleReset = () => {
    if (confirm('Mulai ulang data amalan kalender? (Data impian & sedekah tetap aman)')) {
      resetAllData();
    }
  };

  return (
    <>
      {/* Top App Header (Responsive & Compact Mobile-First) */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-emerald-800/60 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Identity: Logo + Title + Subtitle Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-all bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold font-serif text-sm sm:text-base tracking-tight text-stone-900 dark:text-stone-100 leading-tight truncate">
                Jalur Langit
              </span>
              <span className="text-[8px] sm:text-[9.5px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 w-fit leading-tight mt-0.5">
                Self Improvement Edition
              </span>
            </div>
          </div>

          {/* Quick Action Controls (Compact Icons on Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Lab & Roadmap Drawer Menu Button */}
            <button
              onClick={toggleDrawer}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs"
              title="Menu Ekosistem & Roadmap Fitur Lab"
              aria-label="Menu Ekosistem & Lab"
            >
              <Compass className="w-4 h-4 text-amber-500 animate-spin-slow shrink-0" />
              <span className="hidden sm:inline text-xs font-bold">Lab 🚀</span>
            </button>

            {/* Theme Switcher Button (Icon Only on Mobile, Clean Switcher) */}
            <button
              onClick={toggleTheme}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs ${
                appTheme === 'dark'
                  ? 'bg-emerald-950/70 border-emerald-800/80 text-amber-300 hover:bg-emerald-900/60'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={appTheme === 'dark' ? 'Ganti ke Mode Terang (Siang)' : 'Ganti ke Mode Gelap (Malam)'}
              aria-label="Ganti Tema"
            >
              {appTheme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="hidden md:inline text-xs font-bold">Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="hidden md:inline text-xs font-bold">Terang</span>
                </>
              )}
            </button>

            {/* Reset Challenge (Desktop Only to prevent accidental taps on mobile) */}
            <button
              onClick={handleReset}
              title="Reset Tantangan 30 Hari"
              aria-label="Reset Tantangan"
              className="hidden md:flex p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
            </button>

            {/* Logout Button (Opens Confirmation Modal) */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Keluar / Logout Akun"
              aria-label="Keluar / Logout Akun"
              className="p-2 rounded-xl text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all active:scale-95 flex items-center justify-center shadow-2xs"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Drawer Menu Component */}
      <AppDrawerMenu onOpenLogoutModal={() => setIsLogoutModalOpen(true)} />

      {/* GPS Prayer Times & Notification Modal */}
      <AlarmNotificationModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
      />

      {/* Cool Centered Mobile Logout Confirmation Popup */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
          router.push('/login');
        }}
        userEmail={currentUser?.email}
      />

      {/* Bottom Floating Navigation Bar (Mobile & Desktop - Instant Prefetched Links) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-emerald-800/60 py-2 px-2 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('home')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'home'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Beranda</span>
          </Link>

          <Link
            href="/amalan"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('amalan')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'amalan'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Amalan</span>
          </Link>

          <Link
            href="/glowup"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('glowup')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'glowup'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Self-Care</span>
          </Link>

          {/* Center Tasbih */}
          <Link
            href="/tasbih"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('tasbih')}
            className="touch-manipulation select-none flex flex-col items-center py-1 px-2 transition-transform relative"
          >
            <div className={`w-9 h-9 -mt-4 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-emerald-950 transition-all ${
              currentTab === 'tasbih'
                ? 'bg-gradient-to-tr from-amber-500 to-amber-600 scale-110 shadow-amber-900/40'
                : 'bg-gradient-to-tr from-emerald-800 to-teal-700 shadow-emerald-900/30'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <span className={`text-[10px] mt-0.5 font-bold ${
              currentTab === 'tasbih' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-700 dark:text-stone-300'
            }`}>
              Tasbih
            </span>
          </Link>

          <Link
            href="/vision"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('vision')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'vision'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Vision</span>
          </Link>

          <Link
            href="/hajat"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('hajat')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'hajat'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Hajat</span>
          </Link>

          <Link
            href="/quran"
            prefetch={true}
            onClick={() => onTabChange && onTabChange('quran')}
            className={`touch-manipulation select-none flex flex-col items-center py-1 px-2 rounded-2xl transition-transform ${
              currentTab === 'quran'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Quran</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
