'use client';

import React, { useEffect, useRef } from 'react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { playGentleChime } from '@/utils/audioAlert';
import { getTodayDateString } from '@/utils/dateUtils';
import { TimeCategory } from '@/types';
import { RawPrayerTimes } from '@/utils/prayerTimeService';

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

const FARDHU_PRAYER_NOTIFICATIONS: {
  key: keyof RawPrayerTimes;
  name: string;
  message: string;
}[] = [
  {
    key: 'fajr',
    name: 'Sholat Subuh',
    message: 'Masuk waktu Sholat Subuh. Segerakan 2 rakaat fardhu di awal waktu, disaksikan malaikat malam & siang.',
  },
  {
    key: 'dhuhr',
    name: 'Sholat Dzuhur',
    message: 'Masuk waktu Sholat Dzuhur. Rehat sejenak dari ikhtiar duniawi dan tegakkan sholat fardhu 4 rakaat.',
  },
  {
    key: 'asr',
    name: 'Sholat Ashar',
    message: 'Masuk waktu Sholat Ashar. Waktu sholat wustha telah tiba, raih keberkahan petang dengan sholat tepat waktu.',
  },
  {
    key: 'maghrib',
    name: 'Sholat Maghrib',
    message: 'Masuk waktu Sholat Maghrib. Sambut tenggelamnya matahari dengan doa mustajab dan sholat fardhu 3 rakaat.',
  },
  {
    key: 'isha',
    name: 'Sholat Isya',
    message: 'Masuk waktu Sholat Isya. Tunaikan sholat fardhu Isya & Ba\'diyah sebelum beristirahat malam.',
  },
];

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

      // 2. Notifikasi Adzan 5 Sholat Fardhu Presisi GPS Kemenag RI
      if (userLocation?.prayerTimes) {
        FARDHU_PRAYER_NOTIFICATIONS.forEach((fardhu) => {
          const prayerTimeHM = userLocation.prayerTimes[fardhu.key];
          if (prayerTimeHM && prayerTimeHM === currentHM) {
            const sentKey = `jalur_langit_fardhu_${todayKey}_${fardhu.key}`;
            const alreadySent = localStorage.getItem(sentKey);

            if (!alreadySent) {
              localStorage.setItem(sentKey, new Date().toISOString());

              // Mainkan suara lonceng chime lembut
              playGentleChime();

              const title = `Adzan ${fardhu.name} (${prayerTimeHM}) 🕌`;
              const options: NotificationOptions & { vibrate?: number[] } = {
                body: fardhu.message,
                icon: '/icon.svg',
                badge: '/icon.svg',
                vibrate: [300, 150, 300, 150, 300],
                tag: `fardhu-${fardhu.key}-${todayKey}`,
                data: {
                  url: '/amalan',
                  prayer: fardhu.key,
                },
              };

              // Prioritaskan pemanggilan via Service Worker agar masuk ke bilah HP
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
            }
          }
        });
      }
    };

    const intervalId = setInterval(checkNotificationSchedule, 15000);
    // Jalankan sekali saat mount
    checkNotificationSchedule();

    return () => clearInterval(intervalId);
  }, [notificationsEnabled, notificationTimes]);

  return null;
};
