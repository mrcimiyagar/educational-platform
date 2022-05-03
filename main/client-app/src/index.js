import { TailSpin, useLoading } from "@agney/react-loading";
import { Typography } from "@material-ui/core";
import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import CloudIcon from "./images/logo.png";
import store from "./redux/main";
import { serverRoot, setup, socket } from "./util/Utils";
import "./notifSystem";
import { Alert, Snackbar } from "@mui/material";
import CustomImageBox from "./components/CustomImageBox";
import SpaceWallpaperDark from "./images/space-wallpaper-dark.png";
import SpaceWallpaperLight from "./images/space-wallpaper-light.jpg";
import { ColorBase, colors, setThemeMode, themeMode } from "./util/settings";

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

const channel4Broadcast = new BroadcastChannel("channel4");
channel4Broadcast.onmessage = (event) => {
  channel4Broadcast.postMessage({ token: localStorage.getItem("token") });
};

export let pathConfig = {};

const MainApp = React.lazy(() => {
  return Promise.all([
    import("./App"),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]).then(([moduleExports]) => moduleExports);
});

let Loading = (props) => {
  return (
    <section {...props}>
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={CloudIcon}
          style={{ width: 112, height: 112, marginTop: -24 }}
        />
        <Typography
          variant={"h5"}
          style={{
            width: "100%",
            marginTop: 16,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            color: colors.text,
          }}
        >
          جامعه
        </Typography>
      </div>
    </section>
  );
};

let PreLoading = (props) => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <TailSpin width="276" height="276" />,
  });
  return (
    <section {...props}>
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={CloudIcon}
          style={{ width: 112, height: 112, marginTop: -24 }}
        />
        <Typography
          variant={"h5"}
          style={{
            width: "100%",
            marginTop: 16,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            color: colors.text,
          }}
        >
          جامعه
        </Typography>
      </div>
    </section>
  );
};

export let setWallpaper = undefined,
  wallpaper = undefined;
let setWall = undefined;
let loaded = false;

let loading = (
  <div
    style={{
      width: "100%",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
    }}
  >
    <Loading
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  </div>
);

export let display2, setDisplay2;
export function ifServerOnline(ifOnline, ifOffline) {
  fetch("https://society.kasperian.cloud", { mode: "no-cors" })
    .then((r) => {
      ifOnline();
    })
    .catch((e) => {
      ifOffline();
    });
}
export let setClientConnected = (b) => {};

let rndKey, setRndKey;

export let reloadApp = () => {
  window.location.reload(false);
};

