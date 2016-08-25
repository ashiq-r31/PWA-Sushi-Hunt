var urlsToCache_ = [
  '/',
  '/views/app-shell.handlebars',
  '/stylesheets/main.css',
  '/images/sushi.svg',
  '/images/empty.svg',
  '/images/no-location.svg',
  '/images/sad.svg',
  '/images/pin.svg',
  '/images/star.svg',
  '/images/detect.svg',
  '/images/sushi-196.png',
  '/javascripts/main.js',
  '/manifest.json'
];

version = 'v11';

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(
    caches.open(version)
      .then(function(cache) {
      console.log("opened cache");
      return cache.addAll(urlsToCache_);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('activate', function(event) {

  var cacheWhitelist = [version];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (version && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleted old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
