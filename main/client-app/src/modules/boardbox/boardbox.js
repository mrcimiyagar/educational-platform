import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Notes, Search } from "@material-ui/icons";
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React from "react";
import { pathConfig } from "../..";
import { gotoPage, isDesktop, isInRoom } from "../../App";
import { colors, me } from "../../util/settings";
import './style.css';

export let BoardBox = (props) => {
    let roomId = props.roomId + '';
    while (roomId.length < 22) {
      roomId = '0' + roomId;
    }
    return (
      <div style={{backgroundColor: 'transparent', background: 'transparent', height: isDesktop() ? (isInRoom() ? 'calc(100% - 32px)' : '100%') : 'calc(100% - 72px)', marginTop: isDesktop() ? 16 : 64, display: props.style.display, width: (isDesktop() && isInRoom()) ? 'calc(100% - 144px)' : '100%', marginLeft: (isDesktop() && isInRoom()) ? 16 : 0, marginRight: (isDesktop() && isInRoom()) ? 16 : 0, display: props.style.display}}>
          <div style={{position: 'relative', height: '100%', width: '100%'}}>
            <AppBar style={{marginRight: (isDesktop() && isInRoom()) ? 'calc(50% - 275px + 175px)' : 0, width: (isDesktop() && isInRoom()) ? 550 : '100%', height: 64,
              backgroundColor: colors.primaryMedium,
              backdropFilter: 'blur(10px)',
              borderRadius: isDesktop() ? '0 0 24px 24px' : 0
            }}>
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
                <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>وایت بورد</Typography>
                <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => props.setMenuOpen(true)}><Menu style={{fill: '#fff'}}/></IconButton>
              </Toolbar>
            </AppBar>

            <div className="maincontentdiv" style={{borderRadius: isDesktop() ? 24 : 0}}>
              <iframe allowTransparency={true} name="board-frame" src={'http://localhost:8081/draw?username=34706a17-9af9-438f-9128-a0ceeecb7761-1635965619430&room=Server'}
                onLoad={() => window.frames['board-frame'].postMessage({sender: 'main', userId: me.id, roomId: props.roomId}, pathConfig.whiteBoard)}
                frameborder="0" style={{border: 0, backgroundColor: 'transparent', background: 'transparent',
                borderRadius: isDesktop() ? 24 : 0, width: '100%', height: (isDesktop() && isInRoom()) ? 'calc(100% - 32px)' : 'calc(100% - 48px)', position: 'absolute', left: 0, 
                top: (isDesktop() && isInRoom()) ? 64 : -16, bottom: 0, right: 0}}></iframe>
              {(props.membership !== undefined && props.membership !== null && props.membership.canUseWhiteboard) ?  
                null : 
                <div style={{zIndex: 3000, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}/>
              }
            </div>
            
            {(isDesktop() && isInRoom()) ? null :
            <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
              gotoPage('/app/chat', {room_id: props.roomId, user_id: props.userId})
            }}><Chat/></Fab>
            }
          </div>
      </div>);
};
