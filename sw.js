const CACHE = "mb-xviii-v14";
const CORE = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./voice.mp3",
  "./assets/noir.webp",
  "./assets/gold.webp",
  "./assets/cafe.webp",
  "./assets/studio.webp",
  "./assets/park.webp",
  "./assets/beach.webp",
  "./assets/qr-v12.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok)
          caches
            .open(CACHE)
            .then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((hit) => hit || caches.match("./index.html")),
      ),
  );
});
