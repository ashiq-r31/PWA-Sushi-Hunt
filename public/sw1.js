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

version = 'v8';

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installed version', version);
  event.waitUntil(
    caches.open('sushi-v8')
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
//     }).catch(function(response){}
//   );
// });
var regexFeed = /\/feed/i;

self.addEventListener('fetch', function(event) {

  var feedTrue = regexFeed.exec(event.request.url);
  var cacheRequest = new Request(feedTrue);

  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }
      // } else if (event.request.url.match(regexFeed)) {
      //   return fetch(event.request).catch(function() {
      //       console.log("trying to get you your site nigga");
      //       // return caches.match(cacheRequest);
      //   });
      // }
      console.log('No response found in cache. About to fetch from network...');

      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});


self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['sushi-v8'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if ('sushi-v8' && cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleted old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
