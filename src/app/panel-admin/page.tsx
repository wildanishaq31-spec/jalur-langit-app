'use client';

import React, { useState, useEffect } from 'react';
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
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Activity,
  LayoutDashboard,
  Webhook,
  Map,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Layers,
  Moon,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { decryptPassword } from '@/utils/cryptoUtils';
import { UserTier, TIER_CONFIG, AuthUser } from '@/types/auth';
import PackageSalesBarChart from '@/components/admin/PackageSalesBarChart';
import ActiveUsersCard, { ActivityFilterType } from '@/components/admin/ActiveUsersCard';

type CMSMenuId = 
  | 'overview' 
  | 'presence' 
  | 'buyers' 
  | 'webhook' 
  | 'add-buyer' 
  | 'roadmap' 
  | 'admin-auth'
  | 'settings'
  | 'all';

function formatLastActive(isoString?: string, baseTime = 0): { label: string; status: 'online' | 'today' | 'offline' } {
  if (!isoString) return { label: 'Belum pernah login', status: 'offline' };
  const diff = (baseTime || 0) - new Date(isoString).getTime();
  if (diff < 0) return { label: 'Online Sekarang', status: 'online' };
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (3600 * 1000));
  const days = Math.floor(diff / (24 * 3600 * 1000));

  if (minutes < 15) {
    return { label: 'Online Sekarang', status: 'online' };
  }
  if (minutes < 60) {
    return { label: `${minutes}m lalu`, status: 'today' };
  }
  if (hours < 24) {
    return { label: `${hours} jam lalu`, status: 'today' };
  }
  if (days === 1) {
    return { label: 'Kemarin', status: 'offline' };
  }
  return { label: `${days} hari lalu`, status: 'offline' };
}