let AppContainer = (props) => {
  if (localStorage.getItem("themeMode") === null) {
    localStorage.setItem("themeMode", "light");
  }
  [wallpaper, setWall] = React.useState({
    type: "photo",
    photo:
      localStorage.getItem("themeMode") === "light"
        ? SpaceWallpaperLight
        : SpaceWallpaperDark,
  });
  [rndKey, setRndKey] = React.useState(1);
  setWallpaper = (w) => {
    if (w.type === wallpaper.type) {
      if (
        (w.type === "photo" && w.photo === wallpaper.photo) ||
        (w.type === "video" && w.video === wallpaper.video) ||
        (w.type === "color" && w.color === wallpaper.color)
      ) {
        return;
      }
    }
    setWall(w);
  };
  let [connected, setConnected] = React.useState(false);
  let [disconnectionAlert, setDisconnectAlert] = React.useState(false);
  let [opacity, setOpacity] = React.useState(0);
  let [display, setDisplay] = React.useState("block");
  [display2, setDisplay2] = React.useState("block");

  setClientConnected = (b) => {
    setConnected(b);
  };

  let handleDisconnectionClose = () => {
    setDisconnectAlert(false);
  };

  useEffect(() => {
    setInterval(() => {
      if (socket !== undefined && socket !== null && socket.connected) {
        setDisconnectAlert(false);
      } else {
        setDisconnectAlert(true);
      }
    }, 1000);
    ifServerOnline(
      () => {
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
            pathConfig = result;
            setup();
            getToken(messaging, {
              vapidKey:
                "BDztmrHz8czoaLGG8WgOnWk7FX2z15TYZpgyDxzZQrcVF8tnNJwTS_kIn_JZAbQ-ZrLmpGafELrz2xPgOsonT9k",
            })
              .then((currentToken) => {
                if (currentToken) {
                  onMessage(messaging, (payload) => {
                    console.log(
                      "[firebase-messaging-sw.js] Received background message ",
                      payload
                    );
                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                      body: payload.notification.body,
                      icon: "/logo512.png",
                      vibrate: [200, 100, 200, 100, 200, 100, 200],
                      actions: [
                        {
                          action: "openApp",
                          title: "خانه",
                        },
                      ],
                    };
                    let notification = new Notification(
                      notificationTitle,
                      notificationOptions
                    );
                    notification.onclick = () => {
                      notification.close();
                    };
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
            loaded = true;
            setTimeout(() => {
              setDisplay("none");
            }, 1000);
          });
      },
      () => {
        pathConfig = {
          mainBackend: "https://society.kasperian.cloud",
          mainFrontend: "https://society.kasperian.cloud",
          confClient: "https://conf.kasperian.cloud",
          audioPlayer: "https://audioplayer.kasperian.cloud",
          waveSurferBox: "https://wavesurferbox.kasperian.cloud",
          whiteBoard: "https://whiteboard.kasperian.cloud",
          sharedNotes: "https://sharednotes.kasperian.cloud",
          videoConfVideo: "https://confvideo.kasperian.cloud",
          videoConfAudio: "https://confaudio.kasperian.cloud",
          videoConfScreen: "https://confscreen.kasperian.cloud",
          taskBoard: "https://taskboard.kasperian.cloud",
          taskboardBackend: "https://taskboardbackend.kasperian.cloud",
          codeServer: "https://coder.kasperian.cloud",
          mainWebsocket: "wss://society.kasperian.cloud",
        };
        setup();
        loaded = true;
        setTimeout(() => {
          setDisplay("none");
        }, 1000);
      }
    );
  }, []);

  if (!loaded) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <ColorBase />
        <CustomImageBox
          id={"wallpaperImg"}
          src={wallpaper.photo}
          style={{
            display:
              wallpaper !== undefined &&
              wallpaper !== null &&
              wallpaper.type === "photo"
                ? "block"
                : "none",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <video
          loop
          autoPlay
          src={wallpaper.video}
          style={{
            display:
              wallpaper !== undefined &&
              wallpaper !== null &&
              wallpaper.type === "video"
                ? "block"
                : "none",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display:
              wallpaper !== undefined &&
              wallpaper !== null &&
              wallpaper.type === "color"
                ? "block"
                : "none",
            backgroundColor: wallpaper.color,
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <PreLoading />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ColorBase />
      {wallpaper === undefined || wallpaper === null ? null : wallpaper.type ===
        "photo" ? (
        <CustomImageBox
          src={wallpaper.photo}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit:
              wallpaper.fitType === undefined ? "cover" : wallpaper.fitType,
          }}
        />
      ) : wallpaper.type === "video" ? (
        <video
          loop
          autoPlay
          src={wallpaper.video}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : wallpaper.type === "color" ? (
        <div
          style={{
            backgroundColor: wallpaper.color,
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        />
      ) : null}
      <Suspense fallback={loading}>
        <MainApp />
      </Suspense>
      <Snackbar
        open={disconnectionAlert && !connected}
        autoHideDuration={1000 * 60 * 60 * 24 * 365}
        onClose={handleDisconnectionClose}
      >
        <Alert
          onClose={handleDisconnectionClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          در حال اتصال
        </Alert>
      </Snackbar>
      <div
        style={{
          display: display,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 1)",
          opacity: opacity,
          transition: "opacity .5s",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);
