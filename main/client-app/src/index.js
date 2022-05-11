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
  [rndKey, setRndKey] = React.useState(1);
  setWallpaper = (w) => {};
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
          src={
            localStorage.getItem("themeMode") === "light"
              ? SpaceWallpaperLight
              : SpaceWallpaperDark
          }
          style={{
            display: "block",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <PreLoading />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ColorBase />
      <CustomImageBox
        src={
          localStorage.getItem("themeMode") === "light"
            ? SpaceWallpaperLight
            : SpaceWallpaperDark
        }
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
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
