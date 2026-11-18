'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, Clock, CheckCircle2, AlertCircle, Sparkles, Volume2 } from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { TimeCategory } from '@/types';
import { playGentleChime } from '@/utils/audioAlert';

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
    desc: 'Pengingat Sholat Dhuha pembuka pintu rezeki',
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
    notificationsEnabled,
    notificationTimes,
    setNotificationsEnabled,
    setNotificationTime,
    appTheme,
  } = useJalurLangitStore();

  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

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
          sendTestNotification('Notifikasi Berhasil Diaktifkan! 🔔', 'Jalur Langit akan mengingatkan Anda saat masuk jadwal amalan.');
        } else {
          setNotificationsEnabled(false);
        }
      } catch {
        // ignore
      }
    }
  };

  const sendTestNotification = (title = 'Pengingat Waktu Amalan 🌙', body = 'Sudah masuk waktu amalan. Luangkan beberapa menit untuk bermunajat kepada Allah.') => {
    playGentleChime();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
        });
        setTestSentMessage('Notifikasi terkirim ke HP/Layar Anda! Silakan periksa bilah notifikasi.');
        setTimeout(() => setTestSentMessage(null), 4000);
      } catch {
        setTestSentMessage('Gagal mengirim notifikasi. Pastikan izin notifikasi aktif di browser.');
      }
    } else {
      handleRequestPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              appTheme === 'blush'
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}>
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">
                Sinkronisasi & Alarm Waktu Amalan
              </h3>
              <p className="text-[11px] text-stone-500">
                Notifikasi otomatis di HP agar tidak melewatkan waktu mustajab.
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
          {/* Permission Status Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/80 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                {permissionState === 'granted' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">Notifikasi HP Aktif</span>
                  </>
                ) : permissionState === 'denied' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-rose-600">Notifikasi Diblokir di Browser</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-300">Perlu Izin Notifikasi</span>
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
              Sistem membaca waktu jam di HP Anda dan memberikan pengingat saat masuk waktu amalan prioritas.
            </p>

            <button
              onClick={() => sendTestNotification()}
              className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-emerald-900/50 hover:bg-stone-100 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Tes Kirim Pengingat ke HP</span>
            </button>

            {testSentMessage && (
              <div className="text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-fade-in">
                {testSentMessage}
              </div>
            )}
          </div>

          {/* Schedule Inputs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Jadwal Jam Pengingat Harian
            </h4>

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
              Simpan Jadwal Pengingat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
