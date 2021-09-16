import { TailSpin, useLoading } from '@agney/react-loading'
import { Typography } from '@material-ui/core'
import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import CloudIcon from './images/logo.png'
import RoomWallpaper from './images/roomWallpaper.png'
import store from './redux/main'
import DesktopWallpaper from './images/desktop-wallpaper.webp'
import DesktopWallpaper2 from './images/desktop-wallpaper.jpg'
import { setup } from './util/Utils'

export let pathConfig = {}

const MainApp = React.lazy(() => {
  return Promise.all([
    import('./App'),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]).then(([moduleExports]) => moduleExports)
})

let Loading = (props) => {
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
          style={{ width: 176, height: 176, marginTop: -24 }}
        />
        <Typography
          variant={'h5'}
          style={{
            width: '100%',
            marginTop: -24,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          ابر آسمان
        </Typography>
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {indicatorEl}
        </div>
      </div>
    </section>
  )
}

export let setWallpaper = undefined,
  wallpaper = undefined
let setWall = undefined
let loaded = false

let AppContainer = (props) => {
  ;[wallpaper, setWall] = React.useState({ type: '' })
  setWallpaper = (w) => {
    setWall(w)
  }
  let [opacity, setOpacity] = React.useState(0)
  let [display, setDisplay] = React.useState('block')
  useEffect(() => {
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
          setOpacity(1)
          setTimeout(() => {
            setOpacity(0)
            setTimeout(() => {
              setDisplay('none')
            }, 750)
          }, 1000)
        }, 4000)
      })
  }, [])

  if (!loaded) return <div/>

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
      <Suspense
        fallback={
          <div
            style={{
              width: '100%',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
            }}
          >
            <img
              style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                left: 0,
                top: 0,
                objectFit: 'fill',
              }}
              src={DesktopWallpaper}
            />
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                position: 'fixed',
                top: 0,
                left: 0,
              }}
            />
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
        }
      >
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

require('./pushClient');