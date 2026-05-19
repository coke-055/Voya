// Minimal service worker — enables PWA installability
const CACHE = 'voya-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (e) => {
  // Pass through all requests; no offline caching needed for localhost dev
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })))
})
