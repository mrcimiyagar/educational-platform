import React, { useEffect } from 'react';
import VideoMedia from './components/VideoMedia';
import AudioMedia from './components/AudioMedia';
import ScreenMedia from './components/ScreenMedia';
import {Fab, ThemeProvider} from '@mui/material';
import { createTheme } from '@mui/system';

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
  useEffect(() => {
    document.getElementById(props.id).srcObject = props.stream;
  }, [])
  return (
    <video autoPlay controls muted id={props.id} style={{width: '100%', height: '100%'}}/>
  );
}

function Screen(props) {
  useEffect(() => {
    document.getElementById(props.id).srcObject = props.stream;
  }, [])
  return (
    <video autoPlay controls muted id={props.id} style={{width: '100%', height: '100%'}}/>
  );
}

function Audio(props) {
  useEffect(() => {
    document.getElementById(props.id).srcObject = props.stream;
  }, [])
  return (
    <audio autoPlay id={props.id}/>
  );
}

let myUserId = prompt('enter your username:');

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
  let [connected, setConnected] = React.useState(false);
  let [pathConfig, setPathConfig] = React.useState(undefined);
  let [me, setMe] = React.useState(undefined);
  let [roomId, setRoomId] = React.useState(undefined);

  function MediaBox(props) {
    let vs = findValueByPrefix(videos, props.id + '_video');
    let ss = findValueByPrefix(screens, props.id + '_screen');
    let as = findValueByPrefix(audios, props.id + '_audio');
    if (ss !== undefined) {
      if (vs !== undefined) {
        return (
          <div>
            <div style={{width: 64, height: 64}}>
              <Video id={props.id + '_video'} stream={vs !== undefined ? vs.value : undefined}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2}}>
              <Screen id={props.id + '_screen'} stream={ss !== undefined ? ss.value : undefined}/>
            </div>
            <Audio id={props.id + '_audio'} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
      else {
        return (
          <div>
            <div style={{width: 64, height: 64, display: 'none'}}>
              <Video id={props.id + '_video'} stream={vs !== undefined ? vs.value : undefined}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2}}>
              <Screen id={props.id + '_screen'} stream={ss !== undefined ? ss.value : undefined}/>
            </div>
            <Audio id={props.id + '_audio'} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
    }
    else {
      if (vs !== undefined) {
        return (
          <div>
            <div style={{width: 128, height: 128}}>
              <Video id={props.id + '_video'} stream={vs !== undefined ? vs.value : undefined}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2, display: 'none'}}>
              <Screen id={props.id + '_screen'} stream={ss !== undefined ? ss.value : undefined}/>
            </div>
            <Audio id={props.id + '_audio'} stream={as !== undefined ? as.value : undefined}/>
          </div>
        );
      }
      else {
        return (
          <div>
            <div style={{width: 64, height: 64, display: 'none'}}>
              <Video id={props.id + '_video'} stream={vs !== undefined ? vs.value : undefined}/>
            </div>
            <div style={{width: 256 + 128, height: (256 + 128) / 2, display: 'none'}}>
              <Screen id={props.id + '_screen'} stream={ss !== undefined ? ss.value : undefined}/>
            </div>
            <Audio id={props.id + '_audio'} stream={as !== undefined ? as.value : undefined}/>
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

  window.onmessage = e => {
    if (e.data.action === 'init') {
      setMe(e.data.me);
      setRoomId(e.data.roomId);
    }
  }

  if (pathConfig === undefined && me !== undefined && roomId !== undefined) {
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

  return (
    <div style={{width: 'auto', height: '100vh', display: 'flex', flexwrap: 'wrap'}}>
      <div
        id="max"
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 99999
        }}
      >
        <video
          onClick={window.disableMax}
          autoPlay
          id="screenMax"
          style={{
          transform: 'rotateY(0)',
          objectFit: 'cover',
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: 'calc(100% - 200px - 16px)',
          height: 'auto'
          }}
        ></video>
        <video
          onClick={window.disableMax}
          autoPlay
          id="webcamMax"
          style={{
          objectFit: 'cover',
          position: 'absolute',
          right: '0px',
          top: '0px',
          width: '200px',
          height: '200px',
          }}
        ></video>
      </div>
      <div
        id="participents"
        className="participents"
        style={{width: '100%', height: 'auto'}}
      >
        {result.map(key => {
          return (
            <MediaBox id={key}/>
          );
        })}
      </div>
      <div style={{width: '100%', height: 128}}></div>
      <div
        id="openContainer"
        style={{width: '100%', height: '100%', position: 'fixed', left: '0px', top: '0px', zIndex: 99999, display: 'block'}}
      >
        <button
          id="openBtn"
          style={{display: 'none', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50px'}}
          onClick={window.openCallPage}
        >
          ورود به مکالمه
        </button>
      </div>
      {connected ?
          <div style={{width: '100%', height: '100%'}}>
              <ThemeProvider theme={theme}>
              {audio ? 
                <Fab id="audioButton" color={'primary'} style={{position: 'absolute', left: 16, bottom: (48 + 56 + 16)}} onClick={() => {
                  window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchAudioFlag', stream: !store.getState().global.conf.audio}, pathConfig.videoConfVideo)
                  store.dispatch(switchConf('audio', !store.getState().global.conf.audio))
                  forceUpdate()
                }}>{store.getState().global.conf.audio ? <Mic/> : <MicOff/>}</Fab> :
                null
              }  
              <Fab id="endCallButton" color={'secondary'} style={{position: 'absolute', left: (isDesktop() && isInRoom()) ? 32 : 16, bottom: (isDesktop() && isInRoom()) ? 48 : (16 + 72)}} onClick={() => {
                store.dispatch(switchConf('video', false))
                store.dispatch(switchConf('audio', false))
                store.dispatch(switchConf('screen', false))
                setConnected(false)
                setUniqueKey(Math.random())
                forceUpdate()
              }}><CallEndIcon/></Fab>
              {video ?
                <Fab id="camButton" color={'primary'} style={{position: 'absolute', left: (isDesktop() && isInRoom()) ? (32 + 56 + 16) : (16 + 56 + 16), bottom: (isDesktop() && isInRoom()) ? 48 : 16 + 72}} onClick={() => {
                  window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchVideoFlag', stream: !store.getState().global.conf.video}, pathConfig.videoConfVideo)
                  store.dispatch(switchConf('video', !store.getState().global.conf.video))
                  forceUpdate()
                }}>{store.getState().global.conf.video ? <VideocamIcon/> : <VideocamOff/>}</Fab> :
                null
              }
              {video ?<Fab id="screenButton" color={'primary'} style={{position: 'absolute', left: video ? ((isDesktop() && isInRoom()) ? (32 + 56 + 16 + 56 + 16) : (16 + 56 + 16 + 56 + 16)) : ((isDesktop() && isInRoom()) ? (32 + 56 + 16) : (16 + 56 + 16)), bottom: (isDesktop() && isInRoom()) ? 48 : 16 + 72}} onClick={() => {
                window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchScreenFlag', stream: !store.getState().global.conf.screen}, pathConfig.videoConfVideo)
                store.dispatch(switchConf('screen', !store.getState().global.conf.screen))
                forceUpdate()
              }}>{store.getState().global.conf.screen ? <DesktopWindowsIcon/> : <DesktopAccessDisabledIcon/>}</Fab> :
              null}
            </ThemeProvider>
        </div>:
        <ThemeProvider theme={theme2}>
          <Fab id="callButton" color={'secondary'} style={{position: 'absolute', left: (isDesktop() && isInRoom()) ? 32 : 16, bottom: (isDesktop() && isInRoom()) ? 48 : (16 + 72)}} onClick={() => {
            setConnected(true)
          }}><CallIcon style={{fill: '#fff'}}/></Fab>
        </ThemeProvider>
          }
      <VideoMedia data={videos} updateData={() => {}} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
      <AudioMedia data={audios} updateData={() => {}} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
      <ScreenMedia data={screens} updateData={() => {}} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
    </div>
  )
}

export default App
