
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

function isSuccessful(response) {
  return response &&
    response.status === 200 &&
    response.type === 'basic';
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('my-cache-v1')
      .then(function (cache) {
        return cache.addAll(['/*']);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return fetch(event.request.clone())
          .then(function (response) {
            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});
