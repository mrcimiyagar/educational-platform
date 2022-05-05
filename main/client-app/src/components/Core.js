import React, { useEffect } from 'react'
import VideoMedia, {
  destructVideoNet,
  endVideo,
  initVideo,
  setPresenter,
  startVideo,
} from './VideoMedia'
import AudioMedia, {
  destructAudioNet,
  endAudio,
  initAudio,
  startAudio,
} from './AudioMedia'
import ScreenMedia, {
  destructScreenNet,
  endScreen,
  initScreen,
  startScreen,
} from './ScreenMedia'
import {
  Fab,
  ThemeProvider,
  createTheme,
  Drawer,
  makeStyles,
  IconButton,
  Paper,
  Typography
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
  VideocamOff
} from '@material-ui/icons'
import CallIcon from '@material-ui/icons/Call'
import CallEndIcon from '@material-ui/icons/CallEnd'
import VideocamIcon from '@material-ui/icons/Videocam'
import { Card } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import hark from 'hark'
import { colors, me, token } from '../util/settings'

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

function Core(props) {
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
  let theme2 = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#ff3300',
      },
    },
  })
  const classes = useStyles()

  let forceUpdate = useForceUpdate()
  let [videos, setVideos] = React.useState({})
  let [audios, setAudios] = React.useState({})
  let [screens, setScreens] = React.useState({})
  let [video, setVideo] = React.useState(false)
  let [audio, setAudio] = React.useState(false)
  let [screen, setScreen] = React.useState(false)
  let [connected, setConnected] = React.useState(false)
  let [pathConfig, setPathConfig] = React.useState(undefined)
  let [shownVideos, setShownVideos] = React.useState({})
  let [shownAudios, setShownAudios] = React.useState({})
  let [shownScreens, setShownScreens] = React.useState({})
  let [myUserId, setMyUserId] = React.useState(me.id)
  let [listOpen, setListOpen] = React.useState(false)
  let [screenOn, setScreenOn] = React.useState(false)
  let [sizeMode, setSizeMode] = React.useState(undefined)
  let [extWebcam, setExtWebcam] = React.useState(false)
  let [screenShareSupported, setScreenShareSupported] = React.useState(false)
  let [pinList, setPinList] = React.useState(false)
  let [webcamSize, setWebcamSize] = React.useState('big')
  let [videoAccess, setVideoAccess] = React.useState(props.videoAccess)

  let DesktopDetector = () => {
    useEffect(() => {
      setTimeout(() => {
        setSizeMode(
          window.innerWidth > 900
            ? 'desktop'
            : window.innerWidth > 600
            ? 'tablet'
            : 'mobile',
        );
        forceUpdate();
      }, 2500);
    }, []);
    window.onresize = () => {
      setSizeMode(
        window.innerWidth > 900
          ? 'desktop'
          : window.innerWidth > 600
          ? 'tablet'
          : 'mobile',
      );
      forceUpdate();
    }
    return <div />;
  }

  useEffect(() => {
    setTimeout(() => {
      var DetectRTC = require('detectrtc')
      DetectRTC.load(function () {
        setScreenShareSupported(DetectRTC.isScreenCapturingSupported)
      })
    }, 2500)
  }, [])

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
        window.parent.postMessage(
          { sender: 'conf', action: 'notifyWebcamTurnedOff' },
          pathConfig.mainFrontend,
        )
        document.getElementById('screenMax').srcObject = undefined
        document.getElementById('screenMax').style.display = 'none';
        
        document.getElementById('screenMax2').srcObject = undefined
        document.getElementById('screenMax2').style.display = 'none';
      } else if (
        shownVideos[presenter] === true &&
        shownScreens[presenter] !== true
      ) {
        setScreenOn(true)
        window.parent.postMessage(
          { sender: 'conf', action: 'detachWebcamOnMessenger' },
          pathConfig.mainFrontend,
        )
        window.parent.postMessage(
          { sender: 'conf', action: 'notifyWebcamTurnedOn' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(videos, presenter + '_video')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value;
          document.getElementById('screenMax').style.display = 'block';

          document.getElementById('screenMax2').srcObject = undefined
          document.getElementById('screenMax2').style.display = 'none';
        }
        else {
          
          document.getElementById('screenMax').srcObject = undefined;
          document.getElementById('screenMax').style.display = 'none';

          document.getElementById('screenMax2').srcObject = undefined
          document.getElementById('screenMax2').style.display = 'none';
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
        window.parent.postMessage(
          { sender: 'conf', action: 'notifyWebcamTurnedOff' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(screens, presenter + '_screen')
        if (streamPack !== undefined) {
          document.getElementById('screenMax').srcObject = streamPack.value
          document.getElementById('screenMax').style.display = 'block';
  
          document.getElementById('screenMax2').srcObject = undefined
          document.getElementById('screenMax2').style.display = 'none';
        }
        else {
          document.getElementById('screenMax').srcObject = undefined
          document.getElementById('screenMax').style.display = 'none';
  
          document.getElementById('screenMax2').srcObject = undefined
          document.getElementById('screenMax2').style.display = 'none';
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
        window.parent.postMessage(
          { sender: 'conf', action: 'notifyWebcamTurnedOn' },
          pathConfig.mainFrontend,
        )
        let streamPack = findValueByPrefix(screens, presenter + '_screen')
        let streamPack2 = findValueByPrefix(videos, presenter + '_video')
        if (streamPack !== undefined && extWebcam !== true) {
          document.getElementById('screenMax').srcObject = streamPack.value
          document.getElementById('screenMax').style.display = 'block';
        }
        else {
          document.getElementById('screenMax').srcObject = undefined
          document.getElementById('screenMax').style.display = 'none';
        }
        if (streamPack2 !== undefined) {
          document.getElementById('screenMax2').srcObject = streamPack2.value
          document.getElementById('screenMax2').style.display = 'block';
        }
        else {
          document.getElementById('screenMax2').srcObject = undefined
          document.getElementById('screenMax2').style.display = 'none';
        }
      }
    }
  }

  function Audio(props) {
    useEffect(() => {
      if (props.id !== 'me') {
        document.getElementById(props.id + '_audio').srcObject = props.stream
      }
      if (props.stream !== undefined) {
        var options = {}
        var speechEvents = hark(props.stream, options)
        speechEvents.on('speaking', function () {
          let elem = document.getElementById('audio_state_' + props.id)
          if (elem !== null) {
            elem.style.backgroundColor = '#00ccff'
          }
        })
        speechEvents.on('stopped_speaking', function () {
          let elem = document.getElementById('audio_state_' + props.id)
          if (elem !== null) {
            elem.style.backgroundColor = 'white'
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
    }, [])

    if (shownScreens[props.id] === true) {
      if (shownVideos[props.id] === true) {
        return (
          <Card
            id={props.id}
            style={{
              height: 130 + 32,
              marginTop: 16,
              width: '100%',
            }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '33%', height: 130 }}>
                <Video
                  name={title}
                  id={props.id}
                  stream={vs !== undefined ? vs.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div style={{ width: '66%', height: 130 }}>
                <Screen
                  name={title}
                  id={props.id}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div
                id={'audio_state_' + props.id}
                style={{
                  width: 40,
                  height: 130,
                  backgroundColor: 'white',
                }}
              />
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-32px)',
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
            style={{
              height: 130 + 32,
              marginTop: 16,
              width: '100%',
            }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  width: '33%',
                  height: 130,
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
              <div style={{ width: '66%', height: 130 }}>
                <Screen
                  name={title}
                  id={props.id}
                  stream={ss !== undefined ? ss.value : undefined}
                  onClick={props.onClick}
                />
              </div>
              <div
                id={'audio_state_' + props.id}
                style={{
                  width: 40,
                  height: 130,
                  backgroundColor: 'white',
                }}
              />
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-32px)',
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
            style={{
              height: 130 + 32,
              marginTop: 16,
              width: '100%',
            }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ width: '33%', height: 130 }}>
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
                  height: 130,
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
              <div
                id={'audio_state_' + props.id}
                style={{
                  width: 40,
                  height: 130,
                  backgroundColor: 'white',
                }}
              />
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-32px)',
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
            style={{
              height: 130 + 32,
              marginTop: 16,
              width: '100%',
            }}
            onClick={props.onClick}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  width: '33%',
                  height: 130,
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
                  height: 130,
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
              <div
                id={'audio_state_' + props.id}
                style={{
                  width: 40,
                  height: 130,
                  backgroundColor: 'white',
                }}
              />
            </div>
            <br />
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                transform: 'translateY(-32px)',
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
    fetch('https://config.kasperian.cloud', requestOptions)
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

  let [audioLoaded, setAudioLoaded] = React.useState(false);
  let [videoLoaded, setVideoLoaded] = React.useState(false);
  let [screenLoaded, setScreenLoaded] = React.useState(false);

  window.onmessage = (e) => {
    if (e.data.action === 'init') {
      
    } else if (e.data.action === 'extWebcam') {
      setExtWebcam(true)
    } else if (e.data.action === 'intWebcam') {
      setExtWebcam(false)
    } else if (e.data.action === 'enableVideoAccess') {
      setVideoAccess(true)
    } else if (e.data.action === 'disableVideoAccess') {
      setVideoAccess(false)
      instantConnectionFlag = false
      setConnected(false)
      window.parent.postMessage(
        { sender: 'conf', action: 'detachWebcamOnMessenger' },
        pathConfig.mainFrontend,
      )
      window.parent.postMessage(
        { sender: 'conf', action: 'notifyWebcamTurnedOff' },
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
    pathConfig === undefined
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

  let audioLoadCallback = () => {
    setAudioLoaded(true);
  };

  let videoLoadCallback = () => {
    setVideoLoaded(true);
  };

  let screenLoadCallback = () => {
    setScreenLoaded(true);
  };

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
          display: 'none',
          position: 'absolute',
          transform: sizeMode === 'mobile' ? undefined : 'translateX(-50%)',
          objectFit: 'cover',
          top: 80,
          left:
            (sizeMode === 'mobile'
              ? 0
              : (pinList
                  ? window.innerWidth > 500
                    ? 330 - 112
                    : window.innerWidth - 112
                  : 0) +
                (window.innerWidth / 2 -
                  (sizeMode === 'desktop' ||
                  (sizeMode === 'tablet' &&
                    shownScreens[presenterBackup] === true &&
                    shownVideos[presenterBackup] === true)
                    ? 225
                    : sizeMode === 'mobile'
                    ? 112
                    : 0) +
                  32) +
                (450 -
                  (webcamSize === 'big'
                    ? 450
                    : webcamSize === 'medium'
                    ? 270
                    : 150)) /
                  2) + 'px',
          width:
            (sizeMode === 'mobile'
              ? window.innerWidth
              : ((pinList
                  ? window.innerWidth > 500
                    ? -1 * (500 - 112)
                    : -1 * (window.innerWidth - 112)
                  : 0) +
                (shownScreens[presenterBackup] === true)
                  ? window.innerWidth -
                    176 -
                    (sizeMode === 'desktop'
                      ? 450
                      : shownVideos[presenterBackup] === true
                      ? 350
                      : 0)
                  : window.innerWidth / 2 -
                    (sizeMode === 'desktop' ? 225 : 0)) +
                (450 -
                  (webcamSize === 'big'
                    ? 450
                    : webcamSize === 'medium'
                    ? 270
                    : 150))) + 'px',
          height: 'auto',
        }}
      ></video>
      <video
        autoPlay
        id="screenMax2"
        style={{
          display: 'none',
          objectFit: 'cover',
          position: 'absolute',
          right: 0,
          top: 0,
          width:
            webcamSize === 'big' ? 450 : webcamSize === 'medium' ? 270 : 150,
          height:
            webcamSize === 'big' ? 300 : webcamSize === 'medium' ? 180 : 100,
        }}
        onClick={() => {
          if (webcamSize === 'big') {
            setWebcamSize('medium')
          } else if (webcamSize === 'medium') {
            setWebcamSize('small')
          } else if (webcamSize === 'small') {
            setWebcamSize('big')
          }
          forceUpdate()
        }}
      ></video>
      <Drawer
        variant={pinList ? 'permanent' : 'temporary'}
        open={listOpen}
        onClose={() => {
          window.parent.postMessage(
            { sender: 'conf', action: 'showBottomBar' },
            pathConfig.mainFrontend,
          )
          setListOpen(false)
        }}
        ModalProps={{
          keepMounted: true,
        }}
        classes={{ paper: classes.paper }}
        style={{ position: 'relative', zIndex: 2490 }}
      >
        <div
          id="participents"
          className="participents"
          style={{
            width: window.innerWidth + 'px',
            minWidth: 300,
            maxWidth: 500,
            height: 128,
            flexwrap: 'nowrap',
          }}
        >
          <IconButton
            onClick={() => {
              window.parent.postMessage(
                { sender: 'conf', action: 'showBottomBar' },
                pathConfig.mainFrontend,
              )
              setListOpen(false)
            }}
            style={{ padding: 16 }}
          >
            <Close />
          </IconButton>
          <IconButton
            onClick={() => setPinList(!pinList)}
            style={{ padding: 16 }}
          >
            {pinList ? <Attachment /> : <LinkOff />}
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
            if (shownVideos[key] !== true && shownScreens[key] !== true && shownAudios[key] !== true)
              return null
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
      <div style={{ width: '100%', height: '100%', display:  (connected && videoAccess && !extWebcam) ? 'block' : 'none'}}>
          <ThemeProvider theme={theme2}>
            <Fab
              id="listButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left: sizeMode === 'mobile' || sizeMode === 'tablet' ? 16 : 32,
                bottom: 24 + 56 + 16 + 56 + 16
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
            <Fab
              disabled={!audioLoaded}
              id="audioButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left: sizeMode === 'mobile' || sizeMode === 'tablet' ? 16 : 32,
                bottom: 24 + 56 + 16,
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
                left: sizeMode === 'mobile' || sizeMode === 'tablet' ? 16 : 32,
                bottom: 24,
                backgroundColor: '#ff3300'
              }}
              onClick={() => {
                instantConnectionFlag = false
                setConnected(false)
                window.parent.postMessage(
                  { sender: 'conf', action: 'detachWebcamOnMessenger' },
                  pathConfig.mainFrontend,
                )
                window.parent.postMessage(
                  { sender: 'conf', action: 'notifyWebcamTurnedOff' },
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
                setAudioLoaded(false);
                setVideoLoaded(false);
                setScreenLoaded(false);
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
              disabled={!videoLoaded}
              id="camButton"
              color={'primary'}
              style={{
                position: 'absolute',
                left:
                  (screenShareSupported ? 32 + 56 : 0) +
                  (sizeMode === 'mobile' || sizeMode === 'tablet' ? 0 : 16) +
                  72,
                bottom: 24,
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
                disabled={!screenLoaded}
                id="screenButton"
                color={'primary'}
                style={{
                  position: 'absolute',
                  left:
                    32 +
                    56 +
                    (sizeMode === 'mobile' || sizeMode === 'tablet' ? 0 : 16),
                  bottom: 24,
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
          </ThemeProvider>
          <VideoMedia
            shownUsers={shownVideos}
            data={videos}
            updateData={onVideoStreamUpdate}
            forceUpdate={forceUpdate}
            userId={me.id}
            roomId={props.moduleWorkerId}
            loadedCallback={videoLoadCallback}
          />
          <AudioMedia
            shownUsers={shownAudios}
            data={audios}
            updateData={onAudioStreamUpdate}
            forceUpdate={forceUpdate}
            userId={me.id}
            roomId={props.moduleWorkerId}
            loadedCallback={audioLoadCallback}
          />
          <ScreenMedia
            shownUsers={shownScreens}
            data={screens}
            updateData={onScreenStreamUpdate}
            forceUpdate={forceUpdate}
            userId={me.id}
            roomId={props.moduleWorkerId}
            loadedCallback={screenLoadCallback}
          />
      </div>
      <ThemeProvider theme={theme}>
          <Fab
            id="callButton"
            color={'secondary'}
            style={{
              display: (!connected && videoAccess) ? 'block' : 'none',
              position: 'fixed',
              left: (sizeMode === 'mobile' || sizeMode === 'tablet') ? 16 : 32,
              bottom: 24
            }}
            onClick={() => {
              instantConnectionFlag = true;
              setConnected(true);
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'token': token
                },
                body: JSON.stringify({
                  roomId: props.roomId,
                  moduleWorkerId: props.moduleWorkerId
                }),
                redirect: 'follow',
              }
              fetch(pathConfig.mainBackend + '/video/notify_calling', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(result);
                });
            }}
          >
            <CallIcon style={{ fill: '#333' }} />
          </Fab>
          <Paper
            id="descriptionPanel"
            style={{
              display: (!connected && videoAccess) ? 'block' : 'none',
              position: 'fixed',
              top: '50%',
              left: sizeMode === 'desktop' ? 'calc(50% - 225px)' : '50%',
              transform: 'translate(-50%, -50%)',
              width: '65%',
              height: 'auto',
              paddingTop: 24,
              paddingLeft: 16,
              paddingRight: 16,
              paddingBottom: 24,
              maxWidth: 250,
              backgroundColor: colors.primaryMedium,
              backdropFilter: 'blur(15px)',
              borderRadius: 24
            }}
          >
            <Typography style={{color: '#fff', fontSize: 18, textAlign: 'right', justifyContent: 'right', alignItems: 'right'}}>
              به پنل ویدئو خوش آمدید . از این ماژول می توانید برای برقراری تماس ویدئویی , کنفرانس و وبینار استفاده نمایید
            </Typography>
          </Paper>
      </ThemeProvider>
    </div>
  )
}

export default Core;
