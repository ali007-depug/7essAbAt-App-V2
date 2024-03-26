const myApp = "7essAbAtAppV2"; //name of cache
const assets = [
  "./",
  "./index.html",
  "./src/sass/main.css",
  "./src/app.js",
  "./images/icons"
];
//self mean the service worker itself
//self mean the serviec worker itself
self.addEventListener("install", (installEvent) => {
    installEvent.waitUntil(
        caches.open(myApp).then((cache) => {
            cache.addAll(assets);
        })
    )
})

//fetch data in cach if it's exist then use it if it's not fetch from the network
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
