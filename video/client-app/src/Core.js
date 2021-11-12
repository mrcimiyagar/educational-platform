import React, { useEffect } from 'react'
import VideoMedia, {
  endVideo,
  initVideo,
  setPresenter,
  startVideo,
} from './components/VideoMedia'
import AudioMedia, {
  endAudio,
  initAudio,
  startAudio,
} from './components/AudioMedia'
import ScreenMedia, {
  endScreen,
  initScreen,
  startScreen,
} from './components/ScreenMedia'
import { Fab, ThemeProvider, createTheme, Drawer } from '@material-ui/core'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled'
import {
  ArrowForward,
  Mic,
  MicOff,
  Notes,
  VideocamOff,
} from '@material-ui/icons'
import CallIcon from '@material-ui/icons/Call'
import CallEndIcon from '@material-ui/icons/CallEnd'
import VideocamIcon from '@material-ui/icons/Videocam'
import { Card } from '@material-ui/core'

function useForceUpdate() {
  const [value, setValue] = React.useState(0) // integer state
  return () => setValue((value) => ++value) // update the state to force render
}

function findValueByPrefix(object, prefix) {
  for (var property in object) {
    if (
      object.hasOwnProperty(property) &&
      property.toString().startsWith(prefix)
    ) {
      return { value: object[property], key: property }
    }
  }
}

Array.prototype.unique = function () {
  var a = this.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }

  return a
}

function Video(props) {
  useEffect(() => {
    document.getElementById(props.id + '_video').srcObject = props.stream
  }, [])
  return (
    <video
      autoPlay
      controls
      muted
      id={props.id + '_video'}
      style={{ width: '100%', height: '100%' }}
      onClick={props.onClick}
    />
  )
}

function Screen(props) {
  useEffect(() => {
    document.getElementById(props.id + '_screen').srcObject = props.stream
  }, [])
  return (
    <video
      autoPlay
      controls
      muted
      id={props.id + '_screen'}
      style={{ width: '100%', height: '100%' }}
      onClick={props.onClick}
    />
  )
}

function Audio(props) {
  useEffect(() => {
    document.getElementById(props.id + '_audio').srcObject = props.stream
  }, [])
  return <audio autoPlay id={props.id + '_audio'} />
}

let videoCache = {}
let needUpdate = {}
let presenterBackup = undefined
let instantConnectionFlag = false

