/* Service worker : l'app fonctionne hors ligne. Incrémente VERSION à chaque mise en ligne. */
const VERSION = "grimoire-v2.0.0";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./config.js", "./css/app.css",
  "./js/app.js", "./js/store.js", "./js/sync.js", "./js/games.js", "./js/icons.js", "./js/die.js",
  "./js/sound.js", "./js/share.js", "./js/motes.js", "./games/bg3.js",
  "./vendor/supabase.js", "./vendor/591.supabase.js",
  "./icons/icon.svg", "./icons/icon-192.png", "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("supabase.co")) return; // données : toujours en direct
  if (url.origin === location.origin) {
    // réseau d'abord (mises à jour immédiates), cache si hors ligne
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
    return;
  }
  // polices : cache d'abord
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res;
    })));
  }
});
