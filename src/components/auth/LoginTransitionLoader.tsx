'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginTransitionLoaderProps {
  onComplete: () => void;
}

export const LoginTransitionLoader: React.FC<LoginTransitionLoaderProps> = ({ onComplete }) => {
  const { currentUser } = useAuthStore();
  const [progress, setProgress] = useState(10);
  const [statusText, setStatusText] = useState('Memverifikasi lisensi pembelian Lynk.id...');

  useEffect(() => {
    // Stage 1: Initializing
    const timer1 = setTimeout(() => {
      setProgress(40);
      setStatusText(`Masya Allah, Akun Terverifikasi! (${currentUser?.tierLabel || 'Pembeli Lynk.id'})`);
    }, 600);

    // Stage 2: Loading Modules
    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText('Menyiapkan lembar amalan, tasbih & jurnal berkahmu...');
    }, 1300);

    // Stage 3: Ready
    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Bismillah, selamat datang di Jalur Langit ✨');
    }, 2000);

    // Stage 4: Enter App
    const timer4 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [currentUser, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07130e] text-[#f0f7f3] px-6 select-none animate-fade-in">
      {/* Background radial ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm space-y-7">
        
        {/* Animated Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura Rings */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-amber-400/30 animate-ping opacity-70 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />

          {/* Core App Logo */}
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-900 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(201,147,59,0.35)] flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
            <Moon className="w-10 h-10 text-amber-300 fill-amber-300 animate-pulse" />
            <Sparkles className="w-5 h-5 text-amber-200 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Title & User Greeting */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-xs font-bold text-amber-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Akses Terverifikasi Lynk.id</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white">
            Jalur Langit
          </h1>
          <p className="text-xs text-stone-300">
            Selamat datang kembali, <span className="text-amber-300 font-bold">{currentUser?.name || 'Sahabat'}</span>
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2.5">
          <div className="w-full h-2 rounded-full bg-emerald-950 border border-emerald-800/80 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,214,139,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-stone-300 font-medium italic transition-all duration-300 h-5">
            {statusText}
          </p>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[11px] text-stone-500 font-serif tracking-wide">
        Spiritual, Self-Growth & Manifesting Journal
      </div>
    </div>
  );
};
