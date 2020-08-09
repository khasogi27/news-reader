const CACHE_NAME = "firstpwa-v1";

let urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/article.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/manifest.json",
  "/js/nav.js",
  "/js/api.js",
  "/assets/icon.png",
  "/assets/icon512x512.png",
  "/assets/icon192x192.png",
  "/assets/news.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  const baseURL = "https://berita-news.herokuapp.com";

  if (event.request.url.indexOf(baseURL) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches
      .match(event.request, {
        ignoreSearch: true
      })
      .then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cachesNames) {
      return Promise.all(
        cachesNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("serviceworker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});