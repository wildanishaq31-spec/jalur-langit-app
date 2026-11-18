'use client';

import React, { useState } from 'react';
import { 
  Moon, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Sun, 
  HelpCircle, 
  Mail,
  ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

export const LoginPage: React.FC = () => {
  const { 
    loginWithEmail, 
    authError, 
    deniedEmailAttempt, 
    clearAuthError
  } = useAuthStore();
  const { appTheme, toggleTheme } = useJalurLangitStore();

  const [inputEmail, setInputEmail] = useState('');
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    loginWithEmail(inputEmail.trim());
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    setIsGoogleModalOpen(false);
    loginWithEmail(googleEmailInput.trim());
    setGoogleEmailInput('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background ambient decorative glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300 flex items-center justify-center shadow-xs">
            <Moon className="w-4 h-4 fill-current" />
          </div>
          <span className="font-serif font-black text-sm tracking-tight text-stone-900 dark:text-stone-100">
            Jalur Langit
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-stone-100 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800/80 text-stone-600 dark:text-amber-300 hover:scale-105 transition-all shadow-xs"
          title="Ganti Tema (Terang / Gelap)"
        >
          {appTheme === 'dark' ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
      </header>

      {/* Main Login Card (Mobile Centered) */}
      <main className="w-full max-w-md mx-auto my-auto py-6 z-10 space-y-6">
        
        {/* Hero Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex relative items-center justify-center mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-xl border-2 border-amber-300/60">
              <Moon className="w-10 h-10 fill-current animate-pulse" />
              <Sparkles className="w-5 h-5 text-amber-200 absolute -top-1.5 -right-1.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-[10px] font-black uppercase tracking-wider">
              <span>Self Improvement Edition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-stone-900 dark:text-stone-100">
              Gerbang Akses Pembeli
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs mx-auto">
              Verifikasi akun Google atau email yang kamu daftarkan saat melakukan pembelian di <b>Lynk.id</b>.
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-xl backdrop-blur-md space-y-5">
          
          {/* 1. Tombol Utama Google (Secured by Clerk) */}
          <div className="space-y-2">
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 dark:bg-emerald-900/60 dark:hover:bg-emerald-900/90 border border-stone-300 dark:border-emerald-700 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 relative group"
            >
              {/* Google Multicolored Icon SVG */}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google</span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform ml-auto" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Secured by <b>Clerk Authentication</b></span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200 dark:bg-emerald-900/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              atau ketik email
            </span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-emerald-900/60" />
          </div>

          {/* 2. Form Input Email Pembeli */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Email Pembelian Lynk.id</span>
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (authError) clearAuthError();
                }}
                placeholder="nama.kamu@gmail.com"
                className="w-full px-3.5 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputEmail.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Verifikasi Akses Pembeli</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer Link Pembelian Lynk.id */}
        <div className="text-center space-y-2">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Belum membeli lisensi aplikasi Jalur Langit?
          </p>

          <a
            href="https://lynk.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli Akses di Lynk.id Mulai Rp 49.000 →</span>
          </a>
        </div>

      </main>

      {/* Footer Security Badges */}
      <footer className="w-full max-w-md mx-auto text-center py-2 border-t border-stone-200/80 dark:border-emerald-800/40 text-[10px] text-stone-400 space-y-1">
        <div className="flex items-center justify-center gap-3">
          <span>🔒 Akses Seumur Hidup</span>
          <span>•</span>
          <span>📱 PWA Offline Ready</span>
          <span>•</span>
          <span>🛡️ Privasi 100% Terjaga</span>
        </div>
        <p>Jalur Langit - Spiritual & Self-Growth Journaling</p>
      </footer>

      {/* POPUP MODAL: CLERK GOOGLE AUTH DIALOG */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0c1813] border border-stone-200 dark:border-emerald-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-emerald-800">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    Masuk dengan Google
                  </h4>
                  <span className="text-[10px] text-stone-400">Secured by Clerk Auth</span>
                </div>
              </div>
              <button 
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Ketikkan akun Google yang Anda daftarkan saat melakukan transaksi pembelian di <b>Lynk.id</b>:
            </p>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                placeholder="nama.kamu@gmail.com"
                className="w-full px-3.5 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />

              <button
                type="submit"
                disabled={!googleEmailInput.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Lanjutkan Verifikasi Akun</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: AKSES DITOLAK (EMAIL TIDAK TERDAFTAR DI LYNK.ID) */}
      {authError === 'not_purchased' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0c1813] border-2 border-rose-300 dark:border-rose-800 p-6 space-y-4 shadow-2xl text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base font-serif text-stone-900 dark:text-stone-100">
                Email Belum Terdaftar
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Email <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1 py-0.5 rounded-md">{deniedEmailAttempt}</span> belum tercatat dalam sistem pembelian kami di <b>Lynk.id</b>.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800 text-[11px] text-stone-500 text-left space-y-1">
              <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips Membuka Akses:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Pastikan email sama persis dengan yang diketik saat checkout Lynk.id.</li>
                <li>Periksa email konfirmasi pembelian dari Lynk.id.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={clearAuthError}
                className="w-full py-2.5 rounded-2xl bg-stone-100 dark:bg-emerald-900/60 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                Coba Email / Akun Lain
              </button>

              <a
                href="https://lynk.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
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