function App() {
  let theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#FFC107',
      },
    },
  })

  let forceUpdate = useForceUpdate()
  let [videos, setVideos] = React.useState({})
  let [audios, setAudios] = React.useState({})
  let [screens, setScreens] = React.useState({})
  let [video, setVideo] = React.useState(false)
  let [audio, setAudio] = React.useState(false)
  let [screen, setScreen] = React.useState(false)
  let [connected, setConnected] = React.useState(false)
  let [pathConfig, setPathConfig] = React.useState(undefined)
  let [me, setMe] = React.useState(undefined)
  let [roomId, setRoomId] = React.useState(undefined)
  let [shownVideos, setShownVideos] = React.useState({})
  let [shownAudios, setShownAudios] = React.useState({})
  let [shownScreens, setShownScreens] = React.useState({})
  let [myUserId, setMyUserId] = React.useState(undefined)
  let [listOpen, setListOpen] = React.useState(false)
  let [screenOn, setScreenOn] = React.useState(false)
  let [sizeMode, setSizeMode] = React.useState(undefined);

  let DesktopDetector = () => {
    ;[sizeMode, setSizeMode] = React.useState(
      window.innerWidth > 1400
        ? 'desktop'
        : window.innerWidth > 900
        ? 'tablet'
        : 'mobile',
    )
    window.onresize = () => {
      setSizeMode(
        window.innerWidth > 1400
          ? 'desktop'
          : window.innerWidth > 900
          ? 'tablet'
          : 'mobile',
      )
      forceUpdate();
    }
    return <div />
  }

  let isDesktop = () => {
    return sizeMode === 'desktop';
  }

  let updatePresenter = (presenter) => {
    if (instantConnectionFlag) {
      presenterBackup = presenter
      setPresenter(presenter === 'me' ? myUserId : presenter)
      if (shownVideos[presenter] !== true && shownScreens[presenter] !== true) {
        setScreenOn(false)
        window.parent.postMessage(
          { sender: 'conf', action: 'detachWebcamOnMessenger' },
          pathConfig.mainFrontend,
        )
        document.getElementById('screenMax').srcObject = undefined
      } else if (
        shownVideos[presenter] === true &&
        shownScreens[presenter] !== true
      ) {
        setScreenOn(true)
        window.parent.postMessage(
          { sender: 'conf', action: 'detachWebcamOnMessenger' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(videos, presenter + '_video')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value
        }
      } else if (
        shownVideos[presenter] !== true &&
        shownScreens[presenter] === true
      ) {
        setScreenOn(true)
        window.parent.postMessage(
          { sender: 'conf', action: 'detachWebcamOnMessenger' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(screens, presenter + '_screen')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value
        }
      } else if (
        shownVideos[presenter] === true &&
        shownScreens[presenter] === true
      ) {
        setScreenOn(true)
        window.parent.postMessage(
          { sender: 'conf', action: 'attachWebcamOnMessenger' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(screens, presenter + '_screen')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value
        }
      }
    }
  }

  function MediaBox(props) {
    let vs = findValueByPrefix(videos, props.id + '_video')
    let ss = findValueByPrefix(screens, props.id + '_screen')
    let as = findValueByPrefix(audios, props.id + '_audio')

    if (shownScreens[props.id] === true) {
      if (shownVideos[props.id] === true) {
        return (
          <Card
            id={props.id}
            style={{ display: 'flex', height: (256 + 128) / 2 }}
            onClick={props.onClick}
          >
            <div style={{ width: (256 + 128) / 2, height: (256 + 128) / 2 }}>
              <Video
                id={props.id}
                stream={vs !== undefined ? vs.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <div style={{ width: 256 + 128, height: (256 + 128) / 2 }}>
              <Screen
                id={props.id}
                stream={ss !== undefined ? ss.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <Audio
              id={props.id}
              stream={as !== undefined ? as.value : undefined}
            />
          </Card>
        )
      } else {
        return (
          <Card
            id={props.id}
            style={{ display: 'flex', height: (256 + 128) / 2 }}
            onClick={props.onClick}
          >
            <div
              style={{
                width: (256 + 128) / 2,
                height: (256 + 128) / 2,
                display: 'none',
              }}
            >
              <Video
                id={props.id}
                stream={vs !== undefined ? vs.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <div style={{ width: 256 + 128, height: (256 + 128) / 2 }}>
              <Screen
                id={props.id}
                stream={ss !== undefined ? ss.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <Audio
              id={props.id}
              stream={as !== undefined ? as.value : undefined}
            />
          </Card>
        )
      }
    } else {
      if (shownVideos[props.id] === true) {
        return (
          <Card
            id={props.id}
            style={{ display: 'flex', height: (256 + 128) / 2 }}
            onClick={props.onClick}
          >
            <div style={{ width: (256 + 128) / 2, height: (256 + 128) / 2 }}>
              <Video
                id={props.id}
                stream={vs !== undefined ? vs.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <div
              style={{
                width: 256 + 128,
                height: (256 + 128) / 2,
                display: 'none',
              }}
            >
              <Screen
                id={props.id}
                stream={ss !== undefined ? ss.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <Audio
              id={props.id}
              stream={as !== undefined ? as.value : undefined}
            />
          </Card>
        )
      } else {
        return (
          <Card
            id={props.id}
            style={{ display: 'flex', height: (256 + 128) / 2 }}
            onClick={props.onClick}
          >
            <div
              style={{
                width: (256 + 128) / 2,
                height: (256 + 128) / 2,
                display: 'none',
              }}
            >
              <Video
                id={props.id}
                stream={vs !== undefined ? vs.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <div
              style={{
                width: 256 + 128,
                height: (256 + 128) / 2,
                display: 'none',
              }}
            >
              <Screen
                id={props.id}
                stream={ss !== undefined ? ss.value : undefined}
                onClick={props.onClick}
              />
            </div>
            <Audio
              id={props.id}
              stream={as !== undefined ? as.value : undefined}
            />
          </Card>
        )
      }
    }
  }

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
        setPathConfig(result)
      })
  }, [])

  useEffect(() => {
    if (connected) {
      initVideo()
      initScreen()
      initAudio()
    }
  }, [connected])

  window.onmessage = (e) => {
    if (e.data.action === 'init') {
      setMe(e.data.me)
      setRoomId(e.data.roomId)
      setMyUserId(e.data.me.id)
    }
  }

  var result = Object.keys(videos).concat(Object.keys(audios)).unique()
  result = result.concat(Object.keys(screens)).unique()
  let tempResult = []
  result.forEach((item) => {
    let keyParts = item.split('_')
    tempResult.push(keyParts[0])
  })
  result = tempResult.unique()

  if (
    pathConfig === undefined ||
    me === undefined ||
    roomId === undefined ||
    myUserId === undefined
  ) {
    return <div />
  }

  let notifyWebcamActivated = () => {
    if (connected && screenOn && presenterBackup !== undefined) {
      setTimeout(() => {
        updatePresenter(presenterBackup)
      }, 1000)
    }
  }

  let onVideoStreamUpdate = (userId) => {
    needUpdate[userId] = true
    notifyWebcamActivated()
  }
  let onAudioStreamUpdate = (userId) => {
    needUpdate[userId] = true
    notifyWebcamActivated()
  }
  let onScreenStreamUpdate = (userId) => {
    needUpdate[userId] = true
    notifyWebcamActivated()
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexwrap: 'wrap',
      }}
    >
      <DesktopDetector/>
      <div
        id="max"
        style={{
          width: 'calc(100% - 96px - 32px)',
          height: 'calc(100% - 384px)',
          position: 'relative',
          marginLeft: shownScreens[presenterBackup] === true ?  (96 + 32) : (isDesktop() ? 'calc(96px + 32px + 50% - 500px)' : 'calc(96px + 32px + 50% - 300px)'),
          display: screenOn && connected ? 'block' : 'none',
        }}
      >
        <video
          autoPlay
          id="webcamMax"
          style={{
            display: 'none',
            objectFit: 'cover',
            width: '200px',
            height: '200px',
          }}
        ></video>
        <video
          id="screenMax"
          autoPlay
          style={{
            transform: 'rotateY(0)',
            objectFit: 'cover',
            width: shownScreens[presenterBackup] === true ? window.innerWidth - 176 + 'px' : (window.innerWidth / 2) + 'px',
            height: 'auto',
          }}
        ></video>
      </div>
      <Drawer
        open={listOpen}
        onClose={() => {
          window.parent.postMessage(
            { sender: 'conf', action: 'showBottomBar' },
            pathConfig.mainFrontend,
          )
          setListOpen(false)
        }}
        style={{ position: 'relative', zIndex: 2490 }}
      >
        <div
          id="participents"
          className="participents"
          style={{ width: '100%', height: 128, flexwrap: 'nowrap' }}
        >
          {result.map((key) => {
            if (needUpdate[key] === true || videoCache[key] === undefined) {
              videoCache[key] = (
                <MediaBox
                  id={key}
                  onClick={() => {
                    updatePresenter(key)
                  }}
                />
              )
              delete needUpdate[key]
            }
            if (myUserId === key) return null
            return videoCache[key]
          })}
        </div>
      </Drawer>
      <div style={{ width: '100%', height: 128 }}></div>
      {connected ? (
        <div style={{ width: '100%', height: '100%' }}>
          <ThemeProvider theme={theme}>
            <Fab
              id="audioButton"
              color={'primary'}
              style={{ position: 'absolute', left: 16, bottom: 48 + 56 + 16 }}
              onClick={() => {
                if (audio) {
                  endAudio()
                  setAudio(false)
                } else {
                  startAudio()
                  setAudio(true)
                }
                forceUpdate()
              }}
            >
              {audio ? <Mic /> : <MicOff />}
            </Fab>
            <Fab
              id="endCallButton"
              color={'secondary'}
              style={{ position: 'absolute', left: 16, bottom: 48 }}
              onClick={() => {
                instantConnectionFlag = false
                setConnected(false)
                window.parent.postMessage(
                  { sender: 'conf', action: 'detachWebcamOnMessenger' },
                  pathConfig.mainFrontend,
                )
                setScreenOn(false)
                document.getElementById('screenMax').srcObject = undefined
                endAudio()
                setAudio(false)
                endVideo()
                setVideo(false)
                endScreen()
                setScreen(false)
                forceUpdate()
              }}
            >
              <CallEndIcon />
            </Fab>
            <Fab
              id="camButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left: 16 + 56 + 16 + 72,
                bottom: 48,
              }}
              onClick={() => {
                if (video) {
                  endVideo()
                  setVideo(false)
                } else {
                  startVideo()
                  setVideo(true)
                }
                forceUpdate()
              }}
            >
              {video ? <VideocamIcon /> : <VideocamOff />}
            </Fab>
            <Fab
              id="screenButton"
              color={'primary'}
              style={{ position: 'absolute', left: 16 + 56 + 16, bottom: 48 }}
              onClick={() => {
                if (screen) {
                  endScreen()
                  setScreen(false)
                } else {
                  startScreen()
                  setScreen(true)
                }
                forceUpdate()
              }}
            >
              {screen ? <DesktopWindowsIcon /> : <DesktopAccessDisabledIcon />}
            </Fab>
            <Fab
              id="screenButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left: 16 + 56 + 16 + 56 + 16 + 56 + 16,
                bottom: 48,
              }}
              onClick={() => {
                window.parent.postMessage(
                  { sender: 'conf', action: 'hideBottomBar' },
                  pathConfig.mainFrontend,
                )
                setListOpen(true)
              }}
            >
              <DesktopWindowsIcon />
            </Fab>
          </ThemeProvider>
          <VideoMedia
            shownUsers={shownVideos}
            data={videos}
            updateData={onVideoStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={1}
          />
          <AudioMedia
            shownUsers={shownAudios}
            data={audios}
            updateData={onAudioStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={1}
          />
          <ScreenMedia
            shownUsers={shownScreens}
            data={screens}
            updateData={onScreenStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={1}
          />
        </div>
      ) : !connected ? (
        <ThemeProvider theme={theme}>
          <Fab
            id="callButton"
            color={'secondary'}
            style={{ position: 'absolute', left: isDesktop() ? 16 : 0, bottom: isDesktop() ? 48 : 60 }}
            onClick={() => {
              instantConnectionFlag = true
              setConnected(true)
            }}
          >
            <CallIcon style={{ fill: '#fff' }} />
          </Fab>
        </ThemeProvider>
      ) : null}
    </div>
  )
}

export default App
