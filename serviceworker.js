var CACHE_NAME = 'blog-cache-v4';
var urlsToCache = [
'index.html',
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

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(
                function(response) {
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Removing old cache :' + cacheName)
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
