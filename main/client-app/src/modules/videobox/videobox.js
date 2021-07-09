import React, { useEffect } from "react";
import './style.css';
import {
    Button
  } from "reactstrap";
import DetectRTC from 'detectrtc'
import {me, token, colors} from '../../util/settings';
import { useForceUpdate, videoConferencePath } from "../../util/Utils";
import { notifyMeOnAccessChange, updateConf } from '../../routes/pages/conference';
import store from "../../redux/main";
import { switchWebinar } from "../../redux/main";
import DivSize from "../../components/DivSize/DivSize2";

export let updateVideoBox = () => {}

export let VideoBox = (props) => {
  updateVideoBox = useForceUpdate()
  let forceUpdate = updateVideoBox
  let [actors, setActors] = React.useState([])
  let [width, setWidth] = React.useState(0)
  let [height, setHeight] = React.useState(0)
    useEffect(() => {
      notifyMeOnAccessChange((mem) => {
        let requestOptions4 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            roomId: props.roomId
          }),
          redirect: 'follow'
        };
        fetch("../video/get_actors", requestOptions4)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result));
            setActors(result.users.map(u => u.id))
            document.getElementById('audio-frame').src += '';
            document.getElementById('video-frame').src += '';
            document.getElementById('screen-frame').src += '';
            setTimeout(() => {
              store.dispatch(switchWebinar('screen', false))
              store.dispatch(switchWebinar('video', false))
              store.dispatch(switchWebinar('audio', false))
              forceUpdate()
            }, 2000);
          });
      })
    }, []);
    useEffect(() => {
      window.addEventListener('message', (e) => {
        if (e.data.sender === 'screenBroadcast') {
          if (e.data.stream === true) {
            store.dispatch(switchWebinar('screen', true))
            forceUpdate()
            updateConf()
          }
          else if (e.data.stream === false) {
            store.dispatch(switchWebinar('screen', false))
            forceUpdate()
            updateConf()
          }
        }
        else if (e.data.sender === 'videoBroadcast') {
          if (e.data.stream === true) {
            store.dispatch(switchWebinar('video', true))
            forceUpdate()
            updateConf()
          }
          else if (e.data.stream === false) {
            store.dispatch(switchWebinar('video', false))
            forceUpdate()
            updateConf()
          }
        }
        else if (e.data.sender === 'audioBroadcast') {
          if (e.data.stream === true) {
            store.dispatch(switchWebinar('audio', true))
            forceUpdate()
            updateConf()
          }
          else if (e.data.stream === false) {
            store.dispatch(switchWebinar('audio', false))
            forceUpdate()
            updateConf()
          }
        }
      })
      let requestOptions4 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          roomId: props.roomId
        }),
        redirect: 'follow'
      };
      fetch("../video/get_actors", requestOptions4)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          setActors(result.users.map(u => u.id))
        });
    }, [])
    let screen = store.getState().global.webinar.screen
    let myId = me.id
    return (
        <div style={{position: 'relative', textAlign: 'center', backgroundColor: colors.primary, width: '100%', height: props.boxHeight}}>
          <div style={{width: '100%', height: '100%', textAlign: 'center', position: 'absolute', left: 16, right: 0}}>
            <DivSize sizeFetcher={({w, h}) => {
              setWidth(w);
              setHeight(h);
            }}/>
            <div style={{width: (width - 256), height: height, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}>
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                  <div style={{display: screen ? 'none' : 'block', width: 'calc(100% - 64px - 84px - 84px)', backgroundColor: screen ? colors.primaryDark : colors.primary, height: '90%', position: 'absolute', transform: screen ? undefined : 'translate(-50%, -50%)', top: screen ? -8 : '50%', right: screen ? -12 : undefined, left: screen ? undefined : 'calc(50% - 128px)'}}>
                    <div style={{width: '100%', height: '100%', display: 'flex', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>
                      {actors.includes(myId) ?
                        <iframe id ={'video-frame'} name="video-frame" src={'https://webinarvideo.kaspersoft.cloud/broadcast_video.html'} allow={'microphone; camera'}
                          style={{display: store.getState().global.webinar.video === true ? 'block' : 'none', zIndex: 4000, width: '100%', height: '100%'}} frameBorder="0"></iframe> :
                        <iframe id ={'video-frame'} name="video-frame" src={'https://webinarvideo.kaspersoft.cloud/watch_video.html'} allow={'microphone; camera'}
                          style={{display: store.getState().global.webinar.video === true ? 'block' : 'none', zIndex: 4000, width: '100%', height: '100%'}} frameBorder="0"></iframe>
                      }
                    </div>
                  </div>
                  <div style={{width: 'calc(100% - 64px - 84px - 84px)', height: '90%', position: 'absolute', right: 248, top: 16, display: screen ? 'block' : 'none'}}>
                    {actors.includes(myId) ?
                      <iframe id ={'screen-frame'} name="screen-frame" src={'https://webinarscreen.kaspersoft.cloud/broadcast_screen.html'} allow={'microphone; camera'}
                        style={{display: screen === true ? 'block' : 'none', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} frameBorder="0"></iframe> :
                      <iframe id ={'screen-frame'} name="screen-frame" src={'https://webinarscreen.kaspersoft.cloud/watch_screen.html'} allow={'microphone; camera'}
                        style={{display: screen === true ? 'block' : 'none', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} frameBorder="0"></iframe>
                    }
                  </div>
              </div> 
            </div>
          </div>
          <div>
            {actors.includes(myId) ?
              <iframe id ={'audio-frame'} name="audio-frame" src={'https://webinaraudio.kaspersoft.cloud/broadcast_audio.html'} allow={'microphone; camera'} frameBorder="0"></iframe> :
              <iframe id ={'audio-frame'} name="audio-frame" src={'https://webinaraudio.kaspersoft.cloud/watch_audio.html'} allow={'microphone; camera'} frameBorder="0"></iframe>
            }
          </div>
        </div>
    );
};