// ============================================================
// Service Worker - かんたん家計簿PWA
// ※ GitHubに更新するたびに CACHE_VERSION を1つ上げてください
//    例: v2 → v3 → v4 ...
//    これによりスマホ側のキャッシュが自動更新されます
// ============================================================
const CACHE_VERSION = "kakeibo-v3";
const ASSETS = ["./index.html", "./manifest.json", "./sw.js"];

// インストール時: 新しいキャッシュを作成
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting()) // 即座に新バージョンを有効化
  );
});

// アクティベート時: 古いキャッシュを全削除
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // 全クライアントに即適用
  );
});

// フェッチ時: キャッシュ優先・なければネットワーク
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
