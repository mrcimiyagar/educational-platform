import { AppBar, createTheme, Fab, IconButton, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { green, pink } from "@material-ui/core/colors";
import { ArrowForward, Mic, MicOff, Notes, VideocamOff } from "@material-ui/icons";
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import Search from "@material-ui/icons/Search";
import SettingsIcon from '@material-ui/icons/Settings';
import VideocamIcon from '@material-ui/icons/Videocam';
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import { gotoPage, isDesktop, isInRoom } from '../../App';
import { updateRoomBottomBar } from "../../components/RoomBottombar";
import store, { switchConf } from "../../redux/main";
import { colors, me } from '../../util/settings';
import { useForceUpdate } from "../../util/Utils";
import './style.css';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';

export let updateConfBox = undefined
export let isConfConnected = false

export let ConfBox = (props) => {
    let forceUpdate = useForceUpdate()
    updateConfBox = forceUpdate
    let [video, setVideo] = React.useState(false)
    let [audio, setAudio] = React.useState(false)
    let [connected, setConnected] = React.useState(false)
    isConfConnected = connected
    useEffect(() => {
      window.addEventListener('message', e => {
        if (e.data.action === 'switchVideoControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('video', false))
          store.dispatch(switchConf('isVideoEnable', e.data.visibility))
          setVideo(e.data.visibility)
          forceUpdate()
        }
        else if (e.data.action === 'switchAudioControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('audio', false))
          store.dispatch(switchConf('isAudioEnable', e.data.visibility))
          setAudio(e.data.visibility)
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
    let [uniqueKey, setUniqueKey] = React.useState(Math.random())
    const theme2 = createTheme({
      palette: {
        primary: {
          main: '#2196f3',
        },
        secondary: green
      },
    });
    useEffect(() => {
      updateRoomBottomBar()
    }, [connected])
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
              if (window.location.pathname === '/app/p2pCall') {
                props.handleClose()
              }
              else {
                props.setMenuOpen(true)
              }
            }}>
              {window.location.pathname === '/app/p2pCall' ? <ArrowForward style={{fill: '#fff'}}/> : <Menu style={{fill: '#fff'}}/>}
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {connected ?
          <div style={{width: '100%', height: '100%'}}>
              <iframe allowTransparency={true} onLoad={() => window.frames['conf-video-frame'].postMessage({sender: 'main', userId: me.id, roomId: props.roomId}, 'http://localhost:1010')} 
                id ={'conf-video-frame'} name="conf-video-frame" src={'http://localhost:1010/video.html'} allow={'microphone; camera'}
                style={{width: (isDesktop() && isInRoom()) ? 'calc(100% - 16px - 96px)' : '100%', height: '100%', marginTop: (isDesktop() && isInRoom()) ? 80 : 64,
                marginLeft: (isDesktop() && isInRoom()) ? (96 + 32) : undefined, marginBottom: 32}} frameBorder="0"></iframe>
        
              <iframe allowTransparency={true} onLoad={() => window.frames['conf-audio-frame'].postMessage({sender: 'main', userId: me.id, roomId: props.roomId}, 'http://localhost:1011')} 
                id ={'conf-audio-frame'} name="conf-audio-frame" src={'http://localhost:1011/audio.html'} allow={'microphone; camera'}
                style={{width: 400, height: 128, position: 'absolute', bottom: 32, display: 'none'}} frameBorder="0"></iframe>

              <ThemeProvider theme={theme}>
                <Fab id="messagesButton" color={'primary'} style={{position: 'absolute', left: (isDesktop() && isInRoom()) ? 32 : 16, bottom: audio ? ((isDesktop() && isInRoom()) ? (48 + 56 + 16 + 56 + 16) : (16 + 72 + 56 + 16 + 56 + 16)) : ((isDesktop() && isInRoom()) ? (48 + 56 + 16) : (16 + 72 + 56 + 16))}} onClick={() => {
                  gotoPage('/app/chat')
                }}><Chat/></Fab>
              {audio ? 
                <Fab id="audioButton" color={'primary'} style={{position: 'absolute', left: (isDesktop() && isInRoom()) ? 32 : 16, bottom: (isDesktop() && isInRoom()) ? (48 + 56 + 16) : (16 + 72 + 56 + 16)}} onClick={() => {
                  window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'switchFlag', stream: !store.getState().global.conf.audio}, 'http://localhost:1011')
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
                  window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchVideoFlag', stream: !store.getState().global.conf.video}, 'http://localhost:1010')
                  store.dispatch(switchConf('video', !store.getState().global.conf.video))
                  forceUpdate()
                }}>{store.getState().global.conf.video ? <VideocamIcon/> : <VideocamOff/>}</Fab> :
                null
              }
              {video ?<Fab id="screenButton" color={'primary'} style={{position: 'absolute', left: video ? ((isDesktop() && isInRoom()) ? (32 + 56 + 16 + 56 + 16) : (16 + 56 + 16 + 56 + 16)) : ((isDesktop() && isInRoom()) ? (32 + 56 + 16) : (16 + 56 + 16)), bottom: (isDesktop() && isInRoom()) ? 48 : 16 + 72}} onClick={() => {
                window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchScreenFlag', stream: !store.getState().global.conf.screen}, 'http://localhost:1010')
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
      </div>
    );
};
