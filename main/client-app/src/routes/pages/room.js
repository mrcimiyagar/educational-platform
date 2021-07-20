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

import {isDesktop, gotoPage} from '../../App';
import store, { changeConferenceMode, PeopleChatModes, setCurrentRoom } from "../../redux/main";
import { connect } from "react-redux";
import { ThreeSixty } from "@material-ui/icons";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { IconButton } from "@material-ui/core";

let accessChangeCallback = undefined;
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback;
};
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback;
};
export let reloadConf = undefined
export let updateConf = undefined

export default function RoomPage(props) {

  let forceUpdate = useForceUpdate()

  const [membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)

  let onSocketAuth = () => {
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
      
      socket.off('membership-updated')
      socket.on('membership-updated', mem => {
        
      })
    
      socket.off('view-updated')
      socket.on('view-updated', v => {
        
      })
  
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
      <div style={{width: window.innerWidth + 'px', height: window.innerHeight + 'px', position: 'fixed', right: 0, paddingRight: 16, top: 0, backgroundColor: colors.primaryDark}}>
        <div style={{position: 'absolute', left: 0, top: 64, width: '100%', height: 'calc(100vh - 128px)'}}> 
          <UsersBox membership={membership} roomId={roomId} room={store.getState().global.main.room}/>
          <ChatBox membership={membership} roomId={roomId}/>
          <VideoBox roomId={roomId}/>
          <PresentBox membership={membership} roomId={roomId}/>
          <BoardBox membership={membership} roomId={roomId}/>
          <BoardBox membership={membership} roomId={roomId}/>
          <BottomSheet>
            <TaskBox roomId={roomId} style={{display:'block'}} boxHeight={'calc(100vh - 64px)'} boxHeightInner={'calc(100vh - 64px)'}/>
          </BottomSheet>

          <BottomSheet setDrawerOpen={d => this.setState({drawerOpen: d})}>
            <div style={{display: 'grid',
                         gridTemplateColumns: '50% 50%',
                         rowGap: '15px'
                       }}>
              {
                membership.canUseWhiteboard ?
                  <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 8}} onClick={() => this.onFlagClicked(4)}>
                    <BorderColorIcon/>
                  </Button> :
                  null
              }
              {
                membership.canPresent ?
                  <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(3)}>
                    <SlideshowIcon/>
                  </Button> :
                  null
              }
              {
                membership.canUploadFile ?
                  <Button color="primary" className="default mb-2" outline onClick={() => toggleFileBox()} style={{height: 100, marginRight: 8}}>
                    <DescriptionIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(2)}>
                <VideocamIcon/>
              </Button>
              {
                membership.canAddMessage ?
                  <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 8}}  onClick={() => this.onFlagClicked(1)}>
                    <ChatIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(0)}>
                <PeopleIcon/>
              </Button>
              {
                membership.canAddPoll ?
                  <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 8}}  onClick={() => togglePoll()}>
                    <PollIcon/>
                  </Button> :
                  null
              }
              {
                membership.canInviteToRoom ?
                  <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 16}}  onClick={() => toggleInviteUserModal()}>
                    <EmailIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 8}} onClick={() => {

              }}>
                <NoteIcon/>
              </Button>
              <Button color="primary" className="default mb-2" style={{height: 100, marginRight: 16}} onClick={() => this.setState({drawerOpen2: true})}>
                <ListAltIcon/>
              </Button>
            </div>
          </BottomSheet>
        </div>
        <PollBox roomId={roomId}/>
        <FileBox roomId={roomId}/>
        <Button color="primary" className="mb-2" onClick={() => this.setState({drawerOpen: true})} style={{position: 'fixed', width: 56, height: 56, left: 16, bottom: 16, padding: 12, zIndex: 2000}}>
          <EditIcon/>
        </Button> 
      </div>
    )
}
