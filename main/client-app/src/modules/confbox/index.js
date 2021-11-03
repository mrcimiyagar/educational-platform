import { AppBar, createTheme, Fab, IconButton, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Mic, MicOff, Notes, VideocamOff } from "@material-ui/icons";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import Search from "@material-ui/icons/Search";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import { gotoPage, isDesktop, isInRoom } from '../../App';
import store, { switchConf } from "../../redux/main";
import { colors, me } from '../../util/settings';
import { useForceUpdate } from "../../util/Utils";
import './style.css';
import { pathConfig } from "../..";

export let updateConfBox = () => {};
export let isConfConnected = false;

export function ConfBox(props) {
    let forceUpdate = useForceUpdate();
    updateConfBox = forceUpdate;
    let [video, setVideo] = React.useState(false);
    let [audio, setAudio] = React.useState(false);
    let [connected, setConnected] = React.useState(false);
    isConfConnected = connected;
    useEffect(() => {
      window.addEventListener('message', e => {
        if (e.data.action === 'switchVideoControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('video', false));
          store.dispatch(switchConf('isVideoEnable', e.data.visibility));
          setVideo(e.data.visibility);
          forceUpdate();
        }
        else if (e.data.action === 'switchAudioControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('audio', false));
          store.dispatch(switchConf('isAudioEnable', e.data.visibility));
          setAudio(e.data.visibility);
          forceUpdate();
        }
      })
    }, [])
    let [uniqueKey, setUniqueKey] = React.useState(Math.random());
    return (
      <div key={uniqueKey} style={{width: '100%', height: '100vh', position: 'relative', direction: 'ltr', display: props.style.display}}>
        
        <AppBar style={{width: isDesktop() ? 550 : '100%', height: 64,
          borderRadius: isDesktop() ? '0 0 24px 24px' : 0,
          backgroundColor: colors.primaryMedium,
          backdropFilter: 'blur(10px)',
          position: 'fixed', left: (isDesktop() && isInRoom()) ? 'calc(50% - 225px)' : '50%', transform: 'translateX(-50%)'}}>
          <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16}} onClick={() => {
              props.openDeck()
            }}><ViewCarousel style={{fill: '#fff'}}/></IconButton>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16}} onClick={() => {
              props.openNotes()
            }}><Notes style={{fill: '#fff'}}/></IconButton>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16 + 32 + 16}} onClick={() => {
              props.openPolls()
            }}><PollIcon style={{fill: '#fff'}}/></IconButton>
            <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>سالن کنفرانس</Typography>
            <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => {
              props.setMenuOpen(true)
            }}>
              <Menu style={{fill: '#fff'}}/>
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <iframe allowTransparency={true} onLoad={() => window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'setupIds', userId: me.id, roomId: props.roomId, videoServerWebsocket: pathConfig.videoConfVideo, screenServerWebsocket: pathConfig.videoConfScreen, audioServerWebsocket: pathConfig.videoConfAudio}, pathConfig.videoConfVideo)} 
                id ={'conf-video-frame'} name="conf-video-frame" src={pathConfig.videoConfVideo} allow={'microphone; camera'}
                style={{width: (isDesktop() && isInRoom()) ? 'calc(100% - 16px - 96px)' : '100%', height: '100%', marginTop: (isDesktop() && isInRoom()) ? 80 : 64,
                marginLeft: (isDesktop() && isInRoom()) ? (96 + 32) : undefined, marginBottom: 32}} frameBorder="0"></iframe>
      </div>
    );
}
