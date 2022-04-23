
console.log("Service Worker Loaded...");

let cacheName = 'js13kPWA-v2';

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  let notif = new Notification("Society", {
    body: data.body,
    icon: '/logo512.png'
  });
  notif.onclick = function(){
    window.parent.focus();
    notif.close();
   }
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

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    try {
    const response = await fetch(e.request);
    return response;
    } catch(ex) {
      console.error(ex);
    }
    return null;
  })());
});
