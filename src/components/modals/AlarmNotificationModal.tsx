'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Bell, 
  BellRing, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  RefreshCw, 
  Compass, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { TimeCategory } from '@/types';
import { playGentleChime } from '@/utils/audioAlert';
import { INDONESIAN_REFERENCE_CITIES } from '@/utils/prayerTimeService';

interface AlarmNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_LABELS: { category: TimeCategory; label: string; icon: string; desc: string }[] = [
  {
    category: 'dini_hari',
    label: 'Dini Hari (Tahajjud & Sahur)',
    icon: '🌙',
    desc: 'Pengingat sepertiga malam untuk Sholat Tahajjud & doa hajat',
  },
  {
    category: 'subuh',
    label: 'Subuh & Sedekah Subuh',
    icon: '🌅',
    desc: 'Pengingat Qobliyah Subuh, Sholat Subuh, & Sedekah fajar',
  },
  {
    category: 'dhuha',
    label: 'Dhuha & Ikhtiar Siang',
    icon: '☀️',
    desc: 'Pengingat Sholat Dhuha pembuka rezeki',
  },
  {
    category: 'petang',
    label: 'Petang (Ashar & QS. Al-Waqi\'ah)',
    icon: '🌇',
    desc: 'Pengingat wirid sore dan membaca surat kelapangan rezeki',
  },
  {
    category: 'malam',
    label: 'Malam (QS. Al-Mulk & Sholawat)',
    icon: '🌌',
    desc: 'Pengingat surat pelindung kubur & istighfar sebelum tidur',
  },
];

