
console.log("Service Worker Loaded...");

let cacheName = "js13kPWA-v2";

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'openApp') {
    self.navigator.clearAppBadge();
    self.clients.openWindow('/');
  }
}, false);

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.navigator.setAppBadge(1);
  e.waitUntil(self.registration.showNotification("Society", {
    body: data.body,
    icon: "/logo512.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    actions: [
      {
        action: 'openApp',
        title: 'خانه'
      }
    ]
  }));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'openApp') {
    self.navigator.clearAppBadge();
    self.clients.openWindow('/');
  }
}, false);

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

const KEY = cacheName;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("message", (event) => {
  if (event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(KEY).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await fetch(e.request);
        return response;
      } catch (ex) {
        console.error(ex);
      }
      return null;
    })()
  );
});
