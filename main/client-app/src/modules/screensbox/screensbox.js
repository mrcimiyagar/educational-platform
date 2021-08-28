import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import VideocamIcon from '@material-ui/icons/Videocam';
import "chartjs-plugin-datalabels";
import React, { useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import {
    Button, ButtonGroup,
    Card,
    CardBody,
    CardTitle
} from "reactstrap";
import { me, token } from '../../util/settings';
import './style.css';




function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.muted = "muted";
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', uservideostream => {
    addVideoStream(video, uservideostream);
  });
  call.on('close', () => {
    video.remove();
  });
}

export let ScreenBox = (props) => {
    let streamState = '';
    useEffect(() => {
      let myVideo = document.getElementById('myVideo');
      let videoGrid = document.getElementById('videosGrid');
      myVideo.muted = true;
    }, []);
    function checkVideoAccess(callback) {
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
              if (result.users.map(u => u.id).includes(me.id)) {
                callback({res: true, users: result.users});
              }
              else {
                callback({res: false, users: result.users});
              }
            });
    }
    useEffect(() => {
        checkVideoAccess(({res, users}) => {

            if (!res) {
      
              const createEmptyAudioTrack = () => {
                const ctx = new AudioContext();
                const oscillator = ctx.createOscillator();
                const dst = oscillator.connect(ctx.createMediaStreamDestination());
                oscillator.start();
                const track = dst.stream.getAudioTracks()[0];
                return Object.assign(track, { enabled: false });
              }
      
              const createEmptyVideoTrack = ({ width, height }) => {
                const canvas = Object.assign(document.createElement('canvas'), { width, height });
                canvas.getContext('2d').fillRect(0, 0, width, height);
      
                const stream = canvas.captureStream();
                const track = stream.getVideoTracks()[0];
      
                return Object.assign(track, { enabled: false });
              };
              let ms = new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack({ width:640, height:480 })]);
              users.forEach((actor) => {
                // TODO : connect to all peers

                /*let call = myPeer.call(actor.id, ms);
                const video = document.createElement('video');
                call.on('stream', uservideostream => {
                  addVideoStream(video, uservideostream);
                });*/
              });
            }
          });
    }, []);
    return (<Card style={{height: ((window.innerHeight - 64) / 2) - 16, marginTop: 16}}>
              <CardBody>
                <CardTitle>
                  <span style={{width: 100, fontSize: 20}}>اسکرین ها</span>
                </CardTitle>
                <div style={{height: 40, position: 'absolute', left: 16, top: 16}}>
                  <ButtonGroup style={{height: 40}} size="sm" className="mb-2 mr-1">
                    <Button outline color="primary"
                      onClick={() => {
                       checkVideoAccess(({res, users}) => {
                         if (res) {
                           if (streamState === '') {
                             navigator.mediaDevices.getUserMedia({
                               video: true,
                               audio: true
                             }).then(stream => {
                               // TODO: handle incoming calls
                               myVideo.srcObject = stream;
                               myVideo.addEventListener('loadedmetadata', () => {
                                 myVideo.play();
                               });
                             });
                             streamState = 'webcam';
                           }
                           else if (streamState === 'webcam') {
                             try {
                               const stream = myVideo.srcObject;
                               const tracks = stream.getTracks();
                               tracks.forEach(function (track) {
                                 track.stop();
                               });
                               myVideo.srcObject = null;
                             }
                             catch (e) {console.log(e);}
                             streamState = '';
                           }
                           else {
                             try {
                               const stream = myVideo.srcObject;
                               const tracks = stream.getTracks();
                               tracks.forEach(function (track) {
                                 track.stop();
                               });
                               myVideo.srcObject = null;
                             }
                             catch (e) {console.log(e);}
                             navigator.mediaDevices.getUserMedia({
                               video: true,
                               audio: true
                             }).then(stream => {
                               // TODO: handle incoming calls
                               myVideo.srcObject = stream;
                               myVideo.addEventListener('loadedmetadata', () => {
                                 myVideo.play();
                               });
                             });
                             streamState = 'webcam';
                           }
                         }
                       });
                      }}>
                      <VideocamIcon/>
                    </Button>
                    <Button outline color="primary"
                      onClick={() => {
                       checkVideoAccess(({res, users}) => {
                         if (res) {
                           if (streamState === '') {
                             navigator.mediaDevices.getDisplayMedia().then((str) => {
                               // TODO: handle incoming calls
                               myVideo.srcObject = str;
                               myVideo.addEventListener('loadedmetadata', () => {
                                 myVideo.play();
                               });
                             });
                             streamState = 'screen';
                           }
                           else if (streamState === 'screen') {
                             try {
                               const stream = myVideo.srcObject;
                               const tracks = stream.getTracks();
                               tracks.forEach(function (track) {
                                 track.stop();
                               });
                               myVideo.srcObject = null;
                             }
                             catch (e) {console.log(e);}
                             streamState = '';
                           }
                           else {
                             try {
                               const stream = myVideo.srcObject;
                               const tracks = stream.getTracks();
                               tracks.forEach(function (track) {
                                 track.stop();
                               });
                               myVideo.srcObject = null;
                             }
                             catch (e) {console.log(e);}
                             navigator.mediaDevices.getDisplayMedia().then((str) => {
                               // TODO: handle incoming calls
                               myVideo.srcObject = str;
                               myVideo.addEventListener('loadedmetadata', () => {
                                 myVideo.play();
                               });
                             });
                             streamState = 'screen';
                           }
                         }
                       });
                      }}>
                    <DesktopWindowsIcon/>
                </Button>
                </ButtonGroup>
                </div>
                <div id={'videosGrid'} style={{overflowY: 'auto', height: window.innerHeight * 45 / 100 - 108}}>
                  <video id={'myVideo'}/>
                </div>
              </CardBody>
            </Card>);
}