
import React, {useEffect, useState} from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import './style.css';

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";

import {Avatar, Fab, IconButton, Typography} from "@material-ui/core";
import {colors, me, setToken, token} from "../../util/settings";
import {FetchMe, room, roomId, roothPath, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import {setPermissionState, togglePermissions} from '../../containers/Sidebar';
import { NotificationManager } from "../../components/ReactNotifications";

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { gotoPage } from "../../App";
import { reloadConf } from "../../routes/pages/conference";
import store, { switchRoomTreeMenu } from "../../redux/main";
import {forceUpdateRoomTreeMenu} from '../../components/RoomTreeMenu'
import VideocamOff from "@material-ui/icons/VideocamOff";

export let reloadUsersList = undefined;

let createNotification = (type, message, title) => {
  let cName = "";
  return () => {
    switch (type) {
      case "primary":
        NotificationManager.primary(
          "This is a notification!",
          "Primary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "secondary":
        NotificationManager.secondary(
          "This is a notification!",
          "Secondary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "info":
        NotificationManager.info("Info message", "", 3000, null, null, cName);
        break;
      case "success":
        NotificationManager.success(
          "Success message",
          "Title here",
          3000,
          null,
          null,
          cName
        );
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000,
          null,
          null,
          cName
        );
        break;
      case "error":
        NotificationManager.error(
          title,
          message,
          3000,
          null,
          null,
          cName
        );
        break;
      default:
        NotificationManager.info("Info message");
        break;
    }
  }
}

let lock = false

export let UsersBox = (props) => {
    let forceUpdate = useForceUpdate()
    let [treeData, setTreeData] = React.useState([])
    let [currentHover, setCurrentHover] = React.useState(-1)
    let [video, setVideo] = React.useState({})
    let [audio, setAudio] = React.useState({})
    reloadUsersList = () => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          spaceId: room.spaceId,
          roomId: roomId
        }),
        redirect: 'follow'
      };
      fetch(serverRoot + "/room/get_room_users", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result))
            result.users.forEach(u => {
              if (video[u.id] === undefined) {
                video[u.id] = false
                audio[u.id] = false
              }
            })
            setUsers(result.users)
          })
          .catch(error => console.log('error', error));
    }
    const [users, setUsers] = useState([]);
    useEffect(() => {
      window.addEventListener('message', e => {
        if (e.data.sender === 'confvideo') {
          if (e.data.action === 'takePermissions') {
            setVideo(e.data.permissions)
            forceUpdate()
          }
          else if (e.data.action === 'takePermission') {
            video[e.data.userId] = e.data.permission
            setVideo(video)
            forceUpdate()
          }
        }
        else if (e.data.sender === 'confaudio') {
          if (e.data.action === 'takePermissions') {
            setAudio(e.data.permissions)
            forceUpdate()
          }
          else if (e.data.action === 'takePermission') {
            audio[e.data.userId] = e.data.permission
            setAudio(audio)
            forceUpdate()
          }
        }
      })
          reloadUsersList();
          socket.off('user-entered');
          socket.on('user-entered', ({rooms, users}) => {
            users.forEach(u => {
              if (video[u.id] === undefined) {
                video[u.id] = false
                audio[u.id] = false
              }
            })
            setUsers(users)
            window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'getPermissions'}, 'https://confvideo.kaspersoft.cloud')
            window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'getPermissions'}, 'https://confaudio.kaspersoft.cloud')
          });
          socket.off('user-exited');
          socket.on('user-exited', ({rooms, users}) => {
            users.forEach(u => {
              if (video[u.id] === undefined) {
                video[u.id] = false
                audio[u.id] = false
              }
            })
            setUsers(users)
            window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'getPermissions'}, 'https://confvideo.kaspersoft.cloud')
            window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'getPermissions'}, 'https://confaudio.kaspersoft.cloud')
          });
          socket.off('profile_updated');
          socket.on('profile_updated', user => {
            
          });
    }, []);
    return (
    <div style={{width: '100%', height: 'calc(100% - 32px)', marginTop: 32}}>
      <div>
        <span style={{fontSize: 20, width: 'calc(100% - 16px)', marginRight: 24, marginTop: 12, marginBottom: 12}}><Typography variant={'body'} style={{color: colors.textIcons}}>کاربران ({users.length})</Typography></span>
        <div style={{height: '100%'}}>
          <PerfectScrollbar
              option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div style={{height: 'auto', marginRight: 12, paddingTop: 24}}>
              {users.map((user, index) => {
                return (
                  <div
                      key={index}
                      className="d-flex flex-row mb-3 pb-3"
                      style={{direction: 'rtl', position: 'relative', width: 'calc(100% - 16px)', marginRight: 16}}
                      onMouseEnter={() => setCurrentHover(index)}
                      onMouseLeave={() => setCurrentHover(-1)}
                  >
                    <Avatar
                          style={{width: 24, height: 24}}
                          alt={user.firstName + ' ' + user.lastName}
                    />
                    <div className="pl-3 pr-2" onClick={() => {
let requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': token
  },
  body: JSON.stringify({
    roomId: props.roomId,
    targetUserId: user.id
  }),
  redirect: 'follow'
};
fetch(serverRoot + "/room/is_permissions_accessible", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(JSON.stringify(result));
    if (result.status === 'success') {
      if (result.isAccessible) {
        setPermissionState(props.roomId, user.id);
        togglePermissions();
      }
      else {
        createNotification("error", "عدم دسترسی", "دسترسی به منبع مورد نظر مجاز نمی باشد")();
      }
    }
  })
  .catch(error => console.log('error', error));
                    }}>
                        <p className="font-weight-medium mb-0 " style={{color: colors.textIcons, fontSize: 13, marginTop: 4}}>
                          {currentHover === index ? user.firstName : (user.firstName + ' ' + user.lastName)}
                        </p>
                    </div>
                    {props.membership.canEditVideoSound && currentHover === index ?
                      <div style={{marginTop: -12, position: 'absolute', left: 0, display: 'flex', backgroundColor: colors.primary}}>
                        <IconButton onClick={(e) => {
                          window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchPermission', targetId: user.id, status: !video[user.id]}, 'https://confvideo.kaspersoft.cloud')
                          video[user.id] = !video[user.id]
                          setVideo(video)
                          forceUpdate()
                        }}>{video[user.id] ? <VideocamIcon style={{fill: colors.textIcons}}/> : <VideocamOff style={{fill: colors.textIcons}}/>}</IconButton>
                        <IconButton  onClick={(e) => {
                          window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'switchPermission', targetId: user.id, status: !audio[user.id]}, 'https://confaudio.kaspersoft.cloud')
                          audio[user.id] = !audio[user.id]
                          setAudio(audio)
                          forceUpdate()
                        }}>{audio[user.id] ? <MicIcon style={{fill: colors.textIcons}}/> : <MicOffIcon style={{fill: colors.textIcons}}/>}</IconButton>
                      </div> :
                      null
                    }
                  </div>
                );
              })}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>);
}
