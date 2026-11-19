'use client';

import React, { useEffect, useRef } from 'react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { playGentleChime } from '@/utils/audioAlert';
import { getTodayDateString } from '@/utils/dateUtils';
import { TimeCategory } from '@/types';

const AMALAN_NOTIFICATION_INFO: Record<TimeCategory, { title: string; body: string }> = {
  dini_hari: {
    title: 'Waktu Tahajjud & Munajat Hajat 🌙',
    body: 'Bismillah, sepertiga malam telah tiba. Saatnya sholat tahajjud, witir, dan sampaikan hajat terbesar kepada Allah.',
  },
  subuh: {
    title: 'Masuk Waktu Subuh & Sedekah Fajar 🌅',
    body: 'Tunaikan Qobliyah Subuh, Sholat Subuh berjamaah, dan sedekah fajar pembuka pintu keberkahan hari ini.',
  },
  dhuha: {
    title: 'Waktu Sholat Dhuha Pembuka Rezeki ☀️',
    body: 'Matahari mulai meninggi, luangkan sejenak sholat Dhuha untuk menjemput rezeki berkah dan kemudahan ikhtiar.',
  },
  petang: {
    title: 'Waktu Ashar & QS. Al-Waqi\'ah 🌇',
    body: 'Sempurnakan ikhtiar petang dengan sholat Ashar tepat waktu dan membaca surat pelapang rezeki.',
  },
  malam: {
    title: 'Waktu QS. Al-Mulk & Istighfar Malam 🌌',
    body: 'Sebelum beristirahat, amalkan QS. Al-Mulk pelindung kubur dan perbanyak istighfar memohon ampunan.',
  },
};

export const PwaNotificationManager: React.FC = () => {
  const {
    notificationsEnabled,
    notificationTimes,
    userLocation,
    syncGPSPrayerTimes,
    setNotificationsEnabled,
  } = useJalurLangitStore();

  const isSyncingRef = useRef(false);

  // 1. Registrasi PWA Service Worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service Worker terdaftar dengan scope:', registration.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Registrasi Service Worker gagal:', err);
        });
    }
  }, []);

  // 2. Sinkronisasi GPS otomatis jika belum pernah sinkron atau sudah > 24 jam
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAutoSync = async () => {
      if (isSyncingRef.current) return;
      const lastSync = userLocation?.lastSyncedAt;
      const shouldSync = !lastSync || Date.now() - new Date(lastSync).getTime() > 1000 * 60 * 60 * 20; // 20 jam

      if (shouldSync) {
        isSyncingRef.current = true;
        await syncGPSPrayerTimes();
        isSyncingRef.current = false;
      }
    };

    checkAutoSync();
  }, [userLocation, syncGPSPrayerTimes]);

  // 3. Deteksi izin notifikasi dari browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, [setNotificationsEnabled]);

  // 4. Timer background pemeriksa waktu alarm amalan (Interval 15 detik)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkNotificationSchedule = () => {
      if (!notificationsEnabled) return;
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const currentHM = `${currentH}:${currentM}`;
      const todayKey = getTodayDateString();

      Object.entries(notificationTimes).forEach(([categoryKey, scheduledTime]) => {
        const cat = categoryKey as TimeCategory;
        if (scheduledTime === currentHM) {
          const sentKey = `jalur_langit_alarm_${todayKey}_${cat}`;
          const alreadySent = localStorage.getItem(sentKey);

          if (!alreadySent) {
            localStorage.setItem(sentKey, new Date().toISOString());

            // Mainkan suara chime lembut
            playGentleChime();

            const info = AMALAN_NOTIFICATION_INFO[cat] || {
              title: 'Jalur Langit: Masuk Waktu Amalan 🔔',
              body: 'Saatnya luangkan waktu sejenak untuk bermunajat kepada Allah.',
            };

            const options: NotificationOptions & { vibrate?: number[] } = {
              body: info.body,
              icon: '/icon.svg',
              badge: '/icon.svg',
              vibrate: [200, 100, 200, 100, 200],
              tag: `amalan-${cat}-${todayKey}`,
              data: {
                url: '/amalan',
                category: cat,
              },
            };

            // Prioritaskan pemanggilan via Service Worker agar masuk ke notification drawer HP
            if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
              navigator.serviceWorker.ready
                .then((reg) => {
                  reg.showNotification(info.title, options);
                })
                .catch(() => {
                  new Notification(info.title, options);
                });
            } else {
              new Notification(info.title, options);
            }
          }
        }
      });
    };

    const intervalId = setInterval(checkNotificationSchedule, 15000);
    // Jalankan sekali saat mount
    checkNotificationSchedule();

    return () => clearInterval(intervalId);
  }, [notificationsEnabled, notificationTimes]);

  return null;
};
