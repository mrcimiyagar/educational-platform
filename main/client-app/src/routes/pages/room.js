import React, {Component, Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {
  Button
} from "reactstrap";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DescriptionIcon from '@material-ui/icons/Description';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import VideocamIcon from '@material-ui/icons/Videocam';
import ChatIcon from '@material-ui/icons/Chat';
import PeopleIcon from '@material-ui/icons/People';

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import {colors, me, setMe, setToken, token} from "../../util/settings";

import { ChatBox } from "../../modules/chatbox/chatbox";
import { reloadUsersList, UsersBox } from "../../modules/usersbox/usersbox";
import { BoardBox } from "../../modules/boardbox/boardbox";
import { NoteBox } from "../../modules/notebox/notebox";
import { PresentBox } from "../../modules/presentbox/presentbox";
import { FileBox, toggleFileBox } from "../../modules/filebox/filebox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { PollBox, togglePolling } from "../../modules/pollbox/pollbox";
import { VideoBox } from "../../modules/videobox/videobox";
import { ConfBox } from "../../modules/confbox";
import { ConnectToIo, leaveRoom, roothPath, setRoomId, roomId, socket, useForceUpdate, validateToken, FetchMe, conferencePath, serverRoot } from "../../util/Utils";
import { fetchAccessChangeCallbackNavbar, hideNavbar, reloadNavbar, reloadNavbarState, setTitle, updateActorsNavbar, updateNavbar, viewNavbar } from "../../containers/TopNav";

import DivSize2 from "../../components/DivSize/DivSize2";
import BottomSheet from '../../components/BottomSheet';
import EditIcon from '@material-ui/icons/Edit';
import PollIcon from '@material-ui/icons/Poll';
import EmailIcon from '@material-ui/icons/Email';
import ListAltIcon from '@material-ui/icons/ListAlt';
import NoteIcon from '@material-ui/icons/Note';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import { toggleInvites, toggleInviteUserModal, togglePoll } from "../../containers/Sidebar";
import RoomTreeMenu from '../../components/RoomTreeMenu';

import {isDesktop, gotoPage, setCurrentNav} from '../../App';
import store, { changeConferenceMode, PeopleChatModes, setCurrentRoom } from "../../redux/main";
import { connect } from "react-redux";
import { ThreeSixty } from "@material-ui/icons";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { IconButton } from "@material-ui/core";
import RoomBottombar from '../../components/RoomBottombar'

let accessChangeCallback = undefined;
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback;
};
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback;
};
export let reloadConf = undefined

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

let currentRoomNavBackup = 0

export default function RoomPage(props) {

  let forceUpdate = useForceUpdate()

  const [membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)
  const [currentRoomNav, setCurrentRoomNav] = React.useState(currentRoomNavBackup)

  let onSocketAuth = () => {
    socket.off('membership-updated')
    socket.on('membership-updated', mem => {
      
    })
    socket.off('view-updated')
    socket.on('view-updated', v => {
      
    })
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/enter_room", requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          setMembership(result.membership)
          forceUpdate()
        })
        .catch(error => console.log('error', error));
  }

  let loadData = (callback) => {
    leaveRoom(() => {
      const search = props.location.search
      let rId = new URLSearchParams(search).get('room_id')
      setRoomId(rId)
      let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            roomId: rId
          }),
          redirect: 'follow'
      };
      fetch(serverRoot + "/room/get_room", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result))
              store.dispatch(setCurrentRoom(result.room))
              callback()
            })
            .catch(error => console.log('error', error));
      
      setToken(localStorage.getItem('token'));
      validateToken(token, (result) => {
          if (result) {
            onSocketAuth()
          }
          else {
            gotoPage('/app/register')
          }
      })
      
      ConnectToIo(token, onSocketAuth)
  
      window.scrollTo(0, 0);
      
      store.dispatch(changeConferenceMode(true));

      });
  }

  useEffect(() => {
    loadData(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return (<div/>)
  }

  return (
      <div style={{width: '100%', height: '100%', position: 'fixed', right: 0, top: 0, backgroundColor: colors.primaryDark}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#fff'}}>
        {
          currentRoomNav === 2 ? 
            <ConfBox/> :
            currentRoomNav === 1 ? 
              <BoardBox membership={membership} roomId={roomId} style={{display: 'block'}} /> :
              currentRoomNav === 3 ? 
                <TaskBox /> :
            null
        }
        </div>
        <RoomBottombar setCurrentRoomNavBackup={(v) => {currentRoomNavBackup = v}} setCurrentRoomNav={setCurrentRoomNav} currentRoomNav={currentRoomNav}/>
      </div>
    )
}
