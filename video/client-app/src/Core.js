import React, { useEffect } from 'react';
import VideoMedia, { endVideo, initVideo, startVideo } from './components/VideoMedia';
import AudioMedia, { endAudio, initAudio, startAudio } from './components/AudioMedia';
import ScreenMedia, { endScreen, initScreen, startScreen } from './components/ScreenMedia';
import {Fab, ThemeProvider, createTheme} from '@material-ui/core';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import { ArrowForward, Mic, MicOff, Notes, VideocamOff } from "@material-ui/icons";
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';

function useForceUpdate(){
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

function findValueByPrefix(object, prefix) {
  for (var property in object) {
    if (object.hasOwnProperty(property) && 
       property.toString().startsWith(prefix)) {
       return {value: object[property], key: property};
    }
  }
}

Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
};

function Video(props) {
  videoUpdaters[props.id].video = useForceUpdate();
  useEffect(() => {
    document.getElementById(props.id + '_video').srcObject = props.stream;
  }, [])
  return (
    <video autoPlay controls muted id={props.id + '_video'} style={{width: '100%', height: '100%'}} onClick={props.onClick}/>
  );
}

function Screen(props) {
  videoUpdaters[props.id].screen = useForceUpdate();
  useEffect(() => {
    document.getElementById(props.id + '_screen').srcObject = props.stream;
  }, [])
  return (
    <video autoPlay controls muted id={props.id + '_screen'} style={{width: '100%', height: '100%'}} onClick={props.onClick}/>
  );
}

function Audio(props) {
  videoUpdaters[props.id].audio = useForceUpdate();
  useEffect(() => {
    document.getElementById(props.id + '_audio').srcObject = props.stream;
  }, [])
  return (
    <audio autoPlay id={props.id + '_audio'}/>
  );
}

let videoCache = {};
let videoUpdaters = {};
let needUpdate = {};

