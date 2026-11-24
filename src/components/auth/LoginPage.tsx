'use client';

import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Sun, 
  HelpCircle, 
  Mail, 
  ShoppingBag, 
  Smartphone, 
  Download, 
  X 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const LoginPage: React.FC = () => {
  const { 
    loginWithEmail, 
    authError, 
    deniedEmailAttempt, 
    clearAuthError
  } = useAuthStore();
  const { appTheme, toggleTheme } = useJalurLangitStore();

  const [inputEmail, setInputEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // State PWA Install Helper
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [installOsTab, setInstallOsTab] = useState<'android' | 'ios'>('android');

  // Auto-detect email from URL query params (misal dari link email Lynk.id / checkout) & PWA standalone mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Ambil email jika ada di query param
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam && emailParam.includes('@')) {
      setInputEmail(emailParam.trim());
    }

    // 2. Deteksi apakah aplikasi sudah diinstall / berjalan di mode Standalone
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsPwaInstalled(true);
    }

    // 3. Deteksi OS perangkat (Android vs iOS)
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setInstallOsTab('ios');
    } else {
      setInstallOsTab('android');
    }

    // 4. Tangkap event install prompt native Chrome Android
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsPwaInstalled(true);
        }
        setDeferredPrompt(null);
      } catch {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || isVerifying) return;
    setIsVerifying(true);
    await loginWithEmail(inputEmail.trim());
    setIsVerifying(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors px-4 py-2.5 sm:py-5 relative overflow-x-hidden select-none">
      
      {/* Background ambient decorative glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* Floating Theme Toggle Button (Tidak memakan tinggi vertikal) */}
      <button
        onClick={toggleTheme}
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-stone-100/90 dark:bg-emerald-950/90 border border-stone-200 dark:border-emerald-800/80 text-stone-600 dark:text-amber-300 hover:scale-105 transition-all shadow-xs backdrop-blur-xs"
        title="Ganti Tema (Terang / Gelap)"
      >
        {appTheme === 'dark' ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />}
      </button>

      {/* Main Login Card (Compact Mobile Responsive - 1 Layar Penuh Tanpa Scroll) */}
      <main className="w-full max-w-sm sm:max-w-md mx-auto my-auto z-10 flex flex-col justify-center space-y-2.5 sm:space-y-4 py-1 sm:py-2">
        
        {/* Hero Branding Header */}
        <div className="text-center space-y-1 sm:space-y-1.5">
          <div className="inline-flex relative items-center justify-center mx-auto">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-300/60">
              <Moon className="w-6.5 h-6.5 sm:w-8 sm:h-8 fill-current animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 absolute -top-1 -right-1" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
              <span>Self Improvement Edition</span>
            </div>

            {/* Judul: Jalur Langit */}
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-stone-900 dark:text-stone-100">
              Jalur Langit
            </h1>

            {/* Deskripsi Positif & Semangat Ringkas */}
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-xs mx-auto">
              Bismillah, kuatkan ikhtiar bumi dan pasrahkan di langit. Jemput keajaiban hidup melalui amalan terbaik hari ini.
            </p>
          </div>
        </div>

        {/* PWA Smart Install Banner - Hanya Tampil jika Belum di-Install ke Home Screen */}
        {!isPwaInstalled && (
          <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950/90 border border-amber-300/40 shadow-sm text-white flex items-center justify-between gap-2 animate-fade-in backdrop-blur-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-950" />
              </div>
              <div className="text-left truncate">
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-200">
                  Klik install sekarang jika pertama kali login.
                </div>
                <div className="text-[8px] sm:text-[9px] text-stone-300 truncate">
                  Pasang ikon aplikasi di layar utama HP Anda
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-[9px] sm:text-[10px] shrink-0 transition-transform active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>{deferredPrompt ? 'Instal Sekarang' : 'Cara Pasang'}</span>
            </button>
          </div>
        )}

        {/* Card Form */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-emerald-950/50 border border-stone-200/90 dark:border-emerald-800/70 shadow-lg backdrop-blur-md space-y-3">
          
          {/* Header Form */}
          <div className="space-y-0.5 sm:space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Masuk dengan Email Pembelian</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Ketikkan email yang sama persis saat Anda membeli di <b>Lynk.id</b>.
            </p>
          </div>

          {/* Form Input Email Pembeli */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="space-y-1">
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (authError) clearAuthError();
                }}
                placeholder="nama.kamu@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputEmail.trim() || isVerifying}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memeriksa Akses Lynk.id...</span>
                </>
              ) : (
                <>
                  <span>Verifikasi Akses Pembeli</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Link Pembelian Lynk.id */}
        <div className="text-center space-y-0.5 sm:space-y-1">
          <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400">
            Belum membeli lisensi aplikasi Jalur Langit?
          </p>

          <a
            href="https://lynk.id/jalurlangitapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-[10px] sm:text-xs shadow-xs transition-all active:scale-95"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Beli Akses di Lynk.id Mulai Rp 49.000 →</span>
          </a>
        </div>

      </main>

      {/* Footer Security Badges */}
      <footer className="w-full max-w-sm sm:max-w-md mx-auto text-center py-1 border-t border-stone-200/80 dark:border-emerald-800/40 text-[9px] sm:text-[10px] text-stone-400 space-y-0.5 z-10 shrink-0">
        <div className="flex items-center justify-center gap-2.5">
          <span>🔒 Akses Seumur Hidup</span>
          <span>•</span>
          <span>📱 PWA Offline Ready</span>
          <span>•</span>
          <span>🛡️ Privasi 100% Terjaga</span>
        </div>
        <p className="text-[8px] sm:text-[9px] opacity-75">Jalur Langit - Spiritual & Self-Growth Journaling</p>
      </footer>

      {/* POPUP MODAL: PANDUAN INSTAL PWA KE LAYAR UTAMA HP */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1813] border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 shadow-2xl overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-stone-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs sm:text-sm font-bold">Pasang ke Layar Utama HP</span>
              </div>
              <button 
                onClick={() => setIsInstallModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-3.5">
              
              {/* Tab Selector Android vs iOS */}
              <div className="flex rounded-xl bg-stone-100 dark:bg-emerald-950/80 p-1 border border-stone-200 dark:border-emerald-800/80">
                <button
                  type="button"
                  onClick={() => setInstallOsTab('android')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    installOsTab === 'android'
                      ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🤖 HP Android (Chrome)
                </button>
                <button
                  type="button"
                  onClick={() => setInstallOsTab('ios')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    installOsTab === 'ios'
                      ? 'bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🍎 iPhone (Safari)
                </button>
              </div>

              {/* Instructions per OS */}
              {installOsTab === 'android' ? (
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <p>Buka halaman ini menggunakan browser <b>Google Chrome</b> di HP Anda.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <p>Ketuk ikon <b>titik tiga (⋮)</b> di pojok kanan atas browser Chrome.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <p>Pilih menu <b>&quot;Tambahkan ke Layar Utama&quot;</b> atau <b>&quot;Instal Aplikasi&quot;</b>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <p>Selesai! Ikon <b>Jalur Langit</b> akan langsung muncul di layar depan HP Anda.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <p>Pastikan membuka link ini menggunakan browser <b>Safari</b> di iPhone Anda.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <p>Ketuk tombol <b>Bagikan (Share)</b> berupa ikon kotak dengan panah ke atas (⬆️) di bilah bawah.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <p>Gulir ke bawah lalu pilih <b>&quot;Add to Home Screen&quot;</b> (Tambahkan ke Layar Utama).</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <p>Ketuk <b>Add / Tambah</b> di kanan atas. Ikon aplikasi langsung siap digunakan!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {deferredPrompt && installOsTab === 'android' && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Klik di Sini untuk Instal Otomatis</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsInstallModalOpen(false)}
                  className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs transition-all"
                >
                  Saya Mengerti, Lanjut Masuk ke Akun →
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: AKSES DITOLAK (EMAIL TIDAK TERDAFTAR DI LYNK.ID) */}
      {authError === 'not_purchased' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1813] border-2 border-rose-300 dark:border-rose-800 p-4 sm:p-5 space-y-3 sm:space-y-3.5 shadow-2xl text-center">
            
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base font-serif text-stone-900 dark:text-stone-100">
                Email Belum Terdaftar
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Email <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1 py-0.5 rounded-md">{deniedEmailAttempt}</span> belum tercatat dalam sistem pembelian kami di <b>Lynk.id</b>.
              </p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 text-[10px] sm:text-[11px] text-stone-500 text-left space-y-1">
              <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips Membuka Akses:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Pastikan email sama persis dengan yang diketik saat checkout Lynk.id.</li>
                <li>Periksa email konfirmasi pembelian dari Lynk.id.</li>
              </ul>
            </div>

            <div className="space-y-1.5 pt-0.5">
              <button
                onClick={clearAuthError}
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-stone-100 dark:bg-emerald-900/60 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                Coba Email / Akun Lain
              </button>

              <a
                href="https://lynk.id/jalurlangitapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Beli Akses di Lynk.id Sekarang →</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
