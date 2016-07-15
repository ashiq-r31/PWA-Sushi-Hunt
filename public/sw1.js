var urlsToCache_ = [
  '/',
  '/feed',
  '/stylesheets/main.css',
  '/images/sushi.svg',
  '/images/pin.svg',
  '/images/star.svg',
  '/images/direction.svg',
  '/images/back.svg',
  '/javascripts/main2.js'
];

version = 'v7';

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(
    caches.open('sushi-v7')
      .then(function(cache) {
      console.log("opened cache");
      return cache.addAll(urlsToCache_);
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request)
    .then(function(response){
      if(response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['sushi-v7'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if ('sushi-v7' && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleted old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
