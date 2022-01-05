import { TailSpin, useLoading } from '@agney/react-loading'
import { Typography } from '@material-ui/core'
import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import CloudIcon from './images/logo.png'
import DesktopWallpaper from './images/roomWallpaper.png'
import RoomWallpaper from './images/desktop-wallpaper.jpg'
import ChatWallpaper from './images/chat-wallpaper.jpg'
import ProfileHeader from './images/profile-header.jpeg'
import store from './redux/main';
import { setup, socket } from './util/Utils';
import './notifSystem';
import { Alert, Snackbar } from '@mui/material';
import CustomImageBox from './components/CustomImageBox'

function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

if (getOS() === 'Windows') document.body.style.zoom = "80%";

function preloadImages(array) {
  if (!preloadImages.list) {
      preloadImages.list = [];
  }
  var list = preloadImages.list;
  for (var i = 0; i < array.length; i++) {
      var img = new Image();
      img.onload = function() {
          var index = list.indexOf(this);
          if (index !== -1) {
              // remove image from the array once it's loaded
              // for memory consumption reasons
              list.splice(index, 1);
          }
      }
      list.push(img);
      img.src = array[i];
  }
}

export let pathConfig = {}

const MainApp = React.lazy(() => {
  return Promise.all([
    import('./App'),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]).then(([moduleExports]) => moduleExports)
})

let Loading = (props) => {
  return (
    <section {...props}>
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img
          src={CloudIcon}
          style={{ width: 112, height: 112, marginTop: -24 }}
        />
        <Typography
          variant={'h5'}
          style={{
            width: '100%',
            marginTop: 16,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#333',
          }}
        >
          ابر آسمان
        </Typography>
      </div>
    </section>
  )
}

let PreLoading = (props) => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <TailSpin width="276" height="276" />,
  })
  return (
    <section {...props}>
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img
          src={CloudIcon}
          style={{ width: 112, height: 112, marginTop: -24 }}
        />
        <Typography
          variant={'h5'}
          style={{
            width: '100%',
            marginTop: 16,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#333',
          }}
        >
          ابر آسمان
        </Typography>
      </div>
    </section>
  )
}

export let setWallpaper = undefined,
  wallpaper = undefined
let setWall = undefined
let loaded = false

let loading = (
  <div
    style={{
      width: '100%',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
    }}
  >
    <Loading
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </div>
)

export let display2, setDisplay2
export function ifServerOnline(ifOnline, ifOffline) {
  fetch('https://kaspersoft.cloud', { mode: 'no-cors' })
    .then((r) => {
      ifOnline()
    })
    .catch((e) => {
      ifOffline()
    })
}
export let setClientConnected = (b) => {};

let AppContainer = (props) => {
  ;[wallpaper, setWall] = React.useState({})
  setWallpaper = (w) => {
    if (w.type === wallpaper.type) {
      if ((w.type === 'photo' && w.photo === wallpaper.photo) ||
      (w.type === 'video' && w.video === wallpaper.video) ||
      (w.type === 'color' && w.color === wallpaper.color)) {
        return;
      } 
    }
    setWall(w);
  }
  let [connected, setConnected] = React.useState(false);
  let [disconnectionAlert, setDisconnectAlert] = React.useState(false);
  let [opacity, setOpacity] = React.useState(0);
  let [display, setDisplay] = React.useState('block');
  ;[display2, setDisplay2] = React.useState('block');

  setClientConnected = (b) => {
    setConnected(b);
  }

  let handleDisconnectionClose = () => {
    setDisconnectAlert(false);
  }

  useEffect(() => {
    setInterval(() => {
      if (socket !== undefined && socket !== null && socket.connected) {
        setDisconnectAlert(false);
      }
      else {
        setDisconnectAlert(true);
      }
    }, 1000);
    preloadImages([ChatWallpaper, RoomWallpaper, DesktopWallpaper, ProfileHeader]);
    ifServerOnline(
      () => {
        let requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow',
        }
        fetch('https://config.kaspersoft.cloud', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            pathConfig = result
            setup()
            loaded = true
            setTimeout(() => {
              setDisplay('none')
            }, 1000)
          })
      },
      () => {
        pathConfig = {
          mainBackend: 'https://backend.kaspersoft.cloud',
          mainFrontend: 'https://kaspersoft.cloud',
          confClient: 'https://confclient.kaspersoft.cloud',
          audioPlayer: 'https://audioplayer.kaspersoft.cloud',
          waveSurferBox: 'https://wavesurferbox.kaspersoft.cloud',
          whiteBoard: 'https://whiteboard.kaspersoft.cloud',
          sharedNotes: 'https://sharednotes.kaspersoft.cloud',
          videoConfVideo: 'https://confvideo.kaspersoft.cloud',
          videoConfAudio: 'https://confaudio.kaspersoft.cloud',
          videoConfScreen: 'https://confscreen.kaspersoft.cloud',
          taskBoard: 'https://taskboard.kaspersoft.cloud',
          mainWebsocket: 'wss://kaspersoft.cloud',
        }
        setup()
        loaded = true
        setTimeout(() => {
          setDisplay('none')
        }, 1000)
      },
    )
  }, [])

  if (!loaded) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
          <CustomImageBox
            id={'wallpaperImg'}
            src={wallpaper.photo}
            style={{
              display: (wallpaper !== undefined && wallpaper !== null && wallpaper.type === 'photo') ? 'block' : 'none',
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <video
            loop
            autoPlay
            src={wallpaper.video}
            style={{
              display: (wallpaper !== undefined && wallpaper !== null && wallpaper.type === 'video') ? 'block' : 'none',
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              display: (wallpaper !== undefined && wallpaper !== null && wallpaper.type === 'color') ? 'block' : 'none',
              backgroundColor: wallpaper.color,
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
          />
        <PreLoading />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {wallpaper === undefined || wallpaper === null ? null : wallpaper.type ===
        'photo' ? (
          <CustomImageBox
            src={wallpaper.photo}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
      ) : wallpaper.type === 'video' ? (
        <video
          loop
          autoPlay
          src={wallpaper.video}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : wallpaper.type === 'color' ? (
        <div
          style={{
            backgroundColor: wallpaper.color,
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
      <Suspense fallback={loading}>
        <MainApp />
      </Suspense>
      <Snackbar open={disconnectionAlert && !connected} autoHideDuration={1000 * 60 * 60 * 24 * 365} onClose={handleDisconnectionClose}>
        <Alert onClose={handleDisconnectionClose} severity="info" sx={{ width: '100%' }}>
          در حال اتصال
        </Alert>
      </Snackbar>
      <div
        style={{
          display: display,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 1)',
          opacity: opacity,
          transition: 'opacity .5s',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
)
