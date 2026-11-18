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
  Check,
  User,
  UserPlus
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
  const [turnstileState, setTurnstileState] = useState<'idle' | 'verifying' | 'verified'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    if (turnstileState !== 'verified') return;
    loginWithEmail(inputEmail.trim());
  };

  const handleSelectGoogleAccount = (email: string) => {
    setIsGoogleModalOpen(false);
    loginWithEmail(email);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    setIsGoogleModalOpen(false);
    loginWithEmail(googleEmailInput.trim());
    setGoogleEmailInput('');
    setIsUsingOtherAccount(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background ambient decorative glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* Top Header Navigation (Logo di pojok kiri atas dihapus sesuai arahan pengguna) */}
      <header className="w-full max-w-md mx-auto flex items-center justify-end py-2 z-10">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-stone-100 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800/80 text-stone-600 dark:text-amber-300 hover:scale-105 transition-all shadow-xs"
          title="Ganti Tema (Terang / Gelap)"
        >
          {appTheme === 'dark' ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
      </header>

      {/* Main Login Card (Mobile Centered) */}
      <main className="w-full max-w-md mx-auto my-auto py-4 z-10 space-y-6">
        
        {/* Hero Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex relative items-center justify-center mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-xl border-2 border-amber-300/60">
              <Moon className="w-10 h-10 fill-current animate-pulse" />
              <Sparkles className="w-5 h-5 text-amber-200 absolute -top-1.5 -right-1.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-[10px] font-black uppercase tracking-wider">
              <span>Self Improvement Edition</span>
            </div>

            {/* Judul Baru: Jalur Langit */}
            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-stone-900 dark:text-stone-100">
              Jalur Langit
            </h1>

            {/* Deskripsi Positif & Semangat */}
            <p className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed max-w-sm mx-auto pt-0.5">
              Bismillah, kuatkan ikhtiar bumi dan pasrahkan hasil terbaik di langit. Mulai perjalanan transformasi spiritual, pembentukan kebiasaan berkah, dan jemput keajaiban hidup melalui amalan terbaik hari ini.
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
              ✨ Masuk dengan akun Google atau email pembelian Lynk.id kamu.
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-xl backdrop-blur-md space-y-5">
          
          {/* 1. Tombol Utama Google (Membuka Tampilan Google Account Chooser seperti di Gambar 2) */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsUsingOtherAccount(false);
                setIsGoogleModalOpen(true);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 dark:bg-emerald-900/60 dark:hover:bg-emerald-900/90 border border-stone-300 dark:border-emerald-700 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 relative group"
            >
              {/* Google Multicolored Icon SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

          {/* 2. Form Input Email Pembeli + Cloudflare Turnstile Human Verification */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            {/* Cloudflare Turnstile Human Verification Widget */}
            <div className="p-3 rounded-2xl border border-stone-200 dark:border-emerald-800/80 bg-stone-50/90 dark:bg-[#081510] flex items-center justify-between shadow-xs transition-all">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (turnstileState === 'verified') return;
                    setTurnstileState('verifying');
                    setTimeout(() => {
                      setTurnstileState('verified');
                    }, 1200);
                  }}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                    turnstileState === 'verified'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : turnstileState === 'verifying'
                      ? 'bg-amber-50 dark:bg-amber-950 border-amber-400'
                      : 'bg-white dark:bg-emerald-950/80 border-stone-300 dark:border-emerald-700 hover:border-amber-500'
                  }`}
                  title="Klik untuk verifikasi keamanan"
                >
                  {turnstileState === 'verifying' && (
                    <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {turnstileState === 'verified' && (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  )}
                </button>

                <div className="text-left">
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {turnstileState === 'verified'
                      ? 'Verifikasi Berhasil'
                      : turnstileState === 'verifying'
                      ? 'Memverifikasi...'
                      : 'Verifikasi bahwa Anda manusia'}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {turnstileState === 'verified' ? 'Telah terverifikasi aman' : 'Klik kotak untuk melanjutkan'}
                  </div>
                </div>
              </div>

              {/* Cloudflare Badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  {/* Cloudflare Orange Cloud Icon */}
                  <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                    <path d="M37.5 14.5C37.5 14 37.4 13.5 37.3 13C36.1 7.8 31.5 4 26 4C21.4 4 17.5 6.7 15.6 10.6C14.7 10.2 13.6 10 12.5 10C8.4 10 5 13.4 5 17.5C5 17.8 5 18.2 5.1 18.5C2.2 19.8 0 22.7 0 26.2C0 30.5 3.5 34 7.8 34H37.5C41.6 34 45 30.6 45 26.5C45 20.8 40.5 15.8 37.5 14.5Z" fill="#F38020"/>
                    <path d="M31.2 34H7.8C4.5 34 1.8 31.4 1.5 28.2C2.4 28.7 3.5 29 4.6 29H31.2C32.7 29 34 27.7 34 26.2C34 24.7 32.7 23.4 31.2 23.4H30.5C30.2 21.2 28.3 19.5 26 19.5C25.5 19.5 25 19.6 24.6 19.8C25.5 17.8 27.6 16.5 30 16.5C33.6 16.5 36.5 19.4 36.5 23C36.5 23.4 36.5 23.7 36.4 24.1C39.4 24.6 41.6 27.2 41.6 30.3C41.6 32.3 40.2 34 38.2 34H31.2Z" fill="#FAAE40"/>
                  </svg>
                  <span className="text-[10px] font-black tracking-wider text-stone-600 dark:text-stone-300">
                    CLOUDFLARE
                  </span>
                </div>
                <div className="flex gap-1 text-[8px] text-stone-400">
                  <span>Privacy</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputEmail.trim() || turnstileState !== 'verified'}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
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

      {/* POPUP MODAL: GOOGLE ACCOUNT CHOOSER (PERSIS SEPERTI GAMBAR 2) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          {/* Google Account Chooser Card (Sleek Dark Card matching Gambar 2) */}
          <div className="w-full max-w-md rounded-3xl bg-[#1e1f20] border border-stone-700/80 text-white shadow-2xl overflow-hidden animate-fade-in">
            
            {/* Top Bar Header */}
            <div className="px-5 py-3.5 border-b border-stone-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
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
            <div className="p-6 space-y-6">
              
              {/* App Identity Banner */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-md shrink-0">
                  <Moon className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Pilih akun
                  </h3>
                  <p className="text-xs text-stone-400">
                    Lanjutkan ke <span className="font-semibold text-emerald-400">Jalur Langit</span>
                  </p>
                </div>
              </div>

              {/* Account Selection Options */}
              <div className="space-y-1">
                
                {/* 1. Account 1: Agung Siswoyo (agung.siswoyo14@gmail.com - Seperti di Gambar 2) */}
                <button
                  onClick={() => handleSelectGoogleAccount('agung.siswoyo14@gmail.com')}
                  className="w-full p-3 rounded-2xl hover:bg-stone-800/80 border border-transparent hover:border-stone-700 text-left flex items-center gap-3.5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                    A
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      Agung Siswoyo
                    </div>
                    <div className="text-[11px] text-stone-400 truncate">
                      agung.siswoyo14@gmail.com
                    </div>
                  </div>
                </button>

                <div className="h-px bg-stone-700/60 my-1" />

                {/* 2. Gunakan Akun Lain */}
                {!isUsingOtherAccount ? (
                  <button
                    onClick={() => setIsUsingOtherAccount(true)}
                    className="w-full p-3 rounded-2xl hover:bg-stone-800/80 border border-transparent hover:border-stone-700 text-left flex items-center gap-3.5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-600 text-stone-300 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-stone-300" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                      Gunakan akun lain
                    </span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGoogleSubmit} className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700 space-y-2.5 animate-fade-in">
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
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-white placeholder:text-stone-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsUsingOtherAccount(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={!googleEmailInput.trim()}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                      >
                        Lanjutkan
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Disclaimer Google Policy (Seperti di Gambar 2) */}
              <p className="text-[11px] text-stone-400 leading-relaxed pt-2 border-t border-stone-700/60">
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
