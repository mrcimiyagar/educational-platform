import { openInnerNotif } from "./App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { colors } from "./util/settings";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const publicVapidKey = "-";

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch((err) => console.error(err));
}

const winsw = new BroadcastChannel("winsw");
winsw.onmessage = (event) => {
  winsw.postMessage({ token: localStorage.getItem("token") });
};

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");

  navigator.serviceWorker
    .register("https://society.kasperian.cloud/serviceWorker.js", {
      scope: "/",
    })
    .then(
      function (reg) {
        var serviceWorker;
        let callback = async () => {
          console.log("Service Worker Registered...");

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
              getToken(messaging, {
                vapidKey: "-",
              })
                .then((currentToken) => {
                  if (currentToken) {
                    onMessage(messaging, (payload) => {
                      console.log(
                        "[firebase-messaging-sw.js] Received message ",
                        payload
                      );
                      openInnerNotif(payload.data.body, colors.accent);
                      /*const notificationTitle = payload.data.title;
                      const notificationActions =
                        payload.data.type === "call"
                          ? [
                              { action: "acceptCall", title: "???????? ???? ????????" },
                              { action: "declineCall", title: "???? ????????" },
                            ]
                          : undefined;
                      const notificationOptions = {
                        body: payload.data.body,
                        icon: "/logo512.png",
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        tag: payload.data.link,
                        actions: notificationActions
                      };
                      Notification.requestPermission(function (result) {
                        if (result === "granted") {
                          navigator.serviceWorker.ready.then(function (
                            registration
                          ) {
                            registration.showNotification(
                              notificationTitle,
                              notificationOptions
                            );
                          });
                        }
                      });*/
                    });
                    let requestOptions = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token"),
                      },
                      body: JSON.stringify({
                        firebaseToken: currentToken,
                      }),
                      redirect: "follow",
                    };
                    fetch(
                      "https://society.kasperian.cloud/registerFirebaseToken",
                      requestOptions
                    )
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
                  console.log(
                    "An error occurred while retrieving token. ",
                    err
                  );
                });
            });

          console.log("Push Registered...");
        };
        if (reg.installing) {
          serviceWorker = reg.installing;
          // console.log('Service worker installing');
        } else if (reg.waiting) {
          serviceWorker = reg.waiting;
          // console.log('Service worker installed & waiting');
        } else if (reg.active) {
          serviceWorker = reg.active;
          // console.log('Service worker active');
        }

        if (serviceWorker) {
          console.log("sw current state", serviceWorker.state);
          if (serviceWorker.state == "activated") {
            //If push subscription wasnt done yet have to do here
            console.log("sw already activated - Do watever needed here");

            callback();
          }
          serviceWorker.addEventListener("statechange", async function (e) {
            console.log("sw statechange : ", e.target.state);
            if (e.target.state == "activated") {
              // use pushManger for subscribing here.
              console.log(
                "Just now activated. now we can subscribe for push notification"
              );

              callback();
            }
          });
        }
      },
      function (err) {
        console.error("unsuccessful registration with ", err);
      }
    )
    .catch((ex) => {
      console.log(ex);
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