export const AlarmNotificationModal: React.FC<AlarmNotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    notificationTimes,
    userLocation,
    isLocationLoading,
    syncGPSPrayerTimes,
    setCityManually,
    setNotificationsEnabled,
    setNotificationTime,
  } = useJalurLangitStore();

  const [mounted, setMounted] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, [setNotificationsEnabled]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionState(result);
        if (result === 'granted') {
          setNotificationsEnabled(true);
          sendTestNotification(
            'Notifikasi Berhasil Diaktifkan! 🔔', 
            'Jalur Langit akan mengingatkan Anda saat masuk jadwal amalan otomatis di bilah HP.'
          );
        } else {
          setNotificationsEnabled(false);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleSyncGPS = async () => {
    setSyncFeedback(null);
    const success = await syncGPSPrayerTimes();
    if (success) {
      setSyncFeedback('✅ Berhasil membaca GPS HP! Jam amalan & sholat telah disesuaikan.');
    } else {
      setSyncFeedback('ℹ️ Menggunakan jadwal sholat akurat wilayah Anda.');
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const sendTestNotification = (
    title = 'Pengingat Waktu Amalan 🌙', 
    body = 'Sudah masuk waktu amalan. Luangkan beberapa menit untuk bermunajat kepada Allah.'
  ) => {
    playGentleChime();

    const options: NotificationOptions & { vibrate?: number[] } = {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'jalur-langit-test',
      data: { url: '/amalan' },
    };

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready
            .then((reg) => {
              reg.showNotification(title, options);
            })
            .catch(() => {
              new Notification(title, options);
            });
        } else {
          new Notification(title, options);
        }
        setTestSentMessage('✅ Notifikasi terkirim ke bilah notifikasi HP Anda! Tarik layar dari atas untuk melihat.');
        setTimeout(() => setTestSentMessage(null), 5000);
      } catch {
        setTestSentMessage('Gagal mengirim notifikasi. Pastikan izin notifikasi aktif di browser HP.');
      }
    } else {
      handleRequestPermission();
    }
  };

  if (!isOpen || !mounted) return null;

  const prayerTimes = userLocation?.prayerTimes;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pb-24 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[88vh] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                Pengingat & Jadwal Sholat GPS
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Otomatis mengikuti jam GPS HP & standar Kemenag RI.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Tutup Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {/* GPS Location & Auto Sync Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/10 via-emerald-800/5 to-teal-900/10 dark:from-emerald-900/30 dark:via-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">
                    {userLocation?.cityName || 'Kabupaten Situbondo, Jawa Timur'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold">
                    {userLocation?.isGPSActive ? '🟢 GPS HP Aktif' : '📍 Wilayah Tersimpan'}
                  </span>
                  <span>(GMT+0{userLocation?.timezoneOffset || 7})</span>
                </div>
              </div>

              {/* Tombol Sinkronkan GPS */}
              <button
                onClick={handleSyncGPS}
                disabled={isLocationLoading}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-60 shadow-xs shrink-0"
                title="Perbarui koordinat dari GPS HP"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocationLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sinkron GPS</span>
                <span className="sm:hidden">GPS</span>
              </button>
            </div>

            {/* Quick City Selection Fallback */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-white/80 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800/60 text-[11px] font-medium text-stone-600 dark:text-stone-300 flex items-center justify-between hover:bg-white transition-colors"
              >
                <span>Ganti Kota / Wilayah Lain</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-emerald-950 border border-stone-200 dark:border-emerald-800 rounded-xl shadow-xl z-20 p-1 space-y-0.5 text-xs">
                  {INDONESIAN_REFERENCE_CITIES.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setCityManually(city.name, city.lat, city.lng, city.tz);
                        setShowCityDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {syncFeedback && (
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 animate-fade-in">
                {syncFeedback}
              </div>
            )}
          </div>

          {/* Tabel Jadwal Sholat Kemenag RI (Hasil Sinkronisasi GPS) */}
          {prayerTimes && (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  Jadwal Sholat Kemenag Hari Ini
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Menurut Lokasi Anda</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Subuh</span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">{prayerTimes.fajr}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Terbit</span>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{prayerTimes.sunrise}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                  <span className="block text-[10px] text-amber-800 dark:text-amber-400 font-bold">Dhuha</span>
                  <span className="text-xs font-black text-amber-900 dark:text-amber-300">{prayerTimes.dhuha}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Zuhur</span>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{prayerTimes.dhuhr}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Asar</span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">{prayerTimes.asr}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Magrib</span>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{prayerTimes.maghrib}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-stone-100 dark:border-emerald-900/40">
                  <span className="block text-[10px] text-stone-400">Isya</span>
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{prayerTimes.isha}</span>
                </div>
              </div>
            </div>
          )}

          {/* Permission Status Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                {permissionState === 'granted' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">Notifikasi Bilah HP Aktif</span>
                  </>
                ) : permissionState === 'denied' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-rose-600">Izin Notifikasi Diblokir di Browser</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-300">Perlu Izin Notifikasi HP</span>
                  </>
                )}
              </div>

              {permissionState !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Izinkan Sekarang
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Notifikasi otomatis akan muncul di bilah atas HP saat masuk waktu amalan, lengkap dengan getar dan suara lembut.
            </p>

            <button
              onClick={() => sendTestNotification()}
              className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-emerald-900/50 hover:bg-stone-100 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Tes Notifikasi ke Bilah HP Sekarang 🔔</span>
            </button>

            {testSentMessage && (
              <div className="text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-fade-in">
                {testSentMessage}
              </div>
            )}
          </div>

          {/* Schedule Inputs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Jadwal Pengingat 5 Waktu Amalan
              </h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Otomatis dari GPS
              </span>
            </div>

            <div className="space-y-2.5">
              {NOTIFICATION_LABELS.map((item) => (
                <div
                  key={item.category}
                  className="p-3.5 rounded-2xl bg-white dark:bg-emerald-900/30 border border-stone-200/80 dark:border-emerald-800/40 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 max-w-xs">
                      {item.desc}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={notificationTimes[item.category] || '04:00'}
                      onChange={(e) => setNotificationTime(item.category, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-emerald-800 bg-stone-50 dark:bg-emerald-950 text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs"
            >
              Selesai & Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
