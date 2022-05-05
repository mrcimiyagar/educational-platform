import { setCurrentRoomId, setCurrentNav, setCurrentModuleWorker } from "./App";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGWqgvpAwwwPk1ibxWkF0b80dt8NQllFs",
  authDomain: "infinity-e17df.firebaseapp.com",
  projectId: "infinity-e17df",
  storageBucket: "infinity-e17df.appspot.com",
  messagingSenderId: "538387159430",
  appId: "1:538387159430:web:bd74cea2daa5973a947407",
  measurementId: "G-2PH313X4HV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const publicVapidKey =
  "BNgD5u59pcsAJKNff5A8Wjw0sB-TKSmhfkXxLluZAB_ieQGTQdYDxG81EEsPMA_mzNN6GfWUS8XEMW6FOttCC8s";

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch((err) => console.error(err));
}

const winsw = new BroadcastChannel("winsw");
winsw.onmessage = ({data}) => {
  console.log(
  "navigating to room : " +
    data.roomId +
    " , nav : " +
    data.nav +
    " , mw : " +
    data.mwId +
    "..."
);
setCurrentRoomId(data.roomid);
setCurrentNav(data.nav);
setCurrentModuleWorker(data.mwId);
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
          }
          serviceWorker.addEventListener("statechange", async function (e) {
            console.log("sw statechange : ", e.target.state);
            if (e.target.state == "activated") {
              // use pushManger for subscribing here.
              console.log(
                "Just now activated. now we can subscribe for push notification"
              );
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
