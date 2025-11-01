// service-worker.js
const CACHE_NAME = 'quiz-coran-v1';
const urlsToCache = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(key => key!==CACHE_NAME && caches.delete(key)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp =>
      resp || fetch(e.request).then(r=>{
        if(r.ok && r.type==='basic'){
          caches.open(CACHE_NAME).then(c=>c.put(e.request, r.clone()));
        }
        return r;
      })
    ).catch(()=>{
      if(e.request.destination==='document') return caches.match('./index.html');
    })
  );
});
