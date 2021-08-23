import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Card,
  CardBody
} from "reactstrap";
import { whiteboardPath } from "../../util/Utils";
import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Notes, Search } from "@material-ui/icons";
import { gotoPage, popPage } from "../../App";
import Chat from "@material-ui/icons/Chat";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import PollIcon from '@material-ui/icons/Poll';
import Menu from "@material-ui/icons/Menu";
import { me } from "../../util/settings";

export let AudioBox = (props) => {
    return (
      <Card style={{height: 'calc(100% - 72px)', width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}}>
          <CardBody style={{position: 'relative', height: '100%'}}>
            <AppBar style={{width: '100%', height: 64,
              backgroundColor: 'rgba(21, 96, 233, 0.65)',
              backdropFilter: 'blur(10px)'}}>
              <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16}} onClick={() => {
                  gotoPage('/app/deck', {room_id: props.roomId})
                }}><ViewCarousel style={{fill: '#fff'}}/></IconButton>
                <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16}} onClick={() => {
                  gotoPage('/app/notes', {room_id: props.roomId})
                }}><Notes style={{fill: '#fff'}}/></IconButton>
                <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16 + 32 + 16}} onClick={() => {
                  gotoPage('/app/poll', {room_id: props.roomId})
                }}><PollIcon style={{fill: '#fff'}}/></IconButton>
                <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>مدیا پلیر</Typography>
                <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => props.setMenuOpen(true)}><Menu style={{fill: '#fff'}}/></IconButton>
              </Toolbar>
            </AppBar>
            
            <iframe allowTransparency={true} name="audio-player-frame" id={'audio-player-frame'} src={'http://localhost:1013'}
              onLoad={() => {window.frames['audio-player-frame'].postMessage({sender: 'main', src: props.src}, 'http://localhost:1013')}}
              style={{width: '100%', height: 'calc(100% - 64px)', position: 'absolute', left: 0, top: 64, bottom: 0, right: 0}} frameBorder="0"></iframe>

            <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
              gotoPage('/app/chat')
            }}><Chat/></Fab>
          </CardBody>
      </Card>);
};