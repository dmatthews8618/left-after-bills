/* Left After Bills: keeps the app on the phone so it opens offline.
   Your figures are never stored here; they stay in the phone's own browser storage. */
const CACHE = 'left-after-bills-v3';
const FILES = ['./', './index.html', './manifest.json', './chest-192.png', './chest-512.png', './pdf.min.mjs', './pdf.worker.min.mjs'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {   // open instantly from the saved copy, and quietly refresh it
      if (res && res.ok && new URL(e.request.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
