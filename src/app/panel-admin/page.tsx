'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  KeyRound, 
  Lock,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserTier, TIER_CONFIG, AuthUser } from '@/types/auth';
import PackageSalesBarChart from '@/components/admin/PackageSalesBarChart';

export default function PanelAdminPage() {
  const router = useRouter();
  const { 
    whitelist, 
    addBuyerToWhitelist, 
    removeBuyerFromWhitelist, 
    updateBuyerTier, 
    loginAsAdmin
  } = useAuthStore();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Form states for adding new buyer (manual backup)
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState<UserTier>('ultimate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<UserTier | 'all'>('all');

  const webhookEndpointUrl = 'https://jalur-langit-app.vercel.app/api/webhook/lynkid';

  // PIN Admin Default: 1409 atau jalurlangit
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1409' || pinInput === 'jalurlangit' || pinInput === 'admin') {
      setIsAdminUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpointUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 3000);
  };

  // Simulasi Webhook Lynk.id Otomatis (Menguji Alur Sequence Diagram)
  const handleSimulateWebhook = async (tier: UserTier) => {
    setIsSimulating(true);
    const mockNames = {
      starter: 'Rina Marlina (Tes Lynk.id)',
      ultimate: 'Dewi Lestari (Tes Lynk.id)',
      vip: 'Ahmad Fauzi (Tes Lynk.id)'
    };
    const mockPrices = { starter: 49000, ultimate: 89000, vip: 149000 };
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const mockEmail = `pembeli.${tier}${randomSuffix}@gmail.com`;

    try {
      const res = await fetch('/api/webhook/lynkid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: `LYNK-SIM-${Date.now().toString().slice(-6)}`,
          customer: {
            email: mockEmail,
            name: mockNames[tier]
          },
          product_name: `Jalur Langit - ${TIER_CONFIG[tier].name}`,
          amount: mockPrices[tier],
          status: 'PAID'
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.buyer) {
        addBuyerToWhitelist(data.buyer);
        alert(
          `⚡ SIMULASI WEBHOOK SUKSES!\n\nLynk.id berhasil mengirim data pembayaran secara OTOMATIS ke server:\n` +
          `• Email: ${data.buyer.email}\n` +
          `• Nama: ${data.buyer.name}\n` +
          `• Paket: ${data.buyer.tierLabel}\n\n` +
          `Akun ini sekarang SUDAH BISA LANGSUNG LOGIN di halaman /login tanpa perlu input manual lagi!`
        );
      } else {
        alert('Gagal mengirim simulasi: ' + (data.message || 'Error'));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memanggil endpoint webhook.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const newBuyer: AuthUser = {
      email: newEmail.trim().toLowerCase(),
      name: newName.trim(),
      tier: newTier,
      tierLabel: TIER_CONFIG[newTier].name,
      purchasedAt: new Date().toISOString(),
      orderId: `LYNK-MANUAL-${Date.now().toString().slice(-5)}`
    };

    addBuyerToWhitelist(newBuyer);
    setNewEmail('');
    setNewName('');
    alert(`Alhamdulillah, akses untuk ${newBuyer.email} (${TIER_CONFIG[newTier].name}) berhasil ditambahkan!`);
  };

  const handleExportData = () => {
    const jsonString = JSON.stringify(whitelist, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whitelist-pembeli-lynkid-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics calculation
  const totalBuyers = whitelist.length;
  const starterCount = whitelist.filter(b => b.tier === 'starter').length;
  const ultimateCount = whitelist.filter(b => b.tier === 'ultimate').length;
  const vipCount = whitelist.filter(b => b.tier === 'vip').length;

  const estimatedRevenue = (starterCount * 49000) + (ultimateCount * 89000) + (vipCount * 149000);

  // Filtered buyers (search query + interactive chart bar tier filter)
  const filteredBuyers = whitelist.filter((b) => {
    const matchesSearch =
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      selectedTierFilter === 'all' || b.tier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#08120d] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors p-4 sm:p-6 pb-20 select-none">
      
      {/* Top Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between py-2 border-b border-stone-200 dark:border-emerald-900/60 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            🔐 Owner Control Center
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto space-y-6">

        {/* Security Gate PIN for Admin */}
        {!isAdminUnlocked && (
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-emerald-950/50 border border-stone-200 dark:border-emerald-800 shadow-xl space-y-4 text-center my-12">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Akses Panel Admin Lynk.id
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Masukkan PIN Admin untuk mengelola whitelist lisensi pembeli:
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (Default: 1409)"
                className="w-full text-center px-4 py-3 rounded-2xl bg-stone-50 dark:bg-emerald-900/40 border border-stone-300 dark:border-emerald-700 text-stone-900 dark:text-stone-100 font-mono tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {pinError && (
                <p className="text-xs font-bold text-rose-500">
                  PIN salah. Silakan coba lagi (Hint: 1409).
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Buka Panel Admin</span>
              </button>
            </form>

            <div className="pt-2 border-t border-stone-100 dark:border-emerald-900/40">
              <button
                onClick={() => {
                  loginAsAdmin();
                  router.push('/dashboard');
                }}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>Atau langsung Login sebagai Owner VIP Agung Siswoyo →</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Dashboard Body (Unlocked) */}
        {isAdminUnlocked && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-stone-500">Total Pembeli</span>
                <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                  {totalBuyers} <span className="text-xs font-normal text-stone-400">Akun</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Starter (Rp 49k)</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300">
                  {starterCount}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Ultimate (Rp 89k)</span>
                <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300">
                  {ultimateCount}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">VIP (Rp 149k)</span>
                <div className="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-300">
                  {vipCount}
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-900/10 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Perkiraan Omset Lynk.id:{' '}
                  <span className="text-emerald-700 dark:text-emerald-300 font-black">
                    Rp {estimatedRevenue.toLocaleString('id-ID')}
                  </span>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-900 border border-stone-200 dark:border-emerald-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor JSON</span>
                </button>

                <button
                  onClick={() => {
                    loginAsAdmin();
                    router.push('/dashboard');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Masuk VIP Sebagai Owner</span>
                </button>
              </div>
            </div>

            {/* CHART BAR INTERAKTIF JUMLAH PEMBELIAN PAKET */}
            <PackageSalesBarChart
              buyers={whitelist}
              selectedTierFilter={selectedTierFilter}
              onSelectTierFilter={setSelectedTierFilter}
            />

            {/* 1. KOTAK INTEGRASI WEBHOOK LYNK.ID OTOMATIS */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-900/90 via-teal-900 to-emerald-950 text-white shadow-xl border border-amber-300/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Sistem Otomatis Lynk.id Aktif</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-amber-200">
                    URL Webhook Lynk.id (Integrasi 100% Otomatis)
                  </h3>
                  <p className="text-xs text-emerald-100/80 max-w-xl leading-relaxed">
                    Tempelkan URL ini di <b>Dashboard Lynk.id ➔ Pengaturan ➔ Webhook</b>. Setiap kali pembeli membayar paket di Lynk.id, webhook ini akan langsung memberikan akses secara otomatis tanpa perlu input manual!
                  </p>
                </div>

                <button
                  onClick={handleCopyWebhook}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWebhook ? 'Tersalin ke Clipboard!' : 'Salin URL Webhook'}</span>
                </button>
              </div>

              {/* URL Display */}
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-700/60 font-mono text-xs text-amber-300 break-all select-all flex items-center justify-between">
                <span>{webhookEndpointUrl}</span>
              </div>

              {/* 2. ALAT PENGUJIAN / SIMULASI WEBHOOK LYNK.ID */}
              <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Uji Coba Alur Diagram: Simulasi Pembelian Lynk.id Seketika
                  </span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Klik salah satu tombol di bawah untuk menyimulasikan pembeli baru yang baru saja checkout di Lynk.id. Sistem akan langsung mencatatnya ke database dan email tersebut siap digunakan login:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={() => handleSimulateWebhook('starter')}
                    disabled={isSimulating}
                    className="p-2.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <span>🧪 Tes Beli Starter (49k)</span>
                  </button>

                  <button
                    onClick={() => handleSimulateWebhook('ultimate')}
                    disabled={isSimulating}
                    className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-400/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <span>🧪 Tes Beli Ultimate (89k)</span>
                  </button>

                  <button
                    onClick={() => handleSimulateWebhook('vip')}
                    disabled={isSimulating}
                    className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 border border-purple-400/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <span>🧪 Tes Beli VIP (149k)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Add New Buyer Card (Manual Backup) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Input Manual Cadangan (Backup Darurat)
                  </h3>
                </div>
                <span className="text-[10px] text-stone-400">
                  Gunakan hanya jika pembeli salah ketik email di Lynk.id
                </span>
              </div>

              <form onSubmit={handleAddBuyer} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Email Pembeli Lynk.id</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama.pembeli@gmail.com"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Nama Pembeli</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Fulan / Fulanah"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Paket / Tier Lisensi</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as UserTier)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-stone-100"
                  >
                    <option value="starter">Starter (Rp 49.000)</option>
                    <option value="ultimate">Ultimate Full Bundling (Rp 89.000)</option>
                    <option value="vip">VIP Ultimate + Lab (Rp 149.000)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Beri Akses Pembeli</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Buyer Whitelist Table */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Daftar Pembeli Terdaftar ({filteredBuyers.length})
                  </h3>
                  {selectedTierFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                      <span>Filter: {TIER_CONFIG[selectedTierFilter].name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedTierFilter('all')}
                        className="hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari email atau nama..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-emerald-900/60 text-stone-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Pembeli</th>
                      <th className="py-2.5 px-3">Paket Lisensi</th>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-emerald-900/40">
                    {filteredBuyers.map((buyer) => (
                      <tr key={buyer.email} className="hover:bg-stone-50/60 dark:hover:bg-emerald-900/20 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {buyer.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {buyer.email}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={buyer.tier}
                            onChange={(e) => updateBuyerTier(buyer.email, e.target.value as UserTier)}
                            className="px-2 py-1 rounded-lg border text-xs font-bold bg-white dark:bg-emerald-950 border-stone-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200"
                          >
                            <option value="starter">Starter (Rp 49k)</option>
                            <option value="ultimate">Ultimate (Rp 89k)</option>
                            <option value="vip">VIP (Rp 149k)</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-stone-500">
                          {buyer.orderId}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus akses untuk ${buyer.email}?`)) {
                                removeBuyerFromWhitelist(buyer.email);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            title="Cabut Akses"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
