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
  ShoppingBag,
  User
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
  const [isUsingOtherAccount, setIsUsingOtherAccount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-detect email from URL query params (misal dari link email Lynk.id / checkout)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam && emailParam.includes('@')) {
        setInputEmail(emailParam.trim());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || isVerifying) return;
    setIsVerifying(true);
    await loginWithEmail(inputEmail.trim());
    setIsVerifying(false);
  };

  const handleSelectGoogleAccount = async (email: string) => {
    setIsGoogleModalOpen(false);
    setIsVerifying(true);
    await loginWithEmail(email);
    setIsVerifying(false);
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim() || isVerifying) return;
    setIsGoogleModalOpen(false);
    setIsVerifying(true);
    await loginWithEmail(googleEmailInput.trim());
    setIsVerifying(false);
    setGoogleEmailInput('');
    setIsUsingOtherAccount(false);
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

        {/* Card Form */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-emerald-950/50 border border-stone-200/90 dark:border-emerald-800/70 shadow-lg backdrop-blur-md space-y-2.5 sm:space-y-3.5">
          
          {/* 1. Tombol Utama Google (Membuka Tampilan Google Account Chooser) */}
          <div className="space-y-1 sm:space-y-1.5">
            <button
              onClick={() => {
                setIsUsingOtherAccount(false);
                setIsGoogleModalOpen(true);
              }}
              className="w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-stone-50 dark:bg-emerald-900/60 dark:hover:bg-emerald-900/90 border border-stone-300 dark:border-emerald-700 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2.5 relative group"
            >
              {/* Google Multicolored Icon SVG */}
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" viewBox="0 0 24 24">
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
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform ml-auto" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Secured by <b>Clerk Authentication</b></span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2.5 my-0.5">
            <div className="flex-1 h-px bg-stone-200 dark:bg-emerald-900/60" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
              atau ketik email
            </span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-emerald-900/60" />
          </div>

          {/* 2. Form Input Email Pembeli */}
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            <div className="space-y-0.5 sm:space-y-1">
              <label className="text-[10px] sm:text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-amber-500" />
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
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-stone-50 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!inputEmail.trim() || isVerifying}
              className="w-full py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

      {/* POPUP MODAL: GOOGLE ACCOUNT CHOOSER (PERSIS SEPERTI GAMBAR 2) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          {/* Google Account Chooser Card (Sleek Dark Card matching Gambar 2) */}
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-[#1e1f20] border border-stone-700/80 text-white shadow-2xl overflow-hidden animate-fade-in">
            
            {/* Top Bar Header */}
            <div className="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-stone-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs font-medium text-stone-200">Login dengan Google</span>
              </div>
              <button 
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-stone-400 hover:text-white text-xs font-bold p-1 rounded-lg transition-colors"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              
              {/* App Identity Banner */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-md shrink-0">
                  <Moon className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Pilih akun
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-400">
                    Lanjutkan ke <span className="font-semibold text-emerald-400">Jalur Langit</span>
                  </p>
                </div>
              </div>

              {/* Account Selection Options */}
              <div className="space-y-1">
                
                {/* 1. Account 1: Agung Siswoyo (agung.siswoyo14@gmail.com - Seperti di Gambar 2) */}
                <button
                  onClick={() => handleSelectGoogleAccount('agung.siswoyo14@gmail.com')}
                  className="w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-stone-800/80 border border-transparent hover:border-stone-700 text-left flex items-center gap-3 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
                    A
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      Agung Siswoyo
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-stone-400 truncate">
                      agung.siswoyo14@gmail.com
                    </div>
                  </div>
                </button>

                <div className="h-px bg-stone-700/60 my-1" />

                {/* 2. Gunakan Akun Lain */}
                {!isUsingOtherAccount ? (
                  <button
                    onClick={() => setIsUsingOtherAccount(true)}
                    className="w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-stone-800/80 border border-transparent hover:border-stone-700 text-left flex items-center gap-3 transition-all group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-800 border border-stone-600 text-stone-300 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                      Gunakan akun lain
                    </span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGoogleSubmit} className="p-3 rounded-xl bg-stone-800/60 border border-stone-700 space-y-2 animate-fade-in">
                    <div className="text-xs font-semibold text-stone-300">
                      Ketikkan akun Google lainnya:
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="akun.google@gmail.com"
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-white placeholder:text-stone-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsUsingOtherAccount(false)}
                        className="px-2.5 py-1 rounded-md text-xs font-bold text-stone-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={!googleEmailInput.trim()}
                        className="px-3.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Disclaimer Google Policy (Seperti di Gambar 2) */}
              <p className="text-[10px] sm:text-[11px] text-stone-400 leading-relaxed pt-2 border-t border-stone-700/60">
                Sebelum menggunakan aplikasi ini, Anda dapat meninjau{' '}
                <span className="text-blue-400 hover:underline cursor-pointer">Kebijakan Privasi</span> dan{' '}
                <span className="text-blue-400 hover:underline cursor-pointer">Persyaratan Layanan</span> Jalur Langit.
              </p>

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
