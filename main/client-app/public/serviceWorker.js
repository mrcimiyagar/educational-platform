console.log("Service Worker Loaded...");

let cacheName = "js13kPWA-v2";

setInterval(() => {
  console.log('kepp-alive');
}, 2500);

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
const publicVapidKey =
  'BNgD5u59pcsAJKNff5A8Wjw0sB-TKSmhfkXxLluZAB_ieQGTQdYDxG81EEsPMA_mzNN6GfWUS8XEMW6FOttCC8s';
const subscription = await self.registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
})
console.log('Push Registered...')
console.log('Sending Push...')
try {
  await fetch('https://society.kasperian.cloud/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      token: localStorage.getItem('token'),
    },
  })
} catch (ex) {
  console.log(ex)
}
console.log('Push Sent...')

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
