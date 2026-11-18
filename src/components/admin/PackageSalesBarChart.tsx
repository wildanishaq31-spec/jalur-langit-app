'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Sparkles, 
  Award, 
  Crown, 
  ShieldCheck,
  CheckCircle2,
  Filter,
  Layers
} from 'lucide-react';
import { AuthUser, UserTier } from '@/types/auth';

interface PackageSalesBarChartProps {
  buyers: AuthUser[];
  selectedTierFilter: UserTier | 'all';
  onSelectTierFilter: (tier: UserTier | 'all') => void;
}

export default function PackageSalesBarChart({
  buyers,
  selectedTierFilter,
  onSelectTierFilter
}: PackageSalesBarChartProps) {
  // Mode tampilan: 'count' (Jumlah Akun) vs 'revenue' (Omset Rupiah)
  const [chartMode, setChartMode] = useState<'count' | 'revenue'>('count');
  const [hoveredTier, setHoveredTier] = useState<UserTier | null>(null);

  // Kalkulasi data per tier
  const starterBuyers = buyers.filter((b) => b.tier === 'starter');
  const ultimateBuyers = buyers.filter((b) => b.tier === 'ultimate');
  const vipBuyers = buyers.filter((b) => b.tier === 'vip');

  const counts: Record<UserTier, number> = {
    starter: starterBuyers.length,
    ultimate: ultimateBuyers.length,
    vip: vipBuyers.length
  };

  const revenues: Record<UserTier, number> = {
    starter: counts.starter * 49000,
    ultimate: counts.ultimate * 89000,
    vip: counts.vip * 149000
  };

  const totalBuyers = buyers.length;
  const totalRevenue = revenues.starter + revenues.ultimate + revenues.vip;

  // Persentase
  const percentages: Record<UserTier, number> = {
    starter: totalBuyers > 0 ? Math.round((counts.starter / totalBuyers) * 100) : 0,
    ultimate: totalBuyers > 0 ? Math.round((counts.ultimate / totalBuyers) * 100) : 0,
    vip: totalBuyers > 0 ? Math.round((counts.vip / totalBuyers) * 100) : 0
  };

  const revenuePercentages: Record<UserTier, number> = {
    starter: totalRevenue > 0 ? Math.round((revenues.starter / totalRevenue) * 100) : 0,
    ultimate: totalRevenue > 0 ? Math.round((revenues.ultimate / totalRevenue) * 100) : 0,
    vip: totalRevenue > 0 ? Math.round((revenues.vip / totalRevenue) * 100) : 0
  };

  // Nilai maksimum untuk skala tinggi batang
  const maxCount = Math.max(counts.starter, counts.ultimate, counts.vip, 1);
  const maxRevenue = Math.max(revenues.starter, revenues.ultimate, revenues.vip, 1);

  // Konfigurasi visual tiap tier
  const tierMeta: Record<
    UserTier,
    {
      label: string;
      sub: string;
      price: string;
      icon: typeof Sparkles;
      colorClass: string;
      gradientClass: string;
      bgCardClass: string;
      borderClass: string;
      textClass: string;
      ringClass: string;
      badge?: string;
    }
  > = {
    starter: {
      label: 'Starter 30 Hari',
      sub: 'Paket Dasar',
      price: 'Rp 49.000',
      icon: ShieldCheck,
      colorClass: 'emerald',
      gradientClass: 'from-emerald-500 via-emerald-600 to-teal-700',
      bgCardClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderClass: 'border-emerald-300 dark:border-emerald-800',
      textClass: 'text-emerald-700 dark:text-emerald-300',
      ringClass: 'ring-emerald-500'
    },
    ultimate: {
      label: 'Ultimate Bundling',
      sub: 'Akses Lengkap',
      price: 'Rp 89.000',
      icon: Award,
      colorClass: 'amber',
      gradientClass: 'from-amber-400 via-amber-500 to-yellow-600',
      bgCardClass: 'bg-amber-50 dark:bg-amber-950/40',
      borderClass: 'border-amber-300 dark:border-amber-800',
      textClass: 'text-amber-700 dark:text-amber-300',
      ringClass: 'ring-amber-500',
      badge: 'Best Seller 🔥'
    },
    vip: {
      label: 'VIP Sultan + Lab',
      sub: 'Semua Fitur + Mentoring',
      price: 'Rp 149.000',
      icon: Crown,
      colorClass: 'purple',
      gradientClass: 'from-purple-500 via-indigo-600 to-violet-700',
      bgCardClass: 'bg-purple-50 dark:bg-purple-950/40',
      borderClass: 'border-purple-300 dark:border-purple-800',
      textClass: 'text-purple-700 dark:text-purple-300',
      ringClass: 'ring-purple-500',
      badge: 'High Value 👑'
    }
  };

  const tiers: UserTier[] = ['starter', 'ultimate', 'vip'];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-5 transition-all">
      
      {/* 1. Header Grafik + Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistik Penjualan Paket Lynk.id</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Chart Bar Interaktif Pembelian Paket</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Klik pada batang grafik untuk memfilter daftar pembeli secara langsung di bawah.
          </p>
        </div>

        {/* Mode Switcher: Akun vs Omset */}
        <div className="flex items-center bg-stone-100 dark:bg-emerald-900/40 p-1 rounded-2xl border border-stone-200 dark:border-emerald-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('count')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'count'
                ? 'bg-white dark:bg-emerald-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Jumlah Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode('revenue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'revenue'
                ? 'bg-white dark:bg-emerald-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Omset (Rp)</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter Bar (Chat / Command Filter Tabs) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-emerald-900/40">
        <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filter Cepat:
        </span>

        <button
          type="button"
          onClick={() => onSelectTierFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            selectedTierFilter === 'all'
              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent shadow-xs'
              : 'bg-stone-50 dark:bg-emerald-900/20 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-800 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Semua ({totalBuyers})</span>
        </button>

        {tiers.map((t) => {
          const meta = tierMeta[t];
          const isSelected = selectedTierFilter === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelectTierFilter(isSelected ? 'all' : t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? `${meta.bgCardClass} ${meta.borderClass} ${meta.textClass} ring-2 ${meta.ringClass} shadow-xs font-black`
                  : 'bg-stone-50 dark:bg-emerald-900/20 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-800 hover:bg-stone-100'
              }`}
            >
              <meta.icon className="w-3 h-3" />
              <span>{meta.label} ({counts[t]})</span>
            </button>
          );
        })}

        {selectedTierFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectTierFilter('all')}
            className="text-[11px] text-rose-500 hover:underline font-bold ml-auto"
          >
            ✕ Reset Filter
          </button>
        )}
      </div>

      {/* 3. Main Chart Canvas: Vertical Interactive Bar Chart */}
      <div className="relative pt-6 pb-2 px-2 sm:px-6 rounded-2xl bg-stone-50/80 dark:bg-black/20 border border-stone-100 dark:border-emerald-900/30">
        
        {/* Background Grid Horizontal Guidelines */}
        <div className="absolute inset-x-6 top-8 bottom-14 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-stone-200 dark:border-emerald-800 w-full" />
          <div className="border-b border-dashed border-stone-200 dark:border-emerald-800 w-full" />
          <div className="border-b border-dashed border-stone-200 dark:border-emerald-800 w-full" />
        </div>

        {/* 3 Vertical Bars Container */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 h-64 sm:h-72 items-end z-10 relative">
          {tiers.map((t) => {
            const meta = tierMeta[t];
            const isSelected = selectedTierFilter === t;
            const isHovered = hoveredTier === t;

            // Hitung tinggi proporsional (min 15% untuk estetika visual saat 0)
            const currentVal = chartMode === 'count' ? counts[t] : revenues[t];
            const maxVal = chartMode === 'count' ? maxCount : maxRevenue;
            const rawPercent = maxVal > 0 ? (currentVal / maxVal) * 100 : 0;
            const barHeightPercent = currentVal === 0 ? 12 : Math.max(rawPercent, 20);

            const displayValue =
              chartMode === 'count'
                ? `${counts[t]} Pembeli`
                : `Rp ${(revenues[t] / 1000).toLocaleString('id-ID')}k`;

            const percentageShare =
              chartMode === 'count' ? percentages[t] : revenuePercentages[t];

            return (
              <div
                key={t}
                className="flex flex-col items-center justify-end h-full group cursor-pointer"
                onMouseEnter={() => setHoveredTier(t)}
                onMouseLeave={() => setHoveredTier(null)}
                onClick={() => onSelectTierFilter(isSelected ? 'all' : t)}
              >
                {/* Floating Tooltip Pill di atas batang */}
                <div
                  className={`mb-2 px-2 sm:px-3 py-1 rounded-xl text-center transition-all duration-300 shadow-sm ${
                    isSelected || isHovered
                      ? `${meta.bgCardClass} ${meta.borderClass} border scale-105`
                      : 'bg-white dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-black ${meta.textClass}`}>
                    {displayValue}
                  </div>
                  <div className="text-[10px] text-stone-500 font-bold">
                    {percentageShare}% dari total
                  </div>
                </div>

                {/* Batang Utama (Animated Bar) */}
                <div className="w-full max-w-[90px] sm:max-w-[130px] flex flex-col justify-end items-center relative">
                  
                  {/* Efek Glow bila dipilih */}
                  {isSelected && (
                    <div
                      className={`absolute -inset-1 rounded-2xl bg-gradient-to-t ${meta.gradientClass} opacity-30 blur-xs animate-pulse`}
                    />
                  )}

                  <div
                    style={{ height: `${barHeightPercent}%` }}
                    className={`w-full rounded-2xl bg-gradient-to-t ${meta.gradientClass} p-2 flex flex-col justify-between items-center text-white shadow-md transition-all duration-500 ease-out relative group-hover:scale-[1.02] ${
                      isSelected ? 'ring-3 ring-stone-900 dark:ring-amber-300 ring-offset-2 dark:ring-offset-emerald-950' : ''
                    }`}
                  >
                    {/* Badge di dalam batang jika muat */}
                    {meta.badge && (
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-white text-center leading-tight">
                        {meta.badge}
                      </span>
                    )}

                    <div className="my-auto">
                      <meta.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 drop-shadow-sm" />
                    </div>

                    <div className="text-center pb-0.5">
                      <span className="text-[10px] sm:text-xs font-black tracking-wide text-white drop-shadow-sm">
                        {meta.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Label Keterangan di Bawah Batang */}
                <div className="mt-3 text-center space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center gap-1">
                    <span>{meta.label.split(' ')[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-stone-400 hidden sm:block">
                    {meta.sub}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Horizontal Distribution Ratio Bar (Pangsa Pasar Penjualan) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Distribusi Pangsa Pembelian Paket:</span>
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            Total {totalBuyers} Pembeli ({chartMode === 'revenue' ? `Rp ${totalRevenue.toLocaleString('id-ID')}` : '100%'})
          </span>
        </div>

        {/* Multi-Segment Stacked Bar */}
        <div className="h-4 w-full rounded-full bg-stone-200 dark:bg-emerald-950 overflow-hidden flex shadow-inner">
          {counts.starter > 0 && (
            <div
              style={{ width: `${percentages.starter}%` }}
              title={`Starter: ${counts.starter} pembeli (${percentages.starter}%)`}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-black text-white"
            >
              {percentages.starter >= 10 && `${percentages.starter}%`}
            </div>
          )}

          {counts.ultimate > 0 && (
            <div
              style={{ width: `${percentages.ultimate}%` }}
              title={`Ultimate: ${counts.ultimate} pembeli (${percentages.ultimate}%)`}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-black text-stone-900"
            >
              {percentages.ultimate >= 10 && `${percentages.ultimate}%`}
            </div>
          )}

          {counts.vip > 0 && (
            <div
              style={{ width: `${percentages.vip}%` }}
              title={`VIP: ${counts.vip} pembeli (${percentages.vip}%)`}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-black text-white"
            >
              {percentages.vip >= 10 && `${percentages.vip}%`}
            </div>
          )}

          {totalBuyers === 0 && (
            <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400 italic">
              Belum ada data pembelian tercatat
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Starter: <b>{counts.starter}</b> ({percentages.starter}%)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="truncate">Ultimate: <b>{counts.ultimate}</b> ({percentages.ultimate}%)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <span className="truncate">VIP: <b>{counts.vip}</b> ({percentages.vip}%)</span>
          </div>
        </div>
      </div>

      {/* 5. Active Filter Status Card if selected */}
      {selectedTierFilter !== 'all' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-stone-800 dark:text-stone-200">
              Tabel di bawah saat ini hanya menampilkan pembeli <b>{tierMeta[selectedTierFilter].label}</b> ({counts[selectedTierFilter]} akun).
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectTierFilter('all')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-950 text-stone-700 dark:text-stone-200 font-bold border border-stone-200 dark:border-emerald-800 hover:bg-stone-50 transition-all shrink-0 ml-2"
          >
            Tampilkan Semua
          </button>
        </div>
      )}

    </div>
  );
}
