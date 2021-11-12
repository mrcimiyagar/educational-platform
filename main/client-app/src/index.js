import { TailSpin, useLoading } from '@agney/react-loading'
import { Typography } from '@material-ui/core'
import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import CloudIcon from './images/logo.png'
import DesktopWallpaper from './images/roomWallpaper.png'
import RoomWallpaper from './images/desktop-wallpaper.jpg'
import ChatWallpaper from './images/chat-wallpaper.jpg'
import store from './redux/main'
import { setup } from './util/Utils'
import './notifSystem';

export let pathConfig = {}

const MainApp = React.lazy(() => {
  return Promise.all([
    import('./App'),
    new Promise((resolve) => setTimeout(resolve, 5000)),
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
          style={{ width: 112, height: 112, marginTop: -24,  }}
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

export let display2, setDisplay2;

let AppContainer = (props) => {
  ;[wallpaper, setWall] = React.useState({});
  setWallpaper = (w) => {
    setWall(w);
  }
  let [opacity, setOpacity] = React.useState(0);
  let [display, setDisplay] = React.useState('block');
  ;[display2, setDisplay2] = React.useState('block');
  
  useEffect(() => {
    [ChatWallpaper, RoomWallpaper, DesktopWallpaper].forEach((picture) => {
      const img = new Image();
      img.src = picture;
  });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      signal: controller.signal
    }
    fetch('https://config.kaspersoft.cloud', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.mainFrontend === undefined) {
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
          mainWebsocket: 'wss://kaspersoft.cloud'
        };
      }
      else {
        pathConfig = result;
      }
      setup()
      loaded = true
      setTimeout(() => {
        setDisplay('none')
      }, 1000)
    });
  }, [])

  if (!loaded) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {wallpaper === undefined ||
        wallpaper === null ? null : wallpaper.type === 'photo' ? (
          <img
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
        <PreLoading />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {wallpaper === undefined || wallpaper === null ? null : wallpaper.type ===
        'photo' ? (
        <img
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
