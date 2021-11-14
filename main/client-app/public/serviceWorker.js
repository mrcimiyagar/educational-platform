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

self.addEventListener('fetch', function(event) {
  // We will cache all POST requests to matching URLs
  if(event.request.method === "POST"){
      event.respondWith(
          // First try to fetch the request from the server
      fetch(event.request.clone())
          // If it works, put the response into IndexedDB
          .then(function(response) {
              // Compute a unique key for the POST request
              var key = event.request.url.href.toString();
              // Create a cache entry
              var entry = {
                  key: key,
                  response: response.json(),
                  timestamp: Date.now()
              };

              db.putIfNotExists(key, entry)
                .then(function (res) {})
                .catch(function (err) {})

              // Return the (fresh) response
              return response;
          })
          .catch(function() {
              // If it does not work, return the cached response. If the cache does not
              // contain a response for our request, it will give us a 503-response
              var key = request.url.href.toString();
              var cachedResponse = /* query IndexedDB using the key */;
              let res = cachedResponse.response;
              
              return response;
          })
      );
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
