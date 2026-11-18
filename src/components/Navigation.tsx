'use client';

import React from 'react';
import { 
  Home, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  BookOpen, 
  Moon,
  Flame,
  RotateCcw,
  Palette,
  Droplets,
  Image as ImageIcon
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { formatShortDateIndonesian } from '@/utils/dateUtils';

export type ActiveTab = 'home' | 'amalan' | 'tasbih' | 'glowup' | 'vision' | 'hajat' | 'quran';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { selectedDate, resetAllData, appTheme, setAppTheme } = useJalurLangitStore();

  const handleReset = () => {
    if (confirm('Mulai ulang data amalan kalender? (Data impian & sedekah tetap aman)')) {
      resetAllData();
    }
  };

  const toggleTheme = () => {
    setAppTheme(appTheme === 'blush' ? 'emerald' : 'blush');
  };

  return (
    <>
      {/* Top App Header */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-emerald-950/85 backdrop-blur-md border-b border-stone-200/80 dark:border-emerald-800/60 px-4 sm:px-6 py-3 transition-colors shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md transition-all ${
              appTheme === 'blush'
                ? 'bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-rose-500/20'
                : 'bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300 shadow-emerald-900/20'
            }`}>
              <Moon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-serif text-base tracking-tight text-stone-900 dark:text-stone-100">
                  Jalur Langit
                </span>
                <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md ${
                  appTheme === 'blush'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  Self Improvement Edition
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Spiritual, Self-Growth & Manifesting Journal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                appTheme === 'blush'
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Ganti Tema Warna (Blush / Emerald)"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{appTheme === 'blush' ? 'Tema Blush 🌸' : 'Tema Emerald 🌿'}</span>
            </button>

            {/* Date Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{formatShortDateIndonesian(selectedDate)}</span>
            </div>

            <button
              onClick={handleReset}
              title="Reset Tantangan 30 Hari"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navigation Bar (Mobile & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-emerald-800/60 py-2 px-2 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'home'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Beranda</span>
          </button>

          <button
            onClick={() => onTabChange('amalan')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'amalan'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Amalan</span>
          </button>

          <button
            onClick={() => onTabChange('glowup')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'glowup'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
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
            <div className={`w-9 h-9 -mt-4 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-emerald-950 ${
              appTheme === 'blush'
                ? 'bg-gradient-to-tr from-rose-500 to-amber-400 shadow-rose-500/30'
                : 'bg-gradient-to-tr from-emerald-800 to-teal-700 shadow-emerald-900/30'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold text-stone-700 dark:text-stone-300">Tasbih</span>
          </button>

          <button
            onClick={() => onTabChange('vision')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'vision'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Vision</span>
          </button>

          <button
            onClick={() => onTabChange('hajat')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'hajat'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px]">Hajat</span>
          </button>

          <button
            onClick={() => onTabChange('quran')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all ${
              activeTab === 'quran'
                ? appTheme === 'blush' ? 'text-rose-600 font-bold scale-105' : 'text-emerald-700 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600'
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
