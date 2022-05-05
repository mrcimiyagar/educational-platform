importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDGWqgvpAwwwPk1ibxWkF0b80dt8NQllFs",
  authDomain: "infinity-e17df.firebaseapp.com",
  projectId: "infinity-e17df",
  storageBucket: "infinity-e17df.appspot.com",
  messagingSenderId: "538387159430",
  appId: "1:538387159430:web:bd74cea2daa5973a947407",
  measurementId: "G-2PH313X4HV",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const winsw = new BroadcastChannel("winsw");
winsw.onmessage = (event) => {
  let token = event.data.token;
  let requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  fetch("https://config.kasperian.cloud", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      messaging
        .getToken({
          vapidKey:
            "BDztmrHz8czoaLGG8WgOnWk7FX2z15TYZpgyDxzZQrcVF8tnNJwTS_kIn_JZAbQ-ZrLmpGafELrz2xPgOsonT9k",
        })
        .then((currentToken) => {
          if (currentToken) {
            let requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                firebaseToken: currentToken,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/registerFirebaseToken", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
              });
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    });
};

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationActions =
    payload.data.type === "call"
      ? [
          { action: "acceptCall" + payload.data.roomId + '_' + payload.data.moduleWorkerId, title: "ورود به تماس" },
          { action: "declineCall", title: "رد تماس" },
        ]
      : undefined;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo512.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: payload.data.link,
    actions: notificationActions,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener(
  "notificationclick",
  function (event) {
    alert('test');
    event.notification.close();
    if (event.action !== null && event.action !== undefined) {
      if (event.action.startsWith("acceptCall")) {
        let url = event.action.substring("acceptCall".length);
        clients
          .matchAll({
            type: "window",
            includeUncontrolled: true,
          })
          .then(function (windowClients) {
            var clientIsVisible = false;
            for (var i = 0; i < windowClients.length; i++) {
              const windowClient = windowClients[i];
              if (windowClient.visibilityState === "visible") {
                clientIsVisible = true;
                break;
              }
            }
            if (clientIsVisible) {
              let parts = url.split('_');
              let roomId = Number(parts[0]);
              let mwId = Number(parts[1]);
              winsw.postMessage({roomId, mwId, nav: 14})
            }
          });
      }
    } else {
      self.clients.openWindow(event.notification.tag);
    }
  },
  false
);
