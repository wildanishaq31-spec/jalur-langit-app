'use client';

import React, { useState, useEffect } from 'react';
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
  User
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { useAuthStore } from '@/store/useAuthStore';
import { TIER_CONFIG, UserTier } from '@/types/auth';
import { AppDrawerMenu } from '@/components/modals/AppDrawerMenu';
import { LogoutConfirmModal } from '@/components/modals/LogoutConfirmModal';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<ActiveTab | null>(null);
  const [hoveredTab, setHoveredTab] = useState<ActiveTab | null>(null);

  useEffect(() => {
    setPendingTab(null);
  }, [pathname]);

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

  const navItems: Array<{
    id: ActiveTab;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    badge: 'crown' | 'lock' | null;
  }> = [
    { id: 'home', href: '/dashboard', label: 'Beranda', icon: Home, badge: null },
    { id: 'amalan', href: '/amalan', label: 'Amalan', icon: CheckCircle2, badge: null },
    { id: 'glowup', href: '/glowup', label: 'Self-Care', icon: Droplets, badge: isGlowUpLocked ? 'crown' : null },
    { id: 'tasbih', href: '/tasbih', label: 'Tasbih', icon: Sparkles, badge: null },
    { id: 'vision', href: '/vision', label: 'Vision', icon: ImageIcon, badge: isVisionLocked ? 'lock' : null },
    { id: 'hajat', href: '/hajat', label: 'Hajat', icon: HeartHandshake, badge: isHajatLocked ? 'lock' : null },
    { id: 'quran', href: '/quran', label: 'Quran', icon: BookOpen, badge: isQuranLocked ? 'lock' : null },
  ];

  const effectiveTab: ActiveTab = pendingTab || currentTab;
  const notchTab: ActiveTab = hoveredTab || effectiveTab;
  const notchIndex = Math.max(0, navItems.findIndex((item) => item.id === notchTab));

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

            {/* User Profile Button (Nama, Email, Edit, Backup Data & Keluar) */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              title="Profil Saya, Backup & Keluar"
              aria-label="Profil Saya"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-xs font-bold">Profil</span>
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

      {/* User Profile Modal (Nama, Email, Edit, Backup Data, Keluar) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestLogout={() => {
          setIsProfileModalOpen(false);
          setIsLogoutModalOpen(true);
        }}
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

      {/* Bottom Floating Navigation Bar (Dynamic Sliding Curved Notch across all 7 menus) */}
      <nav className="fixed bottom-2 left-2 right-2 sm:bottom-3 z-40 pointer-events-none">
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className="pointer-events-auto max-w-xl mx-auto relative h-16"
        >
          {/* Background Dock dengan Sliding Curved Notch yang mengikuti menu aktif / hover */}
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden rounded-3xl drop-shadow-[0_6px_20px_rgba(6,78,59,0.12)] dark:drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] pointer-events-none"
          >
            <div
              className="w-full h-full will-change-transform transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1.08,0.36,1)]"
              style={{ transform: `translate3d(${((notchIndex + 0.5) / 7) * 100}%, 0, 0)` }}
            >
              <div className="absolute top-0 bottom-0 left-0 -translate-x-1/2 flex items-stretch w-[1400px]">
                {/* Sayap Kiri */}
                <div className="flex-1 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg border-y border-stone-200/80 dark:border-emerald-800/60" />

                {/* Lekukan Cekung Tengah (Curved Notch SVG) */}
                <svg
                  viewBox="0 0 72 64"
                  preserveAspectRatio="none"
                  className="w-[72px] h-16 shrink-0 -mx-[0.5px]"
                >
                  <path
                    d="M 0 0 C 14 0, 14 32, 36 32 C 58 32, 58 0, 72 0 L 72 64 L 0 64 Z"
                    className="fill-white/95 dark:fill-emerald-950/95"
                  />
                  <path
                    d="M 0 0.5 C 14 0.5, 14 32, 36 32 C 58 32, 58 0.5, 72 0.5"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-stone-200/80 dark:stroke-emerald-800/60"
                  />
                  <line
                    x1="0"
                    y1="63.5"
                    x2="72"
                    y2="63.5"
                    strokeWidth="1"
                    className="stroke-stone-200/80 dark:stroke-emerald-800/60"
                  />
                </svg>

                {/* Sayap Kanan */}
                <div className="flex-1 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-lg border-y border-stone-200/80 dark:border-emerald-800/60" />
              </div>
            </div>

            {/* Subtle rounded side borders */}
            <div className="absolute inset-0 rounded-3xl border-x border-stone-200/80 dark:border-emerald-800/60 pointer-events-none" />
          </div>

          {/* 7 Kolom Seimbang Tanpa Padding Samping (0.00px Alignment dengan Curved Notch) */}
          <div className="relative z-10 grid grid-cols-7 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              const isNotchFocused = notchTab === item.id;
              const isTasbih = item.id === 'tasbih';

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') {
                      setHoveredTab(item.id);
                    }
                  }}
                  onClick={() => {
                    setPendingTab(item.id);
                    setHoveredTab(null);
                    if (onTabChange) onTabChange(item.id);
                  }}
                  className="group touch-manipulation select-none relative h-full block"
                >
                  {/* Lingkaran Ikon Mengapung (Pop-up ke dalam Curved Notch saat aktif/focus) */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full will-change-transform transition-all duration-[340ms] ease-[cubic-bezier(0.22,1.08,0.36,1)] ${
                      isNotchFocused
                        ? isTasbih
                          ? `-top-[18px] w-11 h-11 text-white border-[2.5px] border-[#fbf9f5] dark:border-[#0a1410] ${
                              isActive
                                ? 'bg-gradient-to-tr from-amber-500 via-amber-500 to-yellow-400 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300/60 scale-105'
                                : 'bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 shadow-lg shadow-emerald-900/35 ring-2 ring-emerald-200/60 dark:ring-emerald-700/50 scale-105'
                            }`
                          : '-top-[18px] w-11 h-11 text-white border-[2.5px] border-[#fbf9f5] dark:border-[#0a1410] bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 shadow-lg shadow-emerald-900/35 ring-2 ring-emerald-200/60 dark:ring-emerald-700/50 scale-105'
                        : isTasbih
                          ? 'top-[9px] w-8 h-8 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-700/60 group-hover:scale-110 group-hover:-translate-y-0.5'
                          : 'top-[9px] w-8 h-8 text-stone-400 dark:text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:bg-emerald-50/90 dark:group-hover:bg-emerald-900/50 group-hover:scale-110 group-hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon
                      className={`transition-transform duration-300 ${
                        isNotchFocused
                          ? `w-5 h-5 ${isTasbih ? 'group-hover:rotate-12' : ''}`
                          : 'w-[18px] h-[18px]'
                      }`}
                      strokeWidth={isNotchFocused ? 2.35 : 1.9}
                    />
                    {item.badge === 'crown' && (
                      <span
                        className="absolute -top-1 -right-1 text-[9px] leading-none select-none"
                        title="Eksklusif Paket VIP"
                      >
                        👑
                      </span>
                    )}
                    {item.badge === 'lock' && (
                      <span
                        className="absolute -top-1 -right-1 text-[9px] leading-none select-none"
                        title="Terkunci (Perlu Upgrade)"
                      >
                        🔒
                      </span>
                    )}
                  </div>

                  {/* Label Menu */}
                  <span
                    className={`absolute bottom-1.5 left-0 right-0 text-center text-[10px] leading-tight tracking-tight transition-colors duration-200 ${
                      isNotchFocused
                        ? isTasbih && isActive
                          ? 'text-amber-600 dark:text-amber-400 font-black'
                          : 'text-emerald-800 dark:text-emerald-300 font-extrabold'
                        : isTasbih
                          ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                          : 'text-stone-500 dark:text-stone-400 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
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
