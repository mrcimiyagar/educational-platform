import { Avatar, Fab, IconButton, Typography } from '@material-ui/core'
import { GroupAdd, VideocamOff } from '@material-ui/icons'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamIcon from '@material-ui/icons/Videocam'
import 'chartjs-plugin-datalabels'
import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-circular-progressbar/dist/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-sortable-tree/style.css'
import 'react-table/react-table.css'
import { pathConfig } from '../..'
import { NotificationManager } from '../../components/ReactNotifications'
import { colors, token } from '../../util/settings'
import { registerEvent, room, serverRoot, socket, unregisterEvent, useForceUpdate } from '../../util/Utils'
import './style.css'
import {setPermissionState, togglePermissions} from '../../containers/Sidebar';

export let reloadUsersList = undefined

let createNotification = (type, message, title) => {
  let cName = ''
  return () => {
    switch (type) {
      case 'primary':
        NotificationManager.primary(
          'This is a notification!',
          'Primary Notification',
          3000,
          null,
          null,
          cName,
        )
        break
      case 'secondary':
        NotificationManager.secondary(
          'This is a notification!',
          'Secondary Notification',
          3000,
          null,
          null,
          cName,
        )
        break
      case 'info':
        NotificationManager.info('Info message', '', 3000, null, null, cName)
        break
      case 'success':
        NotificationManager.success(
          'Success message',
          'Title here',
          3000,
          null,
          null,
          cName,
        )
        break
      case 'warning':
        NotificationManager.warning(
          'Warning message',
          'Close after 3000ms',
          3000,
          null,
          null,
          cName,
        )
        break
      case 'error':
        NotificationManager.error(title, message, 3000, null, null, cName)
        break
      default:
        NotificationManager.info('Info message')
        break
    }
  }
}

let lock = false

let processMessage = undefined
export let usersRef = undefined;

