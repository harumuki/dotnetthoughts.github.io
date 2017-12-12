---
layout: none
---


const SW_VERSION = '{{ site.time | date: "%Y.%m.%d"}}';
const PRECACHE = 'precache-v10';
const RUNTIME = '{{ site.time | date: "%Y-%m-%d"}}';

const PRECACHE_URLS = [
    '/css/bootstrap.min.css',
    '/css/site.css',
    'js/jquery.min.js',
    'images/mvplogo.png',
    'favicon.ico',
    'js/pace.min.js',
    'js/bootstrap.min.js',
    'js/ie10-viewport-bug-workaround.js',
    'images/social.png',
    'fonts/open-sans-v14-latin-regular.eot',
    'fonts/open-sans-v14-latin-regular.svg',
    'fonts/open-sans-v14-latin-regular.ttf',
    'fonts/open-sans-v14-latin-regular.woff',
    'fonts/open-sans-v14-latin-regular.woff2',
    'images/offline.png',
    'offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          }).catch(function(){
            return caches.match('/offline.html');
          });
        });
      })
    );
  }
});