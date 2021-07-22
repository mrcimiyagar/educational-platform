import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Card,
  CardBody
} from "reactstrap";
import { whiteboardPath } from "../../util/Utils";
import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Search } from "@material-ui/icons";
import { gotoPage, popPage } from "../../App";
import Chat from "@material-ui/icons/Chat";

export let BoardBox = (props) => {
    let roomId = props.roomId + '';
    while (roomId.length < 22) {
      roomId = '0' + roomId;
    }
    return (
      <Card style={{height: 'calc(100% - 72px)', display: props.style.display, width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}}>
          <CardBody style={{position: 'relative', height: '100%'}}>
            
            <AppBar style={{width: '100%', height: 64, backgroundColor: '#2196f3'}}>
              <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
              <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                <Typography variant={'h6'}>وایت بورد</Typography>
                <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() =>  popPage()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
              </Toolbar>
            </AppBar>
            
            <iframe name="board-frame" src={whiteboardPath + '/#room=91bd46ae3aa84dff9d20,' + roomId}
            style={{width: '100%', height: 'calc(100% - 64px)', position: 'absolute', left: 0, top: 64, bottom: 0, right: 0}} frameBorder="0"></iframe>
            {(props.membership !== undefined && props.membership !== null && props.membership.canUseWhiteboard) ?  
                null : 
                <div style={{zIndex: 3000, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}/>
            }
            <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
              gotoPage('/app/chat')
            }}><Chat/></Fab>
          </CardBody>
      </Card>);
};