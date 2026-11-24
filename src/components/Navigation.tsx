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
import { TIER_CONFIG, UserTier } from '@/types/auth';
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

  // Deteksi hak akses tab berdasarkan tier lisensi pengguna
  const userTier: UserTier = currentUser?.tier || 'vip';
  const accessibleTabs = TIER_CONFIG[userTier]?.accessibleTabs || [
    'home', 'amalan', 'tasbih', 'glowup', 'vision', 'hajat', 'quran'
  ];

  const isGlowUpLocked = !accessibleTabs.includes('glowup');
  const isVisionLocked = !accessibleTabs.includes('vision');
  const isHajatLocked = !accessibleTabs.includes('hajat');
  const isQuranLocked = !accessibleTabs.includes('quran');

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

      {/* Bottom Floating Navigation Bar (Center FAB Action Focused, Bold & Creative) */}
      <nav className="fixed bottom-2 left-2 right-2 sm:bottom-3 z-40 pointer-events-none">
        <div className="pointer-events-auto max-w-xl mx-auto relative">
          {/* Background Dock dengan Lekukan Cekung Tengah (Curved Notch) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-stretch drop-shadow-[0_8px_24px_rgba(6,78,59,0.12)] dark:drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            <div className="flex-1 h-16 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg rounded-l-3xl border-y border-l border-stone-200/80 dark:border-emerald-800/60" />
            <svg
              viewBox="0 0 88 64"
              preserveAspectRatio="none"
              className="w-[88px] h-16 shrink-0 -mx-[0.5px]"
            >
              <path
                d="M 0 0 C 16 0, 20 28, 44 28 C 68 28, 72 0, 88 0 L 88 64 L 0 64 Z"
                className="fill-white/95 dark:fill-emerald-950/95"
              />
              <path
                d="M 0 0.5 C 16 0.5, 20 28, 44 28 C 68 28, 72 0.5, 88 0.5"
                fill="none"
                strokeWidth="1"
                className="stroke-stone-200/80 dark:stroke-emerald-800/60"
              />
              <line
                x1="0"
                y1="63.5"
                x2="88"
                y2="63.5"
                strokeWidth="1"
                className="stroke-stone-200/80 dark:stroke-emerald-800/60"
              />
            </svg>
            <div className="flex-1 h-16 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg rounded-r-3xl border-y border-r border-stone-200/80 dark:border-emerald-800/60" />
          </div>

          {/* 7 Kolom Seimbang (Tasbih Tepat di Tengah Kolom ke-4) */}
          <div className="relative z-10 grid grid-cols-7 items-end h-16 px-1">
            {[
              { id: 'home' as ActiveTab, href: '/dashboard', label: 'Beranda', icon: Home, badge: null },
              { id: 'amalan' as ActiveTab, href: '/amalan', label: 'Amalan', icon: CheckCircle2, badge: null },
              { id: 'glowup' as ActiveTab, href: '/glowup', label: 'Self-Care', icon: Droplets, badge: isGlowUpLocked ? 'crown' : null },
              { id: 'tasbih' as ActiveTab, href: '/tasbih', label: 'Tasbih', icon: Sparkles, badge: null },
              { id: 'vision' as ActiveTab, href: '/vision', label: 'Vision', icon: ImageIcon, badge: isVisionLocked ? 'lock' : null },
              { id: 'hajat' as ActiveTab, href: '/hajat', label: 'Hajat', icon: HeartHandshake, badge: isHajatLocked ? 'lock' : null },
              { id: 'quran' as ActiveTab, href: '/quran', label: 'Quran', icon: BookOpen, badge: isQuranLocked ? 'lock' : null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (item.id === 'tasbih') {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch={true}
                    onClick={() => onTabChange && onTabChange('tasbih')}
                    className="group touch-manipulation select-none flex flex-col items-center justify-end pb-1.5 h-full relative"
                  >
                    <div
                      className={`w-12 h-12 -mt-7 rounded-full flex items-center justify-center text-white border-[3px] border-[#fbf9f5] dark:border-[#0a1410] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-110 group-active:scale-95 ${
                        isActive
                          ? 'bg-gradient-to-tr from-amber-500 via-amber-500 to-yellow-400 scale-110 -translate-y-1 shadow-xl shadow-amber-500/40 ring-4 ring-amber-400/25'
                          : 'bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 shadow-lg shadow-emerald-900/35 group-hover:shadow-xl group-hover:shadow-emerald-700/40'
                      }`}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.3} />
                    </div>
                    <span
                      className={`text-[10px] mt-1 leading-tight tracking-tight transition-colors duration-200 ${
                        isActive
                          ? 'text-amber-600 dark:text-amber-400 font-black'
                          : 'text-emerald-800 dark:text-emerald-300 font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className="group touch-manipulation select-none flex flex-col items-center justify-end pb-1.5 h-full relative"
                >
                  <div
                    className={`relative flex items-center justify-center w-9 h-8 rounded-2xl transition-all duration-300 ease-out ${
                      isActive
                        ? 'bg-emerald-700 dark:bg-emerald-500 text-white -translate-y-1.5 scale-110 shadow-md shadow-emerald-700/30 ring-2 ring-emerald-100 dark:ring-emerald-900/70'
                        : 'text-stone-400 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/60 group-hover:-translate-y-1 group-hover:scale-110 group-active:scale-95'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] transition-transform duration-300" strokeWidth={isActive ? 2.4 : 1.9} />
                    {item.badge === 'crown' && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none select-none" title="Eksklusif Paket VIP">
                        👑
                      </span>
                    )}
                    {item.badge === 'lock' && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] leading-none select-none" title="Terkunci (Perlu Upgrade)">
                        🔒
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 leading-tight tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'text-emerald-800 dark:text-emerald-300 font-extrabold'
                        : 'text-stone-500 dark:text-stone-400 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:font-semibold'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