export default function PanelAdminPage() {
  const router = useRouter();
  const { 
    whitelist, 
    addBuyerToWhitelist, 
    removeBuyerFromWhitelist, 
    updateBuyerTier, 
    loginAsAdmin,
    adminCredentials,
    updateAdminCredentials,
    resetAdminCredentials,
    verifyAdminLogin
  } = useAuthStore();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  
  // 3-Faktor Admin Login States (Email, Password, PIN)
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<'email' | 'password' | 'pin' | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Settings Tab Credentials State (Pengaturan Email, Password, PIN)
  const [settingEmail, setSettingEmail] = useState('');
  const [settingPassword, setSettingPassword] = useState('');
  const [settingPasswordConfirm, setSettingPasswordConfirm] = useState('');
  const [settingPin, setSettingPin] = useState('');
  const [settingPinConfirm, setSettingPinConfirm] = useState('');
  const [showSettingPassword, setShowSettingPassword] = useState(false);
  const [showSettingPin, setShowSettingPin] = useState(false);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [settingsSaveError, setSettingsSaveError] = useState<string | null>(null);

  // Live Tester States
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [testPin, setTestPin] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // CMS Navigation State
  const [activeMenu, setActiveMenu] = useState<CMSMenuId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Form states for adding new buyer (manual backup)
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState<UserTier>('ultimate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<UserTier | 'all'>('all');
  const [activityFilter, setActivityFilter] = useState<ActivityFilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (adminCredentials) {
      setSettingEmail(adminCredentials.email || 'agung.siswoyo14@gmail.com');
      const decryptedPwd = decryptPassword(adminCredentials.password || 'AdminJalurLangit2026!');
      setSettingPassword(decryptedPwd);
      setSettingPasswordConfirm(decryptedPwd);
      setSettingPin(adminCredentials.pin || '1409');
      setSettingPinConfirm(adminCredentials.pin || '1409');
      
      // Default live tester values
      setTestEmail(adminCredentials.email || 'agung.siswoyo14@gmail.com');
      setTestPassword(decryptedPwd);
      setTestPin(adminCredentials.pin || '1409');
    }
  }, [adminCredentials]);

  const webhookEndpointUrl = 'https://jalur-langit-app.vercel.app/api/webhook/lynkid';

  // Verifikasi 3 Faktor: Email + Password + PIN Admin
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);
    setErrorField(null);

    const result = verifyAdminLogin(adminEmailInput, adminPasswordInput, adminPinInput);

    if (result.success) {
      setIsAdminUnlocked(true);
      setLoginError(null);
      setErrorField(null);
    } else {
      setLoginError(result.errorMessage || 'Kredensial admin tidak valid.');
      setErrorField(result.errorType || null);
    }
    setIsSubmittingLogin(false);
  };

  const handleSaveAdminSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveError(null);

    const emailTrimmed = settingEmail.trim().toLowerCase();
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setSettingsSaveError('Email admin tidak valid. Harus mengandung format email yang benar.');
      return;
    }

    if (!settingPassword || settingPassword.length < 4) {
      setSettingsSaveError('Password admin minimal 4 karakter.');
      return;
    }

    if (settingPasswordConfirm && settingPassword !== settingPasswordConfirm) {
      setSettingsSaveError('Password baru dan Konfirmasi Password tidak cocok.');
      return;
    }

    const pinTrimmed = settingPin.trim();
    if (!pinTrimmed || pinTrimmed.length < 4) {
      setSettingsSaveError('PIN keamanan harus berupa angka minimal 4 digit.');
      return;
    }

    if (settingPinConfirm && pinTrimmed !== settingPinConfirm.trim()) {
      setSettingsSaveError('PIN baru dan Konfirmasi PIN tidak cocok.');
      return;
    }

    updateAdminCredentials({
      email: emailTrimmed,
      password: settingPassword.trim(),
      pin: pinTrimmed,
    });

    setTestEmail(emailTrimmed);
    setTestPassword(settingPassword.trim());
    setTestPin(pinTrimmed);

    setSettingsSaveSuccess(true);
    setSettingsSaveError(null);
    setTimeout(() => setSettingsSaveSuccess(false), 5000);
  };

  const handleResetCredentialsToDefault = () => {
    if (window.confirm('Yakin ingin mereset kredensial admin ke pengaturan default bawaan?')) {
      resetAdminCredentials();
      setSettingEmail('agung.siswoyo14@gmail.com');
      setSettingPassword('AdminJalurLangit2026!');
      setSettingPasswordConfirm('AdminJalurLangit2026!');
      setSettingPin('1409');
      setSettingPinConfirm('1409');
      setTestEmail('agung.siswoyo14@gmail.com');
      setTestPassword('AdminJalurLangit2026!');
      setTestPin('1409');
      setTestResult(null);
      setSettingsSaveSuccess(true);
      setSettingsSaveError(null);
      setTimeout(() => setSettingsSaveSuccess(false), 4000);
    }
  };

  const handleTestCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyAdminLogin(testEmail, testPassword, testPin);
    if (res.success) {
      setTestResult({
        success: true,
        message: '✓ Berhasil! Kredensial valid dan siap digunakan untuk login CMS.'
      });
    } else {
      setTestResult({
        success: false,
        message: `✗ Gagal: ${res.errorMessage || 'Kredensial tidak cocok.'}`
      });
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
      orderId: `LYNK-MANUAL-${Date.now().toString().slice(-5)}`,
      lastActiveAt: new Date().toISOString()
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

  // Active Users calculations
  const referenceTime = now || 1763520000000;
  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const onlineCount = whitelist.filter((b) => {
    if (!b.lastActiveAt) return false;
    const diff = referenceTime - new Date(b.lastActiveAt).getTime();
    return diff >= 0 && diff <= FIFTEEN_MINUTES;
  }).length;

  const todayCount = whitelist.filter((b) => {
    if (!b.lastActiveAt) return false;
    const diff = referenceTime - new Date(b.lastActiveAt).getTime();
    return diff >= 0 && diff <= ONE_DAY;
  }).length;

  // Filtered buyers (search query + tier filter + activity presence filter)
  const filteredBuyers = whitelist.filter((b) => {
    const matchesSearch =
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      selectedTierFilter === 'all' || b.tier === selectedTierFilter;

    let matchesActivity = true;
    if (activityFilter === 'online') {
      if (!b.lastActiveAt) matchesActivity = false;
      else {
        const diff = referenceTime - new Date(b.lastActiveAt).getTime();
        matchesActivity = diff >= 0 && diff <= FIFTEEN_MINUTES;
      }
    } else if (activityFilter === 'today') {
      if (!b.lastActiveAt) matchesActivity = false;
      else {
        const diff = referenceTime - new Date(b.lastActiveAt).getTime();
        matchesActivity = diff >= 0 && diff <= ONE_DAY;
      }
    }

    return matchesSearch && matchesTier && matchesActivity;
  });

  // Pagination calculation
  const totalItems = filteredBuyers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedBuyers = filteredBuyers.slice(startIndex, endIndex);

  const handleSelectTierFilter = (tier: UserTier | 'all') => {
    setSelectedTierFilter(tier);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Menu items list for CMS Sidebar
  const CMS_MENU_ITEMS: Array<{
    id: CMSMenuId;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
    badgeColor?: string;
    group: 'UTAMA' | 'MANAJEMEN LISENSI' | 'SISTEM & EKSPANSI';
  }> = [
    { id: 'overview', label: 'Ringkasan & Metrik', icon: LayoutDashboard, group: 'UTAMA' },
    { 
      id: 'presence', 
      label: 'User Aktif (Presence)', 
      icon: Activity, 
      badge: `${onlineCount} Online`, 
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
      group: 'UTAMA' 
    },
    { 
      id: 'buyers', 
      label: 'Daftar Pembeli', 
      icon: Users, 
      badge: `${totalBuyers}`, 
      group: 'MANAJEMEN LISENSI' 
    },
    { id: 'add-buyer', label: 'Tambah Akses Manual', icon: UserPlus, group: 'MANAJEMEN LISENSI' },
    { 
      id: 'webhook', 
      label: 'Webhook Lynk.id', 
      icon: Webhook, 
      badge: 'Auto ⚡', 
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
      group: 'SISTEM & EKSPANSI' 
    },
    { 
      id: 'roadmap', 
      label: 'Roadmap & Lab Fitur', 
      icon: Map, 
      badge: '5 Lab', 
      group: 'SISTEM & EKSPANSI' 
    },
    { 
      id: 'admin-auth', 
      label: 'Pengaturan Login Admin', 
      icon: KeyRound, 
      badge: 'Email, Pass, PIN', 
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/30', 
      group: 'SISTEM & EKSPANSI' 
    },
    { id: 'settings', label: 'Pengaturan & Backup', icon: Settings, group: 'SISTEM & EKSPANSI' },
    { id: 'all', label: 'Semua Tampilan (Full)', icon: Layers, group: 'SISTEM & EKSPANSI' }
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#08120d] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors select-none">
      
      {/* 1. SECURITY GATE 3-FAKTOR: EMAIL + PASSWORD + PIN UNTUK ADMIN */}
      {!isAdminUnlocked && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-emerald-950/60 border border-stone-200 dark:border-emerald-800 shadow-2xl space-y-4">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <ShieldCheck className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Super Admin Authentication
                </span>
                <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                  Login Panel Admin CMS
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Masukkan Email Admin, Password, dan PIN untuk membuka panel.
                </p>
              </div>
            </div>

            {/* Error Notification Alert */}
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Autentikasi Gagal:</span>
                  <p className="leading-snug text-[11px]">{loginError}</p>
                </div>
              </div>
            )}

            {/* Form 3 Faktor: Email + Password + PIN */}
            <form onSubmit={handleAdminLogin} className="space-y-3">
              {/* Field 1: Email Admin */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Email Admin</span>
                  </span>
                  {errorField === 'email' && <span className="text-[10px] text-rose-500 font-semibold">Periksa Email</span>}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={adminEmailInput}
                    onChange={(e) => {
                      setAdminEmailInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder=""
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 ${
                      errorField === 'email'
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-stone-300 dark:border-emerald-700 focus:ring-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Field 2: Password Admin */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Password Admin</span>
                  </span>
                  {errorField === 'password' && <span className="text-[10px] text-rose-500 font-semibold">Password Salah</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Masukkan Password Admin"
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 ${
                      errorField === 'password'
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-stone-300 dark:border-emerald-700 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 3: PIN Keamanan Admin */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>PIN Keamanan Admin (4-6 Angka)</span>
                  </span>
                  {errorField === 'pin' && <span className="text-[10px] text-rose-500 font-semibold">PIN Salah</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    required
                    value={adminPinInput}
                    onChange={(e) => {
                      setAdminPinInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Masukkan PIN (Contoh: 1409)"
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border font-mono tracking-widest text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 ${
                      errorField === 'pin'
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-stone-300 dark:border-emerald-700 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    title={showPin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full mt-2 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verifikasi &amp; Buka Panel Admin</span>
              </button>
            </form>

            {/* Shortcut ke Dashboard */}
            <div className="pt-2 border-t border-stone-100 dark:border-emerald-900/40 text-center">
              <Link
                href="/dashboard"
                className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Jalur Langit</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. CMS DASHBOARD LAYOUT (UNLOCKED) */}
      {isAdminUnlocked && (
        <div className="flex min-h-screen">
          
          {/* Mobile Sidebar Overlay Backdrop */}
          {isMobileSidebarOpen && (
            <div 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs animate-fade-in"
            />
          )}

          {/* ======================= SIDEBAR CMS ======================= */}
          <aside className={`
            fixed lg:sticky top-0 left-0 h-screen w-64 sm:w-72 bg-white dark:bg-[#07150f] border-r border-stone-200 dark:border-emerald-900/60 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}>
            
            {/* Sidebar Top: Logo Brand + Admin Identity */}
            <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-md border border-amber-300/40">
                    <Moon className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black font-serif text-stone-900 dark:text-stone-100 leading-tight">
                      Jalur Langit
                    </h1>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      CMS Control Center
                    </span>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Owner Profile Card */}
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-emerald-950/50 border border-stone-200/80 dark:border-emerald-900/60 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    Agung Siswoyo
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Super Admin / Owner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Middle: Navigation Menu Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
              
              {/* Group 1: UTAMA */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-emerald-500/70">
                  Ringkasan & Aktivitas
                </div>
                {CMS_MENU_ITEMS.filter(m => m.group === 'UTAMA').map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-stone-100 dark:bg-emerald-900 text-stone-700 dark:text-stone-200'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Group 2: MANAJEMEN LISENSI */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-emerald-500/70">
                  Manajemen Pembeli
                </div>
                {CMS_MENU_ITEMS.filter(m => m.group === 'MANAJEMEN LISENSI').map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 dark:bg-emerald-900 text-stone-700 dark:text-stone-200">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Group 3: SISTEM & EKSPANSI */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-emerald-500/70">
                  Sistem & Pengembangan
                </div>
                {CMS_MENU_ITEMS.filter(m => m.group === 'SISTEM & EKSPANSI').map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-stone-100 dark:bg-emerald-900 text-stone-700 dark:text-stone-200'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </nav>

            {/* Sidebar Bottom: Quick Actions & Log Out */}
            <div className="p-3 border-t border-stone-100 dark:border-emerald-900/40 space-y-1.5 text-xs">
              <Link
                href="/dashboard"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-emerald-950 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Aplikasi PWA</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsAdminUnlocked(false);
                  setAdminPasswordInput('');
                  setAdminPinInput('');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Kunci Panel Admin</span>
              </button>
            </div>

          </aside>

          {/* ======================= MAIN CONTENT CMS ======================= */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Topbar Header CMS */}
            <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#08120d]/90 backdrop-blur-md border-b border-stone-200 dark:border-emerald-900/60 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              
              <div className="flex items-center gap-3">
                {/* Mobile Hamburger Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 rounded-xl border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 lg:hidden cursor-pointer"
                  title="Buka Menu Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Jalur Langit CMS</span>
                    <span>/</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">
                      {CMS_MENU_ITEMS.find(m => m.id === activeMenu)?.label || 'Dashboard'}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 leading-tight">
                    {activeMenu === 'overview' && 'Ringkasan Eksekutif & Statistik Penjualan'}
                    {activeMenu === 'presence' && 'Pemantau Real-Time Pengguna Aktif'}
                    {activeMenu === 'buyers' && 'Kelola Daftar Pembeli & Lisensi Lynk.id'}
                    {activeMenu === 'webhook' && 'Integrasi Webhook & Simulator Lynk.id'}
                    {activeMenu === 'add-buyer' && 'Tambah Akses Pembeli Cadangan'}
                    {activeMenu === 'roadmap' && 'Roadmap Fitur & Pengembangan Lab'}
                    {activeMenu === 'admin-auth' && 'Pengaturan Kredensial Login Admin (Email, Password & PIN)'}
                    {activeMenu === 'settings' && 'Pengaturan Keamanan & Backup Data'}
                    {activeMenu === 'all' && 'Semua Modul CMS Panel Admin'}
                  </h2>
                </div>
              </div>

              {/* Topbar Right Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMenu('admin-auth')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'admin-auth'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100'
                  }`}
                  title="Pengaturan Email, Password, & PIN Login Admin"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                  <span className="hidden sm:inline">Setting Login Admin</span>
                </button>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300/70 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Webhook Aktif</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    loginAsAdmin();
                    router.push('/dashboard');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Masuk VIP Owner</span>
                </button>
              </div>

            </header>

            {/* Main Scrollable View Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto">
              
              {/* ================= SECTION: OVERVIEW (RINGKASAN & STATISTIK) ================= */}
              {(activeMenu === 'overview' || activeMenu === 'all') && (
                <section className="space-y-6 animate-fade-in">
                  
                  {/* Top Stat Cards (5 Kolom Lengkap) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                    <div 
                      onClick={() => setActiveMenu('buyers')}
                      className="p-4 rounded-2xl bg-white dark:bg-emerald-950/40 border border-stone-200 dark:border-emerald-800/70 shadow-xs space-y-1 cursor-pointer hover:border-emerald-500 transition-all"
                    >
                      <span className="text-[11px] font-bold text-stone-500">Total Pembeli</span>
                      <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                        {totalBuyers} <span className="text-xs font-normal text-stone-400">Akun</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveMenu('presence')}
                      className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 shadow-xs space-y-1 cursor-pointer hover:scale-[1.02] transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          User Aktif
                        </span>
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-200">
                        {onlineCount}{' '}
                        <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                          Online ({todayCount} Hari Ini)
                        </span>
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
                        type="button"
                        onClick={handleExportData}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-900 border border-stone-200 dark:border-emerald-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Ekspor JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMenu('webhook')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-stone-900" />
                        <span>Buka Simulator Webhook</span>
                      </button>
                    </div>
                  </div>

                  {/* CHART BAR INTERAKTIF JUMLAH PEMBELIAN PAKET */}
                  <PackageSalesBarChart
                    buyers={whitelist}
                    selectedTierFilter={selectedTierFilter}
                    onSelectTierFilter={handleSelectTierFilter}
                  />

                </section>
              )}

              {/* ================= SECTION: PRESENCE (USER AKTIF REAL-TIME) ================= */}
              {(activeMenu === 'presence' || activeMenu === 'all') && (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                        Live User Presence & Keaktifan Harian
                      </h3>
                      <p className="text-xs text-stone-500">
                        Pantau pembeli yang sedang membuka aplikasi dan pelacakan ritme ibadah istiqomah.
                      </p>
                    </div>

                    {activeMenu !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setActiveMenu('buyers')}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Buka Daftar Lengkap Pembeli →
                      </button>
                    )}
                  </div>

                  {/* Hero Card Pemantau User Aktif */}
                  <ActiveUsersCard
                    buyers={whitelist}
                    activeFilter={activityFilter}
                    onSelectFilter={(f) => {
                      setActivityFilter(f);
                      setCurrentPage(1);
                    }}
                  />
                </section>
              )}

              {/* ================= SECTION: BUYERS (DAFTAR PEMBELI & LISENSI) ================= */}
              {(activeMenu === 'buyers' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
                  
                  {/* Buyer Whitelist Table Card */}
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
                              onClick={() => handleSelectTierFilter('all')}
                              className="hover:text-rose-600 font-black ml-0.5 cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        )}
                        {activityFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                            <span>Status: {activityFilter === 'online' ? '🟢 Online Sekarang' : '📅 Aktif Hari Ini'}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActivityFilter('all');
                                setCurrentPage(1);
                              }}
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
                          onChange={(e) => handleSearchChange(e.target.value)}
                          placeholder="Cari email, nama, order ID..."
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
                            <th className="py-2.5 px-3">Aktivitas Terakhir</th>
                            <th className="py-2.5 px-3">Paket Lisensi</th>
                            <th className="py-2.5 px-3">Order ID</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-emerald-900/40">
                          {paginatedBuyers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-stone-400 italic">
                                Tidak ada pembeli yang sesuai dengan kriteria pencarian atau filter yang dipilih.
                              </td>
                            </tr>
                          ) : (
                            paginatedBuyers.map((buyer) => {
                              const activity = formatLastActive(buyer.lastActiveAt, referenceTime);
                              return (
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
                                    {activity.status === 'online' ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Online Sekarang
                                      </span>
                                    ) : activity.status === 'today' ? (
                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                        <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                        {activity.label}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-900/60 text-stone-500 border border-stone-200 dark:border-stone-800">
                                        {activity.label}
                                      </span>
                                    )}
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
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Hapus akses untuk ${buyer.email}?`)) {
                                          removeBuyerFromWhitelist(buyer.email);
                                        }
                                      }}
                                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                                      title="Cabut Akses"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="pt-4 border-t border-stone-100 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      
                      {/* Left: Range Info & Page Size Selector */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-stone-500 dark:text-stone-400 font-medium">
                          {totalItems > 0 ? (
                            <>Menampilkan <b>{startIndex + 1} - {endIndex}</b> dari <b>{totalItems}</b> pembeli</>
                          ) : (
                            '0 pembeli ditemukan'
                          )}
                        </span>

                        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                          <span className="text-stone-400">| Per halaman:</span>
                          <select
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="px-2 py-1 rounded-lg bg-stone-50 dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                      </div>

                      {/* Right: Page Navigation Buttons */}
                      {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            disabled={safeCurrentPage === 1}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-600 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                            title="Halaman Pertama"
                          >
                            <ChevronsLeft className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={safeCurrentPage === 1}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-600 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                            title="Halaman Sebelumnya"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-1 px-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter((p) => {
                                if (totalPages <= 7) return true;
                                return (
                                  p === 1 ||
                                  p === totalPages ||
                                  Math.abs(p - safeCurrentPage) <= 1
                                );
                              })
                              .map((p, idx, arr) => {
                                const prevPage = arr[idx - 1];
                                const hasGap = prevPage && p - prevPage > 1;

                                return (
                                  <React.Fragment key={p}>
                                    {hasGap && (
                                      <span className="px-1 text-stone-400 select-none">...</span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setCurrentPage(p)}
                                      className={`min-w-7 h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        safeCurrentPage === p
                                          ? 'bg-emerald-800 text-white shadow-xs'
                                          : 'border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                                      }`}
                                    >
                                      {p}
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                          </div>

                          <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={safeCurrentPage === totalPages}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-600 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                            title="Halaman Berikutnya"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={safeCurrentPage === totalPages}
                            className="p-1.5 rounded-lg border border-stone-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-stone-600 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                            title="Halaman Terakhir"
                          >
                            <ChevronsRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                    </div>

                  </div>

                </section>
              )}

              {/* ================= SECTION: WEBHOOK LYNK.ID & OTOMASI ================= */}
              {(activeMenu === 'webhook' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
                  
                  {/* Kotak Integrasi Webhook Lynk.id Otomatis */}
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
                        type="button"
                        onClick={handleCopyWebhook}
                        className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        {copiedWebhook ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedWebhook ? 'Tersalin ke Clipboard!' : 'Salin URL Webhook'}</span>
                      </button>
                    </div>

                    {/* URL Display */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-700/60 font-mono text-xs text-amber-300 break-all select-all flex items-center justify-between">
                      <span>{webhookEndpointUrl}</span>
                    </div>

                    {/* Simulator Webhook Lynk.id */}
                    <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                          Uji Coba Alur Diagram: Simulasi Pembelian Lynk.id Seketika
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300">
                        Klik tombol di bawah untuk menyimulasikan pembeli yang checkout di Lynk.id. Server otomatis memproses dan mencatatnya ke whitelist:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSimulateWebhook('starter')}
                          disabled={isSimulating}
                          className="p-2.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <span>🧪 Tes Beli Starter (49k)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateWebhook('ultimate')}
                          disabled={isSimulating}
                          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 border border-amber-400/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <span>🧪 Tes Beli Ultimate (89k)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulateWebhook('vip')}
                          disabled={isSimulating}
                          className="p-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 border border-purple-400/70 text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <span>🧪 Tes Beli VIP (149k)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </section>
              )}

              {/* ================= SECTION: ADD BUYER MANUAL (INPUT CADANGAN) ================= */}
              {(activeMenu === 'add-buyer' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
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
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Beri Akses Pembeli</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {/* ================= SECTION: ROADMAP & LAB FITUR ================= */}
              {(activeMenu === 'roadmap' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 text-[10px] font-bold uppercase">
                          <Map className="w-3 h-3" />
                          <span>Roadmap Lab Fitur Aplikasi</span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          Pengembangan Fitur Masa Depan yang Siap Ditambahkan
                        </h3>
                      </div>

                      <Link
                        href="/roadmap"
                        className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Halaman Publik Roadmap</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">AI Asisten Motivasi Jalur Langit</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">Dalam Desain</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Asisten cerdas pendamping doa dan muhasabah berbasis Al-Quran & Sunnah.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">Sedekah Subuh Tracker Terpadu</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">Prioritas Tinggi</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Pencatatan nominal tabungan sedekah subuh harian dengan kalkulasi otomatis.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">Audio Murottal & Dzikir Offline</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">Direncanakan</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Putar audio dzikir pagi petang dan surat pilihan langsung tanpa kuota.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900 dark:text-stone-100">Broadcast Pesan Semangat ke User</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800">Ide Lab</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Admin bisa mengirimkan pesan mutiara hikmah harian ke dashboard semua pembeli.</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ================= SECTION: PENGATURAN KREDENSIAL LOGIN ADMIN (EMAIL, PASSWORD, PIN) ================= */}
              {(activeMenu === 'admin-auth' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-6">
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-emerald-900/40">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 shadow-xs">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold uppercase tracking-wider">
                              Autentikasi 3-Faktor
                            </span>
                            <span className="text-[11px] text-stone-400 font-medium">CMS Security Gate</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">
                            Pengaturan Kredensial Login Admin
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Atur alamat Email Admin, Password baru, dan PIN 4–6 digit untuk akses Panel Admin CMS.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetCredentialsToDefault}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-emerald-800 hover:bg-stone-100 dark:hover:bg-emerald-900/50 text-stone-600 dark:text-stone-300 text-xs font-bold transition-all self-start sm:self-center cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset ke Default Bawaan</span>
                      </button>
                    </div>

                    {/* Status Kredensial Aktif Saat Ini */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Admin Aktif</span>
                        </span>
                        <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 truncate">
                          {adminCredentials?.email || 'agung.siswoyo14@gmail.com'}
                        </div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">✓ Terverifikasi Utama</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-900/20 border border-teal-200/80 dark:border-teal-800/60 space-y-1">
                        <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Status Password</span>
                        </span>
                        <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                          ••••••••••••
                        </div>
                        <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">✓ Terlindungi Enkripsi</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Status PIN Keamanan</span>
                        </span>
                        <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 font-mono tracking-widest">
                          •••• ({adminCredentials?.pin ? adminCredentials.pin.length : 4} Digit)
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">✓ PIN Aktif Digunakan</span>
                      </div>
                    </div>

                    {/* Alert Notifikasi Sukses / Error */}
                    {settingsSaveSuccess && (
                      <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span>Kredensial login admin (Email, Password, &amp; PIN) berhasil disimpan!</span>
                          <p className="text-[11px] font-normal text-emerald-800 dark:text-emerald-200 mt-0.5">
                            Gunakan kredensial baru ini saat membuka Panel Admin berikutnya.
                          </p>
                        </div>
                      </div>
                    )}

                    {settingsSaveError && (
                      <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2.5 animate-shake shadow-xs">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{settingsSaveError}</span>
                      </div>
                    )}

                    {/* Form Pengaturan Kredensial Baru */}
                    <form onSubmit={handleSaveAdminSettings} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* 1. Email Admin */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            <span>1. Alamat Email Admin *</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={settingEmail}
                            onChange={(e) => setSettingEmail(e.target.value)}
                            placeholder=""
                            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-300 dark:border-emerald-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                          />
                          <p className="text-[10px] text-stone-500">
                            Email ini akan diminta pada langkah pertama verifikasi login CMS Panel Admin.
                          </p>
                        </div>

                        {/* 2. Password Admin Baru */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Lock className="w-4 h-4 text-emerald-600" />
                              <span>2. Password Admin Baru *</span>
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingPassword ? 'text' : 'password'}
                              required
                              value={settingPassword}
                              onChange={(e) => setSettingPassword(e.target.value)}
                              placeholder="Masukkan password admin baru"
                              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-300 dark:border-emerald-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSettingPassword(!showSettingPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              title={showSettingPassword ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {showSettingPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* 2b. Konfirmasi Password Admin Baru */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            <span>Konfirmasi Password Baru *</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingPassword ? 'text' : 'password'}
                              required
                              value={settingPasswordConfirm}
                              onChange={(e) => setSettingPasswordConfirm(e.target.value)}
                              placeholder="Ketik ulang password baru"
                              className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 ${
                                settingPassword && settingPasswordConfirm && settingPassword !== settingPasswordConfirm
                                  ? 'border-rose-400 focus:ring-rose-400'
                                  : 'border-stone-300 dark:border-emerald-700 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                          {settingPassword && settingPasswordConfirm && settingPassword !== settingPasswordConfirm && (
                            <p className="text-[10px] text-rose-500 font-semibold">Password belum cocok</p>
                          )}
                        </div>

                        {/* 3. PIN Keamanan Admin Baru */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <KeyRound className="w-4 h-4 text-emerald-600" />
                              <span>3. PIN Keamanan Baru (Format Teks/Angka, Contoh: 1409) *</span>
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingPin ? 'text' : 'password'}
                              inputMode="numeric"
                              required
                              value={settingPin}
                              onChange={(e) => setSettingPin(e.target.value)}
                              placeholder="Contoh: 1409"
                              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-300 dark:border-emerald-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSettingPin(!showSettingPin)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                              title={showSettingPin ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {showSettingPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* 3b. Konfirmasi PIN Baru */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <KeyRound className="w-4 h-4 text-emerald-600" />
                            <span>Konfirmasi PIN Baru *</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showSettingPin ? 'text' : 'password'}
                              inputMode="numeric"
                              required
                              value={settingPinConfirm}
                              onChange={(e) => setSettingPinConfirm(e.target.value)}
                              placeholder="Ketik ulang PIN baru (Contoh: 1409)"
                              className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-emerald-900/30 border text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-mono tracking-widest focus:outline-none focus:ring-2 ${
                                settingPin && settingPinConfirm && settingPin.trim() !== settingPinConfirm.trim()
                                  ? 'border-rose-400 focus:ring-rose-400'
                                  : 'border-stone-300 dark:border-emerald-700 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                          {settingPin && settingPinConfirm && settingPin.trim() !== settingPinConfirm.trim() && (
                            <p className="text-[10px] text-rose-500 font-semibold">PIN belum cocok</p>
                          )}
                        </div>

                      </div>

                      {/* Tombol Simpan */}
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan Pengaturan Kredensial Admin</span>
                        </button>
                      </div>
                    </form>

                    {/* LIVE CREDENTIAL TESTER BOX */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-teal-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-amber-300/70 dark:border-amber-700/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          Uji Coba Validitas Kredensial (Live Tester)
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        Cek apakah email, password, dan PIN yang baru saja Anda set dapat membuka autentikasi secara benar sebelum Anda mengunci panel.
                      </p>

                      <form onSubmit={handleTestCredentials} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                        <div>
                          <input
                            type="email"
                            required
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="Email uji coba"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-stone-300 dark:border-emerald-700 text-xs text-stone-900 dark:text-stone-100"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            required
                            value={testPassword}
                            onChange={(e) => setTestPassword(e.target.value)}
                            placeholder="Password uji coba"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-stone-300 dark:border-emerald-700 text-xs text-stone-900 dark:text-stone-100"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            inputMode="numeric"
                            required
                            value={testPin}
                            onChange={(e) => setTestPin(e.target.value)}
                            placeholder="PIN uji coba"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-stone-300 dark:border-emerald-700 text-xs font-mono text-stone-900 dark:text-stone-100"
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="w-full py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Tes Login</span>
                          </button>
                        </div>
                      </form>

                      {testResult && (
                        <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 animate-fade-in ${
                          testResult.success
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                        }`}>
                          {testResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                          <span>{testResult.message}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </section>
              )}

              {/* ================= SECTION: SETTINGS (PENGATURAN & KEAMANAN) ================= */}
              {(activeMenu === 'settings' || activeMenu === 'all') && (
                <section className="space-y-4 animate-fade-in">
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Pengaturan CMS & Keamanan Sistem
                      </h3>
                    </div>

                    {/* KELOLA KREDENSIAL LOGIN ADMIN (EMAIL, PASSWORD, PIN) QUICK CARD */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                            Pengaturan Kredensial Login Admin (Email, Password, PIN)
                          </span>
                        </div>
                        <p className="text-stone-500 text-[11px] leading-relaxed">
                          Email terdaftar saat ini: <b>{adminCredentials?.email || 'agung.siswoyo14@gmail.com'}</b>. Klik tombol di samping untuk mengubah email, password, atau PIN login admin.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveMenu('admin-auth')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Buka Setting Kredensial</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-2">
                        <span className="font-bold text-stone-800 dark:text-stone-200">Sesi Keamanan Admin</span>
                        <p className="text-stone-500 text-[11px] leading-relaxed">
                          Panel terlindungi 3 lapis (Email, Password, dan PIN). Klik tombol di bawah untuk mengunci sesi admin dan kembali ke gerbang login.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminUnlocked(false);
                            setAdminPasswordInput('');
                            setAdminPinInput('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          Kunci Panel Sekarang
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 space-y-2">
                        <span className="font-bold text-stone-800 dark:text-stone-200">Cadangan &amp; Pemulihan Data</span>
                        <p className="text-stone-500 text-[11px] leading-relaxed">
                          Unduh seluruh data daftar pembeli, order ID, dan tanggal pembelian dalam format JSON untuk arsip berkala.
                        </p>
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Backup JSON ({totalBuyers} Akun)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            </main>

          </div>

        </div>
      )}

    </div>
  );
}
