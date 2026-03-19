const CACHE = 'timebox-v1';
const ASSETS = [
  '/Leo.Dev/Planner/',
  '/Leo.Dev/Planner/index.html',
  '/Leo.Dev/Planner/manifest.json',
  '/Leo.Dev/Planner/icon-192.png',
  '/Leo.Dev/Planner/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/Leo.Dev/Planner/index.html')))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: "Leo's Time Box", body: "Task reminder" };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/Leo.Dev/Planner/icon-192.png',
      badge: '/Leo.Dev/Planner/icon-192.png',
      vibrate: [200, 100, 200],
      actions: [
        { action: 'done', title: 'Mark Done' },
        { action: 'snooze', title: 'Snooze 10min' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/Leo.Dev/Planner/'));
});
