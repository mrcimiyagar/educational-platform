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
import easyXDM from 'easyxdm';

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

function App() {
  
  let forceUpdate = useForceUpdate();
  let [videos, setVideos] = React.useState({});
  let [audios, setAudios] = React.useState({});
  let [screens, setScreens] = React.useState({});
  let [pathConfig, setPathConfig] = React.useState(undefined);
  let [me, setMe] = React.useState(undefined);
  let [roomId, setRoomId] = React.useState(undefined);
  let [shownVideos, setShownVideos] = React.useState({});
  let [myUserId, setMyUserId] = React.useState(undefined);

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
    window.onmessage = e => {
      if (e.data.action === 'init') {
        setMe(e.data.me);
        setRoomId(e.data.roomId);
        setMyUserId(e.data.me.id);
        setTimeout(() => {
          initVideo();
          setTimeout(() => {
            startVideo();
          }, 2500);
        }, 2500);
      }
    }
  }, []);
  
  var result = Object.keys(videos).concat(Object.keys(audios)).unique();
  result = result.concat(Object.keys(screens)).unique();
  let tempResult = [];
  result.forEach(item => {
    let keyParts = item.split('_');
    tempResult.push(keyParts[0]);
  });
  result = tempResult.unique();

  useEffect(() => {
    let presenter = findValueByPrefix(videos, result[0] + '_video');
    if (presenter === undefined) return;
    document.getElementById(result[0] + '_video').srcObject = presenter.value;
  }, [videos])

  if (pathConfig === undefined || me === undefined || roomId === undefined || myUserId === undefined) {
    return <div/>;
  }

  return (
    <div style={{width: 'auto', height: '100vh', display: 'flex', flexwrap: 'wrap', backgroundColor: '#000'}}>
      <VideoMedia shownUsers={shownVideos} data={videos} updateData={(userId) => {}} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
      <video autoPlay controls muted id={'me_video'} style={{width: '100%', height: '100%'}}/>
    </div>
  )
}

export default App
