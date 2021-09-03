import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Notes, Search, ViewCarousel } from "@material-ui/icons";
import Add from "@material-ui/icons/Add";
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import React, { useEffect } from "react";
import Board, { createTranslate } from 'react-trello';
import { gotoPage, isDesktop, isInRoom } from "../../App";
import { colors, token } from "../../util/settings";
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

const customTranslation = createTranslate(TRANSLATION_TABLE)

export let TaskBox = (props) => {
  let forceUpdate = useForceUpdate()
  let [data, setData] = React.useState({lanes: []})
  let fetchBoard = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: props.roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/task/get_board", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.board !== undefined) {
          result.board.lanes.forEach(lane => {
            lane.onCardAdd = (card, laneId) => {
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'token': token
                },
                body: JSON.stringify({
                  title: card.title,
                  laneId: laneId,
                  roomId: props.roomId
                }),
                redirect: 'follow'
              };
              fetch(serverRoot + "/task/add_card", requestOptions)
                .then(response => response.json())
                .then(result => {
                  console.log(JSON.stringify(result));
                  fetchBoard()
                })
                .catch(error => console.log('error', error));
            }
          })
          setData(result.board)
          forceUpdate()
        }
      })
      .catch(error => console.log('error', error));
  }
  useEffect(() => {
    fetchBoard()
  }, [])
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
      <Board t={customTranslation} data={data} style={{width: (isDesktop() && isInRoom()) ? 'calc(100% - 112px)' : '100%', paddingLeft: 128, height: 'calc(100% + 56px)', paddingRight: 64, backgroundColor: 'transparent', background: 'transparent', marginTop: 80, overflow: 'auto'}}/>
      {(isDesktop() && isInRoom()) ? null :
      <Fab id="messagesButton" color={'secondary'} style={{position: 'fixed', left: 16, bottom: 72 + 16}} onClick={() => {
          gotoPage('/app/chat')
      }}><Chat/></Fab>}
      <Fab id="addLaneButton" color={'primary'} size={(isDesktop() && isInRoom()) ? undefined : 'medium'} style={{position: 'fixed', left: (isDesktop() && isInRoom()) ? 32 : 20, bottom: (isDesktop() && isInRoom()) ? 48 : (72 + 16 + 56 + 16)}} onClick={() => {
        let laneTitle = prompt('نامی برای لیست انتخاب کنید')
        if (laneTitle === null || laneTitle === '') return
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            title: laneTitle,
            roomId: props.roomId
          }),
          redirect: 'follow'
        };
        fetch(serverRoot + "/task/add_lane", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result));
            fetchBoard()
          })
          .catch(error => console.log('error', error));
      }}><Add/></Fab>
    </div>
  )
};