// ============================================================
// Service Worker - かんたん家計簿PWA
// ※ GitHubに更新するたびに CACHE_VERSION を1つ上げてください
//    例: v3 → v4 → v5 ...
// ============================================================
const CACHE_VERSION = "kakeibo-v4"; // ← 今回はv4に上げる
const ASSETS = ["./index.html", "./manifest.json", "./sw.js"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// フェッチ時: ネットワーク優先（新しい内容を優先し、オフライン時のみキャッシュを使う）
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 成功したら最新版をキャッシュにも保存しておく
        const resClone = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request)) // オフライン時のみキャッシュから
  );
});