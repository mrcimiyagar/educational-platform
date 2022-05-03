
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

console.log("Service Worker Loaded...");

let cacheName = "js13kPWA-v2";

const firebaseConfig = {
  apiKey: "AIzaSyDGWqgvpAwwwPk1ibxWkF0b80dt8NQllFs",
  authDomain: "infinity-e17df.firebaseapp.com",
  projectId: "infinity-e17df",
  storageBucket: "infinity-e17df.appspot.com",
  messagingSenderId: "538387159430",
  appId: "1:538387159430:web:bd74cea2daa5973a947407",
  measurementId: "G-2PH313X4HV"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

let requestOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
}
fetch('https://config.kasperian.cloud', requestOptions)
  .then((response) => response.json())
  .then((result) => {
    messaging.getToken({vapidKey: 'BDztmrHz8czoaLGG8WgOnWk7FX2z15TYZpgyDxzZQrcVF8tnNJwTS_kIn_JZAbQ-ZrLmpGafELrz2xPgOsonT9k'}).then((currentToken) => {
      if (currentToken) {
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem('token')
          },
          body: JSON.stringify({
            firebaseToken: currentToken
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/registerFirebaseToken", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
          });
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });;
  });

messaging.onMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo512.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    actions: [
      {
        action: 'openApp',
        title: 'خانه'
      }
    ]
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

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
