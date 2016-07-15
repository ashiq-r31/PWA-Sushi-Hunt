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

// self.addEventListener('fetch', function(event){
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(response){
//       if(response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

var jsonDataRe = /\/feed/i;

self.addEventListener('fetch', function(event) {
    var request = event.request,
        match = jsonDataRe.exec(request.url);

    if (match) {
        // Use regex capturing to grab only the bit of the URL
        // that we care about, ignoring query string, etc.
        var cacheRequest = new Request(match[1]);
        event.respondWith(
            caches.match(cacheRequest).then(function(response) {
                return response || fetch(request).then(function(response) {
                    caches.open('sushi-v7').then(function(cache) {
                      cache.put(cacheRequest, response);
                    })
                    return response;
                });
            })
        );
    }
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
