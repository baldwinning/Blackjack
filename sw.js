// Gets the newest version when online, and still works offline.
const CACHE = 'brassrail-v12';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    try {
      const r = await fetch(e.request);
      if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      return (await c.match(e.request)) || (await c.match('index.html'));
    }
  }));
});
