import React, { useEffect } from "react";
import './style.css';
import {
  Card,
  CardBody,
  Button,
  ButtonGroup
} from "reactstrap";
import {me, token, colors} from '../../util/settings';
import { conferencePath, useForceUpdate } from "../../util/Utils";
import { notifyMeOnAccessChange } from '../../routes/pages/conference';
import { isDesktop } from "../../App";
import Videocam from "@material-ui/icons/Videocam";
import Mic from "@material-ui/icons/Mic";
import store, { switchConf } from "../../redux/main";
import MicOff from "@material-ui/icons/MicOff";
import VideocamOff from "@material-ui/icons/VideocamOff";
import { updateNavbar } from "../../containers/TopNav";

export let updateConfBox = undefined

export let ConfBox = (props) => {
    let forceUpdate = useForceUpdate()
    updateConfBox = forceUpdate
    useEffect(() => {
      window.addEventListener('message', e => {
        if (e.data.action === 'switchVideoControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('video', false))
          store.dispatch(switchConf('isVideoEnable', e.data.visibility))
          forceUpdate()
          updateNavbar()
        }
        else if (e.data.action === 'switchAudioControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('audio', false))
          store.dispatch(switchConf('isAudioEnable', e.data.visibility))
          forceUpdate()
          updateNavbar()
        }
      })
    }, [])
    return (
      <div style={{position: 'relative'}}>
        <iframe onLoad={() => window.frames['conf-video-frame'].postMessage({sender: 'main', userId: me.id}, 'https://confvideo.kaspersoft.cloud')} 
            id ={'conf-video-frame'} name="conf-video-frame" src={'https://confvideo.kaspersoft.cloud/video.html'} allow={'microphone; camera'}
            style={{width: '100%', height: props.boxHeightInner, position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} frameBorder="0"></iframe>
        <iframe onLoad={() => window.frames['conf-audio-frame'].postMessage({sender: 'main', userId: me.id}, 'https://confaudio.kaspersoft.cloud')} 
            id ={'conf-audio-frame'} name="conf-audio-frame" src={'https://confaudio.kaspersoft.cloud/audio.html'} allow={'microphone; camera'}
            style={{width: 400, height: 64, position: 'absolute', bottom: 32, display: 'none'}} frameBorder="0"></iframe>
      </div>
    );
};
