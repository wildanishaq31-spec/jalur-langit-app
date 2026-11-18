'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Moon, 
  Sparkles, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  ShieldCheck, 
  Sun
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DownloadPage() {
  const { appTheme, toggleTheme } = useJalurLangitStore();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeOsTab, setActiveOsTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    if (appTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme]);

  useEffect(() => {
    // Detect if already installed / standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect user agent for auto tab selection
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setActiveOsTab('ios');
    } else {
      setActiveOsTab('android');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        activeOsTab === 'android'
          ? 'Untuk menginstal di Android: Ketuk titik 3 di kanan atas browser Chrome, lalu pilih "Tambahkan ke Layar Utama" atau "Instal Aplikasi".'
          : 'Untuk menginstal di iPhone: Ketuk tombol Share (kotak panah ke atas) di Safari, lalu pilih "Add to Home Screen".'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors p-4 sm:p-6 relative select-none">
      
      {/* Background ambient glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100/90 dark:bg-emerald-950/90 border border-stone-200 dark:border-emerald-800/80 text-stone-600 dark:text-amber-300 hover:scale-105 transition-all shadow-xs"
        title="Ganti Tema (Terang / Gelap)"
      >
        {appTheme === 'dark' ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
      </button>

      <div className="max-w-xl mx-auto space-y-6 py-6 z-10 relative">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex relative items-center justify-center mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-xl border-2 border-amber-300/60">
              <Moon className="w-8 h-8 fill-current animate-pulse" />
              <Sparkles className="w-4 h-4 text-amber-200 absolute -top-1 -right-1" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Pembelian di Lynk.id Terverifikasi</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-stone-900 dark:text-stone-100">
              Download & Pasang Aplikasi
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              Jalur Langit berbasis <b>Progressive Web App (PWA)</b> modern. Tidak perlu download file APK besar dari luar — aplikasi langsung terpasang di layar utama HP Anda dengan kecepatan tinggi & offline-ready!
            </p>
          </div>
        </div>

        {/* 1-Click Install CTA Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white shadow-xl border border-amber-300/40 space-y-4 text-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
              <span>⚡ Ringan & Hemat Memori (&lt; 5MB)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-200">
              Pasang ke Layar Utama HP
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-sm mx-auto">
              Nikmati sensasi aplikasi native dengan getaran haptik, suara tasbih, dan akses instan langsung dari ikon di layar depan HP Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
            <button
              onClick={handleInstallClick}
              className="py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? 'Aplikasi Sudah Terpasang ✓' : '📲 Install Aplikasi Sekarang'}</span>
            </button>

            <Link
              href="/login"
              className="py-3 px-5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 backdrop-blur-xs"
            >
              <span>Buka & Login Aplikasi →</span>
            </Link>
          </div>
        </div>

        {/* Tab Switcher OS Guide (Android vs iPhone) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Panduan Pemasangan Manual
              </h3>
            </div>

            <div className="flex gap-1 bg-stone-100 dark:bg-emerald-900/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveOsTab('android')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeOsTab === 'android'
                    ? 'bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🤖 Android
              </button>
              <button
                onClick={() => setActiveOsTab('ios')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeOsTab === 'ios'
                    ? 'bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🍎 iPhone / iPad
              </button>
            </div>
          </div>

          {/* Android Steps */}
          {activeOsTab === 'android' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Buka Halaman di Google Chrome
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Pastikan Anda membuka website ini menggunakan browser Google Chrome atau Brave di HP Android Anda.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>Ketuk Titik Tiga</span>
                    <MoreVertical className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                    <span>di Kanan Atas</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Ketuk menu titik tiga (⋮) yang terletak di bar pojok kanan atas browser Google Chrome Anda.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>Pilih</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-black">
                      "Instal Aplikasi" / "Tambahkan ke Layar Utama"
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Ikon aplikasi Jalur Langit akan otomatis muncul di layar menu HP Anda seperti aplikasi bawaan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* iOS Steps */}
          {activeOsTab === 'ios' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Buka Halaman di Safari
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Buka tautan ini menggunakan browser bawaan Apple Safari di iPhone atau iPad Anda.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>Ketuk Tombol Share</span>
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>di Bawah Layar</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Ketuk ikon kotak dengan panah menghadap ke atas di menu navigasi bawah Safari.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>Pilih</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-black flex items-center gap-1">
                      <PlusSquare className="w-3 h-3" />
                      Add to Home Screen
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Gulir sedikit ke bawah, lalu pilih opsi "Add to Home Screen" (Tambahkan ke Layar Utama).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Link to Login */}
        <div className="text-center space-y-3">
          <Link
            href="/login"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Sudah Pasang Aplikasi? Lanjut Login Akun</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garansi Akses Seumur Hidup • Verifikasi Akun Lynk.id Resmi</span>
          </div>
        </div>

      </div>
    </div>
  );
}
