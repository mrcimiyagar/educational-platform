import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { taskManagerPath } from "../../util/Utils";
import Board from 'react-trello'
import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Notes, Search, ViewCarousel } from "@material-ui/icons";
import { gotoPage, popPage } from "../../App";
import Chat from "@material-ui/icons/Chat";
import PollIcon from '@material-ui/icons/Poll';
import Menu from "@material-ui/icons/Menu";

const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
        {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '0/0',
      cards: []
    }
  ]
}

export let TaskBox = (props) => {
  return (
    <div style={{display: props.style.display}}>
      <AppBar style={{width: '100%', height: 64,
          backgroundColor: 'rgba(21, 96, 233, 0.65)',
          backdropFilter: 'blur(10px)'}}>
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
      <Board data={data} style={{marginTop: 64}}/>
      <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
          gotoPage('/app/chat')
      }}><Chat/></Fab>
    </div>
  )
};