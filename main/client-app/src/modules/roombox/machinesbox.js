import { Avatar, Button, Fab, IconButton, Typography } from '@material-ui/core'
import { Add, VideocamOff } from '@material-ui/icons'
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
import { gotoPage } from '../../App'

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

export let usersRef = undefined;

export let MachinesBox = (props) => {
  let forceUpdate = useForceUpdate();
  
  const [rooms, setRooms] = useState([]);

  reloadUsersList = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room_bots', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setUsers(result.bots);
      })
      .catch((error) => console.log('error', error))
  }

  return (
    <div style={{ width: '100%', height: 'calc(100% - 32px)', marginTop: 32, position: 'relative' }}>
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
            ???????? ????
          </Typography>
        </span>
        <div style={{ height: '100%' }}>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div style={{ height: 'auto', marginRight: 12, paddingTop: 24 }}>
              <div style={{width: '100%', height: 16}}/>
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
                        `/file/download_bot_avatar?token=${token}&botId=${user.id}`}
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
                        {user.title}
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
