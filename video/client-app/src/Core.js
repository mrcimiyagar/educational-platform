import React, { useEffect } from 'react'
import VideoMedia, {
  destructVideoNet,
  endVideo,
  initVideo,
  setPresenter,
  startVideo,
} from './components/VideoMedia'
import AudioMedia, {
  destructAudioNet,
  endAudio,
  initAudio,
  startAudio,
} from './components/AudioMedia'
import ScreenMedia, {
  destructScreenNet,
  endScreen,
  initScreen,
  startScreen,
} from './components/ScreenMedia'
import {
  Fab,
  ThemeProvider,
  createTheme,
  Drawer,
  makeStyles,
  IconButton,
} from '@material-ui/core'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled'
import {
  ArrowForward,
  Attachment,
  Close,
  LinkOff,
  Mic,
  MicOff,
  Notes,
  VideocamOff,
} from '@material-ui/icons'
import CallIcon from '@material-ui/icons/Call'
import CallEndIcon from '@material-ui/icons/CallEnd'
import VideocamIcon from '@material-ui/icons/Videocam'
import { Card } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import hark from 'hark'

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

function getRandomColor() {
  return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255,
  )}, ${Math.floor(Math.random() * 255)}, 0.5)`
}

function Video(props) {
  useEffect(() => {
    document.getElementById(props.id + '_video').srcObject = props.stream
  }, [])
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        autoPlay
        controls={false}
        muted
        id={props.id + '_video'}
        style={{
          backgroundColor: props.disabled === true ? 'white' : undefined,
          width: '100%',
          height: '100%',
        }}
        onClick={props.onClick}
      />
      {props.disabled === true ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: getRandomColor(),
              borderRadius: 40,
              padding: 32,
              fontSize: 20,
            }}
          >
            {props.name.charAt(0)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Screen(props) {
  useEffect(() => {
    document.getElementById(props.id + '_screen').srcObject = props.stream
  }, [])
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        autoPlay
        controls={false}
        muted
        id={props.id + '_screen'}
        style={{
          backgroundColor: props.disabled === true ? 'white' : undefined,
          width: '100%',
          height: '100%',
        }}
        onClick={props.onClick}
      />
      {props.disabled === true ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: getRandomColor(),
              borderRadius: 40,
              padding: 32,
              fontSize: 20,
            }}
          >
            {props.name.charAt(0)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const useStyles = makeStyles({
  paper: {
    background: '#ddd',
  },
})

let videoCache = {}
let needUpdate = {}
let audioCache = {}
let audioNeedUpdate = {}
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
  const classes = useStyles()

  let forceUpdate = useForceUpdate();
  let [videos, setVideos] = React.useState({});
  let [audios, setAudios] = React.useState({});
  let [screens, setScreens] = React.useState({});
  let [video, setVideo] = React.useState(false);
  let [audio, setAudio] = React.useState(false);
  let [screen, setScreen] = React.useState(false);
  let [connected, setConnected] = React.useState(false);
  let [pathConfig, setPathConfig] = React.useState(undefined);
  let [me, setMe] = React.useState(undefined);
  let [roomId, setRoomId] = React.useState(undefined);
  let [shownVideos, setShownVideos] = React.useState({});
  let [shownAudios, setShownAudios] = React.useState({});
  let [shownScreens, setShownScreens] = React.useState({});
  let [myUserId, setMyUserId] = React.useState(undefined);
  let [listOpen, setListOpen] = React.useState(false);
  let [screenOn, setScreenOn] = React.useState(false);
  let [sizeMode, setSizeMode] = React.useState(undefined);
  let [extWebcam, setExtWebcam] = React.useState(false);
  let [screenShareSupported, setScreenShareSupported] = React.useState(false);
  let [pinList, setPinList] = React.useState(false);

  let DesktopDetector = () => {
    useEffect(() => {
      setTimeout(() => {
        setSizeMode(
          window.innerWidth > 1400
            ? 'desktop'
            : window.innerWidth > 900
            ? 'tablet'
            : 'mobile'
        );
      }, 2500);
    }, []);
    window.onresize = () => {
      setSizeMode(
        window.innerWidth > 1400
          ? 'desktop'
          : window.innerWidth > 900
          ? 'tablet'
          : 'mobile'
      );
    }
    return <div />
  }

  useEffect(() => {
    setTimeout(() => {
      var DetectRTC = require('detectrtc');
      DetectRTC.load(function () {
        setScreenShareSupported(DetectRTC.isScreenCapturingSupported);
      });
    }, 2500);
  }, []);

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
        document.getElementById('screenMax2').srcObject = undefined
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
          document.getElementById('screenMax2').srcObject = undefined
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
          document.getElementById('screenMax2').srcObject = undefined
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
        let streamPack2 = findValueByPrefix(videos, presenter + '_video')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value
        }
        if (streamPack2 !== undefined) {
          document.getElementById('screenMax2').srcObject = streamPack2.value
        }
      }
    }
  }

  function Audio(props) {
    useEffect(() => {
      if (props.id !== 'me') {
        document.getElementById(props.id + '_audio').srcObject = props.stream;
      }
      if (props.stream !== undefined) {
        var options = {}
        var speechEvents = hark(props.stream, options)
        speechEvents.on('speaking', function () {
          let elem = document.getElementById('audio_state_' + props.id);
          if (elem !== null) {
            elem.style.backgroundColor = '#00ccff';
          }
        })
        speechEvents.on('stopped_speaking', function () {
          let elem = document.getElementById('audio_state_' + props.id);
          if (elem !== null) {
            elem.style.backgroundColor = 'white';
          }
        })
      }
    }, [])
    return <audio autoPlay id={props.id + '_audio'} />
  }

  function MediaBox(props) {
    let vs = findValueByPrefix(videos, props.id + '_video')
    let ss = findValueByPrefix(screens, props.id + '_screen')

    let [title, setTitle] = React.useState('')

    useEffect(() => {
      let requestOptions2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.id === 'me' ? myUserId : props.id,
        }),
        redirect: 'follow',
      }
      fetch(pathConfig.mainBackend + '/auth/get_user', requestOptions2)
        .then((response) => response.json())
        .then((result) => {
          let user = result.user
          setTitle(user.firstName + ' ' + user.lastName)
        })
    })

    if (shownScreens[props.id] === true) {
      if (shownVideos[props.id] === true) {
        return (
          <Card
            id={props.id}
            style={{ height: (256 + 128) / 2 + 32, marginTop: 16, width: '100%' }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '33%', height: (256 + 128) / 2 }}>
                <Video
                  name={title}
                  id={props.id}
                  stream={vs !== undefined ? vs.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div style={{ width: '66%', height: (256 + 128) / 2 }}>
                <Screen
                  name={title}
                  id={props.id}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div id={'audio_state_' + props.id} style={{width: 40, height: (256 + 128) / 2, backgroundColor: 'white'}}/>
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-16px)',
                width: '100%',
              }}
            >
              {title}
            </div>
          </Card>
        )
      } else {
        return (
          <Card
            id={props.id}
            style={{ height: (256 + 128) / 2 + 32, marginTop: 16, width: '100%'}}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  width: '33%',
                  height: (256 + 128) / 2,
                }}
              >
                <Video
                  name={title}
                  id={props.id}
                  disabled={true}
                  stream={vs !== undefined ? vs.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div style={{ width: '66%', height: (256 + 128) / 2 }}>
                <Screen
                  name={title}
                  id={props.id}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div id={'audio_state_' + props.id} style={{width: 40, height: (256 + 128) / 2, backgroundColor: 'white'}}/>
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-16px)',
                width: '100%',
              }}
            >
              {title}
            </div>
          </Card>
        )
      }
    } else {
      if (shownVideos[props.id] === true) {
        return (
          <Card
            id={props.id}
            style={{ height: (256 + 128) / 2 + 32, marginTop: 16, width: '100%'}}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '33%', height: (256 + 128) / 2 }}>
                <Video
                  name={title}
                  id={props.id}
                  stream={vs !== undefined ? vs.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div
                style={{
                  width: '66%',
                  height: (256 + 128) / 2,
                }}
              >
                <Screen
                  name={title}
                  id={props.id}
                  disabled={true}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div id={'audio_state_' + props.id} style={{width: 40, height: (256 + 128) / 2, backgroundColor: 'white'}}/>
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-16px)',
                width: '100%',
              }}
            >
              {title}
            </div>
          </Card>
        )
      } else {
        return (
          <Card
            id={props.id}
            style={{ height: (256 + 128) / 2 + 32, marginTop: 16, width: '100%' }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  width: '33%',
                  height: (256 + 128) / 2,
                }}
              >
                <Video
                  name={title}
                  id={props.id}
                  disabled={true}
                  stream={vs !== undefined ? vs.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div
                style={{
                  width: '66%',
                  height: (256 + 128) / 2,
                }}
              >
                <Screen
                  name={title}
                  id={props.id}
                  disabled={true}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div id={'audio_state_' + props.id} style={{width: 40, height: (256 + 128) / 2, backgroundColor: 'white'}}/>
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-16px)',
                width: '100%',
              }}
            >
              {title}
            </div>
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
    } else if (e.data.action === 'extWebcam') {
      setExtWebcam(true)
    } else if (e.data.action === 'intWebcam') {
      setExtWebcam(false)
    }
  }

  var result = Object.keys(videos).concat(Object.keys(screens)).unique()
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
    audioNeedUpdate[userId] = true
    notifyWebcamActivated()
  }
  let onScreenStreamUpdate = (userId) => {
    needUpdate[userId] = true
    notifyWebcamActivated()
  }

  let theme2 = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#ff3300',
      },
    },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexwrap: 'wrap',
      }}
    >
      <DesktopDetector />
      <video
        id="screenMax"
        autoPlay
        style={{
          position: 'absolute',
          transform: sizeMode === 'mobile' ? undefined : 'translateX(-50%)',
          objectFit: 'cover',
          top: 80,
          left:
            (pinList ? (window.innerWidth > 500 ? (500 - 112) : (window.innerWidth - 112)) : 0) +
              (sizeMode === 'mobile' ? 0 :
                (window.innerWidth / 2 - ((sizeMode === 'desktop' || (sizeMode === 'tablet' && shownScreens[presenterBackup] === true && shownVideos[presenterBackup] === true)) ? 225 : (sizeMode === 'mobile') ? 112 : 0) + 32)) + 'px',
          width:
            (pinList ? (window.innerWidth > 500 ? (-1 * (500 - 112)) : (-1 * window.innerWidth - 112)) : 0) +
              sizeMode === 'mobile' ? '100%' :
                (shownScreens[presenterBackup] === true)
                  ? (window.innerWidth - 176 - (sizeMode === 'desktop' ? 450 : (shownVideos[presenterBackup] === true ? 350 : 0)) + 'px')
                  : (window.innerWidth / 2 - (sizeMode === 'desktop' ? 225 : 0)) + 'px',
          height: 'auto',
        }}
      ></video>
      <video
        autoPlay
        id="screenMax2"
        style={{
          objectFit: 'cover',
          position: 'absolute',
          right: 0,
          top: sizeMode === 'mobile' ? (window.innerWidth * 4 / 5 - 0 + 'px') : 0,
          width: 450,
          height: 300,
        }}
      ></video>
      <Drawer
        variant={pinList ? "permanent" : 'temporary'}
        open={listOpen}
        onClose={() => {
          window.parent.postMessage(
            { sender: 'conf', action: 'showBottomBar' },
            pathConfig.mainFrontend,
          )
          setListOpen(false)
        }}
        ModalProps={{
          keepMounted: true
        }}
        classes={{ paper: classes.paper }}
        style={{ position: 'relative', zIndex: 2490 }}
      >
        <div
          id="participents"
          className="participents"
          style={{ width: window.innerWidth + 'px', minWidth: 300, maxWidth: 500, height: 128, flexwrap: 'nowrap' }}
        >
          <IconButton onClick={() => setListOpen(false)} style={{padding: 16}}>
            <Close/>
          </IconButton>
          <IconButton onClick={() => setPinList(!pinList)} style={{padding: 16}}>
            {
              pinList ? <Attachment/> : <LinkOff/>
            }
          </IconButton>
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
      <div>
        {Object.keys(shownAudios).map((key) => {
          if (myUserId === key) return null
          if (shownAudios[key] === undefined) return null
          return <Audio id={key} stream={audios[key + '_audio']} />
        })}
      </div>
      {connected && !extWebcam ? (
        <div style={{ width: '100%', height: '100%' }}>
          <ThemeProvider theme={theme2}>
            <Fab
              id="audioButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left: window.innerWidth <= 1400 ? 16 : 32,
                bottom:
                  window.innerWidth <= 1400 ? 48 + 104 + 56 + 16 : 48 + 56 + 16,
              }}
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
              style={{
                position: 'absolute',
                left: window.innerWidth <= 1400 ? 16 : 32,
                bottom: window.innerWidth <= 1400 ? 48 + 104 : 48,
              }}
              onClick={() => {
                instantConnectionFlag = false
                setConnected(false)
                window.parent.postMessage(
                  { sender: 'conf', action: 'detachWebcamOnMessenger' },
                  pathConfig.mainFrontend,
                )
                setScreenOn(false)
                document.getElementById('screenMax').srcObject = undefined
                document.getElementById('screenMax2').srcObject = undefined
                endAudio()
                destructAudioNet()
                endVideo()
                destructVideoNet()
                endScreen()
                destructScreenNet()
                setVideos({})
                setAudios({})
                setScreens({})
                setVideo(false)
                setAudio(false)
                setScreen(false)
                setShownVideos({})
                setShownAudios({})
                setShownScreens({})
                setListOpen(false)
                setExtWebcam(false)
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
                left:
                  (screenShareSupported ? 32 + 56 : 0) +
                  (window.innerWidth <= 1400 ? 0 : 16) +
                  72,
                bottom: window.innerWidth <= 1400 ? 48 + 104 : 48,
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
            {screenShareSupported ? (
              <Fab
                id="screenButton"
                color={'primary'}
                style={{
                  position: 'absolute',
                  left: 32 + 56 + (window.innerWidth <= 1400 ? 0 : 16),
                  bottom: window.innerWidth <= 1400 ? 48 + 104 : 48,
                }}
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
                {screen ? (
                  <DesktopWindowsIcon />
                ) : (
                  <DesktopAccessDisabledIcon />
                )}
              </Fab>
            ) : null}
            <Fab
              id="listButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left:
                  (screenShareSupported ? 32 + 56 : 0) +
                  (window.innerWidth <= 1400 ? 0 : 16) +
                  56 +
                  16 +
                  56 +
                  16,
                bottom: window.innerWidth <= 1400 ? 48 + 104 : 48,
              }}
              onClick={() => {
                window.parent.postMessage(
                  { sender: 'conf', action: 'hideBottomBar' },
                  pathConfig.mainFrontend,
                )
                setListOpen(true)
              }}
            >
              <MenuIcon />
            </Fab>
          </ThemeProvider>
          <VideoMedia
            shownUsers={shownVideos}
            data={videos}
            updateData={onVideoStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={roomId}
          />
          <AudioMedia
            shownUsers={shownAudios}
            data={audios}
            updateData={onAudioStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={roomId}
          />
          <ScreenMedia
            shownUsers={shownScreens}
            data={screens}
            updateData={onScreenStreamUpdate}
            forceUpdate={forceUpdate}
            userId={myUserId}
            roomId={roomId}
          />
        </div>
      ) : !connected ? (
        <ThemeProvider theme={theme}>
          <Fab
            id="callButton"
            color={'secondary'}
            style={{
              position: 'absolute',
              left: window.innerWidth <= 1400 ? 16 : 32,
              bottom: window.innerWidth <= 1400 ? 48 + 104 : 48,
            }}
            onClick={() => {
              instantConnectionFlag = true
              setConnected(true)
            }}
          >
            <CallIcon style={{ fill: '#333' }} />
          </Fab>
        </ThemeProvider>
      ) : null}
    </div>
  )
}

export default App
