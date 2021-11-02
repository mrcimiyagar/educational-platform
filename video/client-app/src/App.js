import React, { useEffect } from 'react';
import VideoMedia from './components/VideoMedia';
import AudioMedia from './components/AudioMedia';
import ScreenMedia from './components/ScreenMedia';

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

function Video(props) {
  useEffect(() => {
    document.getElementById(props.id).srcObject = props.stream;
  }, [])
  return (
    <video autoPlay controls muted id={props.id}/>
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

function MediaBox(props) {
  return (
    <div>
      <Video id={props.id + '_video'} stream={props.data.video}/>
      <Video id={props.id + '_screen'} stream={props.data.screen}/>
      <Audio id={props.id + '_audio'} stream={props.data.audio}/>
    </div>
  );
}

let myUserId = prompt('enter your username:');

function App() {
  
  let forceUpdate = useForceUpdate();
  let [videos, setVideos] = React.useState({});
  let [audios, setAudios] = React.useState({});
  let [screens, setScreens] = React.useState({});
  let [f, setF] = React.useState({});

  let update = () => {
    f = {};
    let v = [];
    let s = [];
    let a = [];
    for (let key in videos) {
      if (videos.hasOwnProperty(key)) {
        let idParts = key.split('_');
        v[idParts[0]] = videos[key];
      }
    }
    for (let key in screens) {
      if (screens.hasOwnProperty(key)) {
        let idParts = key.split('_');
        s[idParts[0]] = screens[key];
      }
    }
    for (let key in audios) {
      if (audios.hasOwnProperty(key)) {
        let idParts = key.split('_');
        a[idParts[0]] = audios[key];
      }
    }
    for (let key in v) {
      if (v.hasOwnProperty(key)) {
        if (f[key] === undefined) {
          f[key] = {};
        }
        f[key].video = v[key];
      }
    }
    for (let key in s) {
      if (s.hasOwnProperty(key)) {
        if (f[key] === undefined) {
          f[key] = {};
        }
        f[key].screen = s[key];
      }
    }
    for (let key in a) {
      if (a.hasOwnProperty(key)) {
        if (f[key] === undefined) {
          f[key] = {};
        }
        f[key].audio = a[key];
      }
    }
    setF(f);
    forceUpdate();
  };

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
        {Object.entries(f).map(([id, data]) => {
          if (data === undefined) {
            return null;
          }
          return (
            <MediaBox id={id} data={data}/>
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
      <VideoMedia data={videos} updateData={() => update()} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
      <AudioMedia data={audios} updateData={() => update()} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
      <ScreenMedia data={screens} updateData={() => update()} forceUpdate={forceUpdate} userId={myUserId} roomId={1}/>
    </div>
  )
}

export default App
