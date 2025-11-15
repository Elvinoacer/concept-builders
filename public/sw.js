self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('concept-builders-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/images/concept-builders-logo-free-bg.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
