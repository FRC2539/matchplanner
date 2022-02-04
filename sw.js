var cacheName = 'matchplanner_0.1';
var APP_PREFIX = 'matchplanner_0.1'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'v0.1'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var filesToCache = [
  '/{repository}/',
  '/{repository}/index.html',
  '/{repository}/css/style.css',
  '/{repository}/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request)
    })
  )
})