function App() {

  let theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB'
      },
      secondary: {
        main: '#FFC107'
      },
    },
  });
  
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
  let [maxCamStream, setMaxCamStream] = React.useState(undefined);
  let [maxScrStream, setMaxScrStream] = React.useState(undefined);
  let [shownVideos, setShownVideos] = React.useState({me: true});
  let [shownAudios, setShownAudios] = React.useState({me: true});
  let [shownScreens, setShownScreens] = React.useState({me: true});
  let [myUserId, setMyUserId] = React.useState(undefined);

  useEffect(() => {
    let webcamMax = document.getElementById('webcamMax');
    let screenMax = document.getElementById('screenMax');
    webcamMax.srcObject = maxCamStream;
    screenMax.srcObject = maxScrStream; 
  }, [maxCamStream, maxScrStream]);

  function MediaBox(props) {
    
    videoUpdaters[props.id] = {};

    let vs = findValueByPrefix(videos, props.id + '_video');
    let ss = findValueByPrefix(screens, props.id + '_screen');
    let as = findValueByPrefix(audios, props.id + '_audio');

    let handleMediaOpen = () => {
      setMaxCamStream(vs !== undefined ? vs.value : undefined);
      setMaxScrStream(ss !== undefined ? ss.value : undefined);
    };

    if (shownScreens[props.id] === true) {
      if (shownVideos[props.id] === true) {
        return (
          <div id={props.id}>
            <div style={{width: 64, height: 64}}>
              <Video id={props.id} stream={vs !== undefined ? vs.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2}}>
              <Screen id={props.id} stream={ss !== undefined ? ss.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <Audio id={props.id} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
      else {
        return (
          <div id={props.id}>
            <div style={{width: 64, height: 64, display: 'none'}}>
              <Video id={props.id} stream={vs !== undefined ? vs.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2}}>
              <Screen id={props.id} stream={ss !== undefined ? ss.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <Audio id={props.id} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
    }
    else {
      if (shownVideos[props.id] === true) {
        return (
          <div id={props.id}>
            <div style={{width: 128, height: 128}}>
              <Video id={props.id} stream={vs !== undefined ? vs.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2, display: 'none'}}>
              <Screen id={props.id} stream={ss !== undefined ? ss.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <Audio id={props.id} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
      else {
        return (
          <div id={props.id}>
            <div style={{width: 64, height: 64, display: 'none'}}>
              <Video id={props.id} stream={vs !== undefined ? vs.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2, display: 'none'}}>
              <Screen id={props.id} stream={ss !== undefined ? ss.value : undefined} onClick={handleMediaOpen}/>
            </div>
            <Audio id={props.id} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
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
        setPathConfig(result);
      });
  }, []);

  useEffect(() => {
    if (connected) {
      initVideo();
      initScreen();
      initAudio();
    }
  }, [connected]);

  window.onmessage = e => {
    if (e.data.action === 'init') {
      setMe(e.data.me);
      setRoomId(e.data.roomId);
      setMyUserId(e.data.me.id);
    }
  }

  if (pathConfig === undefined && me !== undefined && roomId !== undefined && myUserId !== undefined) {
    return <div/>;
  }

  var result = Object.keys(videos).concat(Object.keys(audios)).unique();
  result = result.concat(Object.keys(screens)).unique();
  let tempResult = [];
  result.forEach(item => {
    let keyParts = item.split('_');
    tempResult.push(keyParts[0]);
  });
  result = tempResult.unique();

  let onVideoStreamUpdate = (userId) => {
    needUpdate[userId] = true;
  }
  let onAudioStreamUpdate = (userId) => {
    needUpdate[userId] = true;
  }
  let onScreenStreamUpdate = (userId) => {
    needUpdate[userId] = true;
  }

  return (
    <div style={{width: 'auto', height: '100vh', display: 'flex', flexwrap: 'wrap'}}>
      <div
        id="max"
        style={{
          display: (maxCamStream === undefined && maxScrStream === undefined) ? 'none' : 'block',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 99999
        }}
      >
        <video
          onClick={() => {
            setMaxCamStream(undefined);
            setMaxScrStream(undefined);
          }}
          autoPlay
          id="webcamMax"
          style={{
          objectFit: 'cover',
          width: '200px',
          height: '200px',
          }}
        ></video>
        <video
          onClick={() => {
            setMaxCamStream(undefined);
            setMaxScrStream(undefined);
          }}
          id="screenMax"
          autoPlay
          style={{
          transform: 'rotateY(0)',
          objectFit: 'cover',
          width: window.innerWidth + 'px',
          height: 'auto'
          }}
        ></video>
      </div>
      <div
        id="participents"
        className="participents"
        style={{width: '100%', height: 'auto', display: connected ? 'block' : 'none'}}
      >
        {result.map(key => {
          if (needUpdate[key] === true || videoCache[key] === undefined) {
            videoCache[key] = <MediaBox id={key}/>;
            delete needUpdate[key];
          }
          return videoCache[key];
        })}
      </div>
      <div style={{width: '100%', height: 128}}></div>
      {connected ?
          <div style={{width: '100%', height: '100%'}}>
            <ThemeProvider theme={theme}>
              <Fab id="audioButton" color={'primary'} style={{position: 'absolute', left: 16, bottom: (48 + 56 + 16)}} onClick={() => {
                  if (audio) {
                    endAudio();
                    setAudio(false);
                  }
                  else {
                    startAudio();
                    setAudio(true);
                  }
                  forceUpdate()
              }}>{audio ? <Mic/> : <MicOff/>}</Fab>
              <Fab id="endCallButton" color={'secondary'} style={{position: 'absolute', left: 16, bottom: 48}} onClick={() => {
                endAudio();
                setAudio(false);
                endVideo();
                setVideo(false);
                endScreen();
                setScreen(false);
                setConnected(false);
                forceUpdate();
              }}><CallEndIcon/></Fab>
              <Fab id="camButton" color={'primary'} style={{position: 'absolute', left: (16 + 56 + 16 + 72), bottom: 48}} onClick={() => {
                  if (video) {
                    endVideo();
                    setVideo(false);
                  }
                  else {
                    startVideo();
                    setVideo(true);
                  }
                  forceUpdate()
              }}>{video ? <VideocamIcon/> : <VideocamOff/>}</Fab>
              <Fab id="screenButton" color={'primary'} style={{position: 'absolute', left: (16 + 56 + 16), bottom: 48}} onClick={() => {
                if (screen) {
                  endScreen();
                  setScreen(false);
                }
                else {
                  startScreen();
                  setScreen(true);
                }
                forceUpdate()
            }}>{screen ? <DesktopWindowsIcon/> : <DesktopAccessDisabledIcon/>}</Fab>
          </ThemeProvider>
          <VideoMedia shownUsers={shownVideos} data={videos} updateData={onVideoStreamUpdate} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
          <AudioMedia shownUsers={shownAudios} data={audios} updateData={onAudioStreamUpdate} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
          <ScreenMedia shownUsers={shownScreens} data={screens} updateData={onScreenStreamUpdate} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
        </div>:
        !connected ?
          <ThemeProvider theme={theme}>
          <Fab id="callButton" color={'secondary'} style={{position: 'absolute', left: 16, bottom: 48}} onClick={() => {
            setConnected(true);
          }}><CallIcon style={{fill: '#fff'}}/></Fab>
        </ThemeProvider> :
        null
      }
    </div>
  )
}

export default App