export let UsersBox = (props) => {
  let forceUpdate = useForceUpdate();
  let [currentHover, setCurrentHover] = React.useState(-1);
  let [video, setVideo] = React.useState({});
  let [audio, setAudio] = React.useState({});
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pauseds, setPauseds] = useState([]);
  reloadUsersList = () => {
    let registeredModuleLoading = setInterval(() => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          spaceId: room.spaceId,
          roomId: props.roomId,
        }),
        redirect: 'follow',
      }
      fetch(serverRoot + '/room/get_room_users', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result))
          result.users.forEach((u) => {
            if (video[u.id] === undefined) {
              video[u.id] = false
            } else if (audio[u.id] === undefined) {
              audio[u.id] = false
            }
          })
          setUsers(result.users);
          if (result.pauseds !== undefined) setPauseds(result.pauseds);
          setAllUsers(result.allUsers);
        })
        .catch((error) => console.log('error', error))
      if (room !== undefined) {
        clearInterval(registeredModuleLoading);
      }
    }, 500);
  }
  useEffect(() => {
    reloadUsersList();
    unregisterEvent('user-entered');
    registerEvent('user-entered', ({ rooms, users, allUsers, pauseds }) => {
      if (users !== undefined) setUsers(users);
      if (pauseds !== undefined) setPauseds(pauseds);
      if (allUsers !== undefined) setAllUsers(allUsers);
      usersRef = {allUsers, rooms, users};
      forceUpdate();
    })
    unregisterEvent('user-exited')
    registerEvent('user-exited', ({ rooms, users, allUsers, pauseds }) => {
      if (users !== undefined) setUsers(users);
      if (pauseds !== undefined) setPauseds(pauseds);
      if (allUsers !== undefined) setAllUsers(allUsers);
      usersRef = {allUsers, rooms, users};
      forceUpdate();
    })
    unregisterEvent('profile_updated');
    registerEvent('profile_updated', (user) => {
      reloadUsersList();
    });
  }, [])

  let permsOnClick = (user) => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
        targetUserId: user.id,
      }),
      redirect: 'follow',
    }
    fetch(
      serverRoot + '/room/is_permissions_accessible',
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.status === 'success') {
          if (result.isAccessible) {
            setPermissionState(props.roomId, user.id);
            togglePermissions();
          } else {
            createNotification(
              'error',
              '?????? ????????????',
              '???????????? ???? ???????? ???????? ?????? ???????? ?????? ????????',
            )()
          }
        }
      })
      .catch((error) => console.log('error', error));
  }

  let onlineDict = {};

  if (users !== undefined) {
    users.forEach(u => {
      onlineDict[u.id] = true;
    });
  }

  return (
    <div style={{ width: '100%', height: 'calc(100% - 32px)', marginTop: 32 }}>
      <div>
        <span
          style={{
            fontSize: 20,
            width: 'calc(100% - 16px)',
            marginRight: 24,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <Typography variant={'body'} style={{ color: colors.text }}>
            ?????????????? ({users.length})
          </Typography>
        </span>
        <div style={{ height: '100%' }}>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div style={{ height: 'auto', marginRight: 12, paddingTop: 24 }}>
              <div style={{marginBottom: 16, color: colors.text}}>
                ????????????
              </div>
              {users.map((user, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      direction: 'rtl',
                      position: 'relative',
                      width: 'calc(100% - 16px)',
                      marginRight: 16,
                      display: 'flex',
                    }}
                    onMouseEnter={() => setCurrentHover(index)}
                    onMouseLeave={() => setCurrentHover(-1)}
                  >
                    <Avatar
                      style={{ width: 24, height: 24 }}
                      alt={user.firstName + ' ' + user.lastName}
                      onClick={() => permsOnClick(user)}
                      src={
                        serverRoot +
                        `/file/download_user_avatar?token=${token}&userId=${user.id}`}
                    />
                    <div
                      style={{ marginRight: 16, marginTop: -2 }}
                      onClick={() => permsOnClick(user)}
                    >
                      <p
                        style={{
                          color: colors.text,
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {currentHover === index
                          ? user.firstName
                          : user.firstName + ' ' + user.lastName}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div style={{marginBottom: 12, color: colors.text}}>
                ????????????
              </div>
              {allUsers.filter(u => (onlineDict[u.id] !== true)).map((user, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      direction: 'rtl',
                      position: 'relative',
                      width: 'calc(100% - 16px)',
                      marginRight: 16,
                      display: 'flex',
                    }}
                    onMouseEnter={() => setCurrentHover(index)}
                    onMouseLeave={() => setCurrentHover(-1)}
                  >
                    <Avatar
                      style={{ width: 24, height: 24 }}
                      alt={user.firstName + ' ' + user.lastName}
                      onClick={() => permsOnClick(user)}
                      src={
                        serverRoot +
                        `/file/download_user_avatar?token=${token}&userId=${user.id}`}
                    />
                    <div
                      style={{ marginRight: 16, marginTop: -2 }}
                      onClick={() => permsOnClick(user)}
                    >
                      <p
                        style={{
                          color: colors.text,
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {currentHover === index
                          ? user.firstName
                          : user.firstName + ' ' + user.lastName}
                      </p>
                    </div>
                    {props.membership.canEditVideoSound &&
                    currentHover === index ? (
                      <div
                        style={{
                          marginTop: -12,
                          position: 'absolute',
                          left: 0,
                          display: 'flex'
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            window.frames['conf-video-frame'].postMessage(
                              {
                                sender: 'main',
                                action: 'switchVideoPermission',
                                targetId: user.id,
                                status: !video[user.id],
                              },
                              pathConfig.videoConfVideo,
                            )
                            video[user.id] = !video[user.id]
                            setVideo(video)
                            forceUpdate()
                          }}
                        >
                          {video[user.id] ? (
                            <VideocamIcon style={{ fill: colors.text }} />
                          ) : (
                            <VideocamOff style={{ fill: colors.text }} />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            window.frames['conf-video-frame'].postMessage(
                              {
                                sender: 'main',
                                action: 'switchAudioPermission',
                                targetId: user.id,
                                status: !audio[user.id],
                              },
                              pathConfig.videoConfVideo,
                            )
                            audio[user.id] = !audio[user.id]
                            setAudio(audio)
                            forceUpdate()
                          }}
                        >
                          {audio[user.id] ? (
                            <MicIcon style={{ fill: colors.text }} />
                          ) : (
                            <MicOffIcon style={{ fill: colors.text }} />
                          )}
                        </IconButton>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  )
}
