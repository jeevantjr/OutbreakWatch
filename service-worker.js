
const CACHE_NAME = 'outbreakwatch-v1';

const urlsToCache = [
  '/OutbreakWatch/',
  '/OutbreakWatch/index.html',
  '/OutbreakWatch/manifest.json',
  '/OutbreakWatch/styles.css',
  '/OutbreakWatch/app.js',
  '/OutbreakWatch/images/aaa.png',
  // Include any additional offline pages you want:
  '/OutbreakWatch/about.html',
  '/OutbreakWatch/report.html',
  '/OutbreakWatch/alerts.html',
  '/OutbreakWatch/analytics.html',
  '/OutbreakWatch/contact.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
