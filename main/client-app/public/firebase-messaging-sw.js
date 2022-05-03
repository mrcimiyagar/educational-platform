
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
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