
console.log("Service Worker Loaded...");

let cacheName = 'js13kPWA-v1';

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    Icon: '/logo512.png'
  });
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});

const KEY = cacheName;

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(KEY)
                .then( (cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});
