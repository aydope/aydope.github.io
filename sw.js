const CACHE_NAME = "aydope-cache-v5";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/styles/style.css",
  "/src/assets/logo/favicon.ico",
  "/src/assets/logo/favicon-96x96.png",
  "/src/assets/logo/favicon.svg",
  "/src/assets/logo/apple-touch-icon.png",
  "/src/assets/logo/web-app-manifest-192x192.png",
  "/src/assets/logo/web-app-manifest-512x512.png",
];

const OWN_TOP_LEVEL_SEGMENTS = new Set(["index.html", "manifest.json", "sw.js", "src"]);

function isOwnRequest(url) {
  if (url.origin !== self.location.origin) return false;
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true;
  return OWN_TOP_LEVEL_SEGMENTS.has(segments[0]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // Missing local assets shouldn't block installation.
      }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (!isOwnRequest(url)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    }),
  );
});
