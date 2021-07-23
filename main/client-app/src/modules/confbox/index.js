import React, { useEffect } from "react";
import './style.css';
import {me, token, colors} from '../../util/settings';
import { conferencePath, useForceUpdate } from "../../util/Utils";
import store, { switchConf } from "../../redux/main";
import VideocamIcon from '@material-ui/icons/Videocam';
import { AppBar, Button, createTheme, Fab, IconButton, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Mic, MicOff, Speaker, VideocamOff, VolumeOff, VolumeUp } from "@material-ui/icons";
import PauseIcon from '@material-ui/icons/Pause';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { pink } from "@material-ui/core/colors";
import Search from "@material-ui/icons/Search";
import SettingsIcon from '@material-ui/icons/Settings';
import {gotoPage, popPage} from '../../App';
import Chat from "@material-ui/icons/Chat";
import ViewCarousel from "@material-ui/icons/ViewCarousel";

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
        }
        else if (e.data.action === 'switchAudioControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('audio', false))
          store.dispatch(switchConf('isAudioEnable', e.data.visibility))
          forceUpdate()
        }
      })
    }, [])
    const theme = createTheme({
      palette: {
        primary: {
          main: '#2196f3',
        },
        secondary: pink
      },
    });
    return (
      <div style={{width: '100%', height: '100vh', position: 'relative', direction: 'ltr'}}>
        
        <AppBar style={{width: '100%', height: 64, backgroundColor: '#2196f3'}}>
          <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16}} onClick={() => {
              props.openDeck()
            }}><ViewCarousel style={{fill: '#fff'}}/></IconButton>
            <Typography variant={'h6'}>سالن کنفرانس</Typography>
            <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() =>  popPage()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
          </Toolbar>
        </AppBar>
        
        <iframe onLoad={() => window.frames['conf-video-frame'].postMessage({sender: 'main', userId: me.id}, 'http://localhost:1010')} 
            id ={'conf-video-frame'} name="conf-video-frame" src={'http://localhost:1010/video.html'} allow={'microphone; camera'}
            style={{width: '100%', height: '100%', marginTop: 64}} frameBorder="0"></iframe>
        
        <iframe onLoad={() => window.frames['conf-audio-frame'].postMessage({sender: 'main', userId: me.id}, 'http://localhost:1011')} 
            id ={'conf-audio-frame'} name="conf-audio-frame" src={'http://localhost:1011/audio.html'} allow={'microphone; camera'}
            style={{width: 400, height: 128, position: 'absolute', bottom: 32, display: 'none'}} frameBorder="0"></iframe>

        <div style={{position: 'fixed', bottom: 72 + 16, left: '50%', transform: 'translateX(-50%)', width: 'auto', height: 'auto', display: 'flex', flexWrap: 'nowrap'}}>
          <ThemeProvider theme={theme}>
            <Fab id="messagesButton" color={'primary'} onClick={() => {
              gotoPage('/app/chat')
            }}><Chat/></Fab>
            <Fab id="camButton" color={'primary'} style={{marginLeft: 16}} onClick={() => {
              window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'switchFlag', stream: !store.getState().global.conf.audio}, 'http://localhost:1011')
              store.dispatch(switchConf('audio', !store.getState().global.conf.audio))
              forceUpdate()
            }}>{store.getState().global.conf.audio ? <Mic/> : <MicOff/>}</Fab>
            <Fab id="camButton" color={'secondary'} style={{marginLeft: 16}} onClick={() => {
              
            }}><CallEndIcon/></Fab>
            <Fab id="camButton" color={'primary'} style={{marginLeft: 16}} onClick={() => {
              window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchFlag', stream: !store.getState().global.conf.video}, 'http://localhost:1010')
              store.dispatch(switchConf('video', !store.getState().global.conf.video))
              forceUpdate()
            }}>{store.getState().global.conf.video ? <VideocamIcon/> : <VideocamOff/>}</Fab>
            <Fab id="settingsButton" color={'primary'} style={{marginLeft: 16}} onClick={() => {
              gotoPage('/app/chat')
            }}><SettingsIcon/></Fab>
          </ThemeProvider>
        </div>
        

      </div>
    );
};
