// Aydope portfolio — service worker
// Cache-first for the app shell, network-first fallback for everything else.
//
// IMPORTANT: bump CACHE_NAME (e.g. v1 -> v2) on every deploy where you want
// visitors to be notified of a new version. The browser detects an update
// whenever sw.js itself changes byte-for-byte, and the version-update modal
// in index.html only appears for that new worker.

const CACHE_NAME = "aydope-cache-v2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/styles/style.css",
  "/src/assets/logo/favicon.ico",
  "/src/assets/logo/favicon-96x96.png",
  "/src/assets/logo/favicon.svg",
  "/src/assets/logo/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // Missing local assets shouldn't block installation.
      }),
  );
  // Intentionally no self.skipWaiting() here — the new worker stays in
  // "waiting" state until the user confirms the update-available modal
  // in index.html, which posts a SKIP_WAITING message.
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
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests; let everything else (e.g. POST) pass through.
  if (request.method !== "GET") return;

  // Never cache third-party/CDN requests (Tailwind CDN, fonts, GitHub API) —
  // let the browser handle those over the network as usual.
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
