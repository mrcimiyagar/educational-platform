import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Notes, Search, ViewCarousel } from "@material-ui/icons";
import Add from "@material-ui/icons/Add";
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import React, { useEffect } from "react";
import Board, { createTranslate } from 'react-trello';
import { gotoPage, isDesktop, isInRoom } from "../../App";
import { pathConfig } from "../../index";
import { colors, me, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import './style.css';

let TRANSLATION_TABLE = {
  "Add another lane": "افزودن لیست",
  "Click to add card": "افزودن کارت",
  "Delete lane": "پاک نمودن لیست",
  "Lane actions": "عملیات لیست",
  "button": {
    "Add lane": "افزودن",
    "Add card": "افزودن",
    "Cancel": "لغو"
  },
  "placeholder": {
    "title": "عنوان",
    "description": "توضیحات",
    "label": "برچسب"
  }
}

export let TaskBox = (props) => {
  return (
    <div style={{height: 'calc(100% - 64px - 72px)', display: props.style.display}}>
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
          <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>برنامه ریزی</Typography>
          <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => props.setMenuOpen(true)}><Menu style={{fill: '#fff'}}/></IconButton>
        </Toolbar>
      </AppBar>
      <iframe allowTransparency={true}
        onLoad={() => window.frames['task-board-frame'].postMessage({sender: 'main', action: 'init', username: me.username, password: me.username}, pathConfig.taskBoard)}
        id ={'task-board-frame'} name="task-board-frame" src={pathConfig.taskBoard + '/login?var=' + Math.random()}
        style={{width: (isDesktop() && isInRoom()) ? 'calc(100% - 16px - 96px)' : '100%', height: '100%', marginTop: (isDesktop() && isInRoom()) ? 80 : 64,
        marginLeft: (isDesktop() && isInRoom()) ? (96 + 32) : undefined, marginBottom: 32}} frameBorder="0"></iframe>
      {(isDesktop() && isInRoom()) ? null :
      <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
          gotoPage('/app/chat', {roomId: props.roomId})
      }}><Chat/></Fab>}
    </div>
  )
};