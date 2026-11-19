// Jalur Langit - PWA Service Worker
// Memberikan dukungan notifikasi background bar, getar, suara, dan caching PWA

const CACHE_NAME = 'jalur-langit-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Cache pre-fetch warning:', err);
      });
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Notification Click Handler - Open app to specific amalan tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/amalan';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Jika tab/aplikasi sudah terbuka, fokuskan tab dan arahkan
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Jika aplikasi belum terbuka di browser, buka window baru
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Push Event (Untuk Cloud Web Push di masa depan)
self.addEventListener('push', (event) => {
  let data = {
    title: 'Jalur Langit 🌙',
    body: 'Sudah masuk waktu amalan prioritas. Mari luangkan waktu bermunajat.',
    url: '/amalan',
    category: 'subuh',
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200, 100, 200],
    tag: `jalur-langit-${data.category || 'general'}-${Date.now()}`,
    renotify: true,
    data: {
      url: data.url || '/amalan',
      category: data.category,
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
