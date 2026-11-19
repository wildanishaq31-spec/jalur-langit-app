'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Clock, 
  Flame, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { AuthUser } from '@/types/auth';

export type ActivityFilterType = 'all' | 'online' | 'today';

interface ActiveUsersCardProps {
  buyers: AuthUser[];
  activeFilter: ActivityFilterType;
  onSelectFilter: (filter: ActivityFilterType) => void;
}

export default function ActiveUsersCard({
  buyers,
  activeFilter,
  onSelectFilter
}: ActiveUsersCardProps) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const referenceTime = now || 1763520000000;
  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // Filter user berdasarkan waktu aktivitas terakhir
  const onlineBuyers = buyers.filter((b) => {
    if (!b.lastActiveAt) return false;
    const diff = referenceTime - new Date(b.lastActiveAt).getTime();
    return diff >= 0 && diff <= FIFTEEN_MINUTES;
  });

  const todayBuyers = buyers.filter((b) => {
    if (!b.lastActiveAt) return false;
    const diff = referenceTime - new Date(b.lastActiveAt).getTime();
    return diff >= 0 && diff <= ONE_DAY;
  });

  const totalBuyers = buyers.length;
  const onlineCount = onlineBuyers.length;
  const todayCount = todayBuyers.length;
  const inactiveTodayCount = Math.max(0, totalBuyers - todayCount);
  const activeRate = totalBuyers > 0 ? Math.round((todayCount / totalBuyers) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white p-5 sm:p-6 shadow-xl border border-emerald-500/30 space-y-5">
      
      {/* Background ambient decorative glows */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Real-Time Presence Monitor</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-serif text-emerald-100 flex items-center gap-2">
            <span>Pemantau Pengguna Aktif (User Aktif)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </h3>
          <p className="text-xs text-emerald-200/70">
            Pantau berapa pembeli yang sedang membuka aplikasi saat ini dan keaktifan harian secara real-time.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-700/50 self-start sm:self-auto">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-emerald-300">
            Sistem Aktif & Terhubung
          </span>
        </div>
      </div>

      {/* 3 Main Stat Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        
        {/* Metric 1: Online Sekarang */}
        <div 
          onClick={() => onSelectFilter(activeFilter === 'online' ? 'all' : 'online')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm ${
            activeFilter === 'online'
              ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
              : 'bg-emerald-900/30 border-emerald-700/50 hover:bg-emerald-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Sekarang
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white">
            {onlineCount}{' '}
            <span className="text-xs font-normal text-emerald-300">Pengguna</span>
          </div>

          <p className="text-[11px] text-emerald-200/70 mt-1">
            Membuka aplikasi dalam 15 menit terakhir
          </p>
        </div>

        {/* Metric 2: Aktif Hari Ini (DAU) */}
        <div 
          onClick={() => onSelectFilter(activeFilter === 'today' ? 'all' : 'today')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm ${
            activeFilter === 'today'
              ? 'bg-amber-900/50 border-amber-400 ring-2 ring-amber-400 shadow-md scale-[1.02]'
              : 'bg-amber-950/25 border-amber-700/50 hover:bg-amber-950/40'
          }`}
        >
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Aktif Hari Ini (DAU)
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white">
            {todayCount}{' '}
            <span className="text-xs font-normal text-amber-300">Pengguna</span>
          </div>

          <p className="text-[11px] text-amber-200/70 mt-1">
            Buka aplikasi atau catat amalan hari ini
          </p>
        </div>

        {/* Metric 3: Tingkat Istiqomah (Active Rate) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Tingkat Istiqomah
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {todayCount}/{totalBuyers} Akun
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white">
            {activeRate}%{' '}
            <span className="text-xs font-normal text-stone-300">Retensi Aktif</span>
          </div>

          <p className="text-[11px] text-stone-400 mt-1">
            Persentase pembeli yang aktif beramal hari ini
          </p>
        </div>

      </div>

      {/* Activity Breakdown Stacked Bar */}
      <div className="space-y-1.5 relative z-10 pt-1">
        <div className="flex items-center justify-between text-[11px] text-emerald-200/80 font-medium">
          <span>Distribusi Status Keaktifan:</span>
          <span>Total {totalBuyers} Pembeli Terdaftar</span>
        </div>

        <div className="h-3 w-full rounded-full bg-black/50 overflow-hidden flex shadow-inner">
          {onlineCount > 0 && (
            <div
              style={{ width: `${(onlineCount / Math.max(1, totalBuyers)) * 100}%` }}
              title={`Online: ${onlineCount} user`}
              className="h-full bg-emerald-400 transition-all duration-500"
            />
          )}

          {todayCount - onlineCount > 0 && (
            <div
              style={{ width: `${((todayCount - onlineCount) / Math.max(1, totalBuyers)) * 100}%` }}
              title={`Aktif Hari Ini: ${todayCount - onlineCount} user`}
              className="h-full bg-amber-400 transition-all duration-500"
            />
          )}

          {inactiveTodayCount > 0 && (
            <div
              style={{ width: `${(inactiveTodayCount / Math.max(1, totalBuyers)) * 100}%` }}
              title={`Belum Aktif Hari Ini: ${inactiveTodayCount} user`}
              className="h-full bg-stone-700/60 transition-all duration-500"
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Online Sekarang: <b>{onlineCount}</b></span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Aktif Hari Ini: <b>{todayCount}</b></span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-stone-600" />
            <span>Belum Aktif Hari Ini: <b>{inactiveTodayCount}</b></span>
          </div>
        </div>
      </div>

      {/* Quick Interactive Filter Bar */}
      <div className="pt-3 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-emerald-200/70">
            Filter Tabel Pembeli:
          </span>

          <button
            type="button"
            onClick={() => onSelectFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'bg-black/30 text-stone-300 hover:bg-black/50 border border-emerald-800/60'
            }`}
          >
            Semua ({totalBuyers})
          </button>

          <button
            type="button"
            onClick={() => onSelectFilter(activeFilter === 'online' ? 'all' : 'online')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'online'
                ? 'bg-emerald-400 text-stone-900 shadow-sm font-black'
                : 'bg-black/30 text-emerald-300 hover:bg-black/50 border border-emerald-800/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Online Saja ({onlineCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFilter(activeFilter === 'today' ? 'all' : 'today')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'today'
                ? 'bg-amber-400 text-stone-900 shadow-sm font-black'
                : 'bg-black/30 text-amber-300 hover:bg-black/50 border border-emerald-800/60'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Aktif Hari Ini ({todayCount})</span>
          </button>
        </div>

        {activeFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectFilter('all')}
            className="text-xs text-rose-300 hover:underline font-bold flex items-center gap-1"
          >
            ✕ Reset Filter Keaktifan
          </button>
        )}
      </div>

    </div>
  );
}
