'use client';

import React, { useState } from 'react';
import { 
  Home, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  BookOpen, 
  Moon,
  Sun,
  Flame,
  RotateCcw,
  Droplets,
  Image as ImageIcon,
  Compass,
  LogOut
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatShortDateIndonesian } from '@/utils/dateUtils';
import { AppDrawerMenu } from '@/components/modals/AppDrawerMenu';
import { LogoutConfirmModal } from '@/components/modals/LogoutConfirmModal';

export type ActiveTab = 'home' | 'amalan' | 'tasbih' | 'glowup' | 'vision' | 'hajat' | 'quran';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { selectedDate, resetAllData, appTheme, toggleTheme, toggleDrawer } = useJalurLangitStore();
  const { logout, currentUser } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleReset = () => {
    if (confirm('Mulai ulang data amalan kalender? (Data impian & sedekah tetap aman)')) {
      resetAllData();
    }
  };

  return (
    <>
      {/* Top App Header */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-emerald-950/85 backdrop-blur-md border-b border-stone-200/80 dark:border-emerald-800/60 px-4 sm:px-6 py-3 transition-colors shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md transition-all bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300 shadow-emerald-900/20">
              <Moon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-serif text-base tracking-tight text-stone-900 dark:text-stone-100">
                  Jalur Langit
                </span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  Self Improvement Edition
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Spiritual, Self-Growth & Manifesting Journal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Lab & Roadmap Drawer Menu Button (Opsi 1) */}
            <button
              onClick={toggleDrawer}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 shadow-xs"
              title="Menu Ekosistem & Roadmap Fitur Lab (Coming Soon)"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span className="hidden sm:inline">Menu & Lab 🚀</span>
              <span className="sm:hidden">Lab 🚀</span>
            </button>

            {/* Theme Switcher Button (Terang / Gelap) */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                appTheme === 'dark'
                  ? 'bg-emerald-950/80 border-emerald-800 text-amber-300 hover:bg-emerald-900 shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-xs'
              }`}
              title="Ganti Tema (Terang / Gelap)"
            >
              {appTheme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline">Tema Gelap 🌙</span>
                  <span className="sm:hidden">Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="hidden sm:inline">Tema Terang ☀️</span>
                  <span className="sm:hidden">Terang</span>
                </>
              )}
            </button>

            {/* Date Badge */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{formatShortDateIndonesian(selectedDate)}</span>
            </div>

            <button
              onClick={handleReset}
              title="Reset Tantangan 30 Hari"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Logout Button (Opens Cool Mobile Modal) */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Keluar / Logout Akun"
              className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Drawer Menu Component */}
      <AppDrawerMenu onOpenLogoutModal={() => setIsLogoutModalOpen(true)} />

      {/* Cool Centered Mobile Logout Confirmation Popup */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
        userEmail={currentUser?.email}
      />

      {/* Bottom Floating Navigation Bar (Mobile & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-emerald-800/60 py-2 px-2 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'home'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Beranda</span>
          </button>

          <button
            onClick={() => onTabChange('amalan')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'amalan'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Amalan</span>
          </button>

          <button
            onClick={() => onTabChange('glowup')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'glowup'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Glow Up</span>
          </button>

          {/* Center Tasbih */}
          <button
            onClick={() => onTabChange('tasbih')}
            className="flex flex-col items-center py-1 px-2 transition-all relative"
          >
            <div className="w-9 h-9 -mt-4 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-emerald-950 bg-gradient-to-tr from-emerald-800 to-teal-700 shadow-emerald-900/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold text-stone-700 dark:text-stone-300">Tasbih</span>
          </button>

          <button
            onClick={() => onTabChange('vision')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'vision'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Vision</span>
          </button>

          <button
            onClick={() => onTabChange('hajat')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'hajat'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Hajat</span>
          </button>

          <button
            onClick={() => onTabChange('quran')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'quran'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Quran</span>
          </button>
        </div>
      </nav>
    </>
  );
};
