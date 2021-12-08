import { AppBar, createTheme, Fab, IconButton, Slide, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Chat, Mic, MicOff, Notes, VideocamOff } from "@material-ui/icons";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import Search from "@material-ui/icons/Search";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import { gotoPage, inTheGame, isDesktop, isInRoom, isMobile, isTablet } from '../../App';
import store, { switchConf } from "../../redux/main";
import { colors, me } from '../../util/settings';
import { registerEvent, unregisterEvent, useForceUpdate } from "../../util/Utils";
import './style.css';
import { pathConfig } from "../..";
import { membership } from "../../routes/pages/room";

export let updateConfBox = () => {};
export let isConfConnected = false;

export function ConfBox(props) {
    let forceUpdate = useForceUpdate();
    updateConfBox = forceUpdate;
    unregisterEvent('membership-updated')
    registerEvent('membership-updated', (mem) => {
      if (mem.canActInVideo) {
        window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'enableVideoAccess'}, pathConfig.confClient);
      }
      else {
        window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'disableVideoAccess'}, pathConfig.confClient);
      }
    });
    return (
      <div style={{width: (props.webcamOn && props.currentRoomNav !== 2) ? 450 : '100%', height: (props.webcamOn && props.currentRoomNav !== 2) ? 300 : '100vh'
      , position: (props.webcamOn && props.currentRoomNav !== 2) ? 'fixed' : 'relative', direction: 'ltr', display: props.style.display}}>
        
        <AppBar style={{width: isDesktop() ? 550 : '100%', height: 64,
          display: props.currentRoomNav !== 2 && props.webcamOn ? 'none' : 'block',
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

      {(isDesktop() && isInRoom()) ? null :
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
        >
      <Fab
        color={'secondary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (72 + 12) : 12,
          right: 16 + 72,
          zIndex: 4,
        }}
        onClick={() => gotoPage('/app/chat', {room_id: props.roomId, user_id: props.userId})}
      >
        <Chat />
      </Fab>
      </Slide>}
        
        <iframe scrolling="no"
          onLoad={() => {window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'init', videoAccess: membership.canActInVideo, me: me, roomId: props.roomId}, pathConfig.confClient)}}
          allowTransparency={true} id ={'conf-video-frame'} name="conf-video-frame" src={pathConfig.confClient} allow={'microphone; camera; fullscreen; display-capture'}
          style={{position: (props.webcamOn && props.currentRoomNav !== 2) ? 'absolute' : undefined, 
          right: (props.webcamOn && props.currentRoomNav !== 2) ? 0 : undefined, top: 0, 
          width: (props.webcamOn && props.currentRoomNav !== 2) ? 450 : '100%', height: '100%', marginTop: (isDesktop() && isInRoom()) ? 0 : 64,
          marginBottom: 32}} frameBorder="0"></iframe>
      </div>
    );
}
