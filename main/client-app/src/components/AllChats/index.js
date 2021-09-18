import { Chip } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Audiotrack, Photo, Videocam } from '@material-ui/icons'
import React from 'react'
import { Badge } from 'reactstrap'
import { gotoPage, isDesktop, isTablet } from '../../App'
import EmptySign from '../../components/EmptySign'
import { colors, token } from '../../util/settings'
import { leaveRoom, serverRoot, useForceUpdate } from '../../util/Utils'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    direction: 'rtl',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
  },
  inline: {
    display: 'inline',
  },
}))

export default function AllChats(props) {
  const classes = useStyles()

  let forceUpdate = useForceUpdate()

  return props.chats.length > 0 ? (
    <List className={classes.root}>
      {props.chats.map((chat) => {
        let dateTime =
          chat.lastMessage === undefined
            ? undefined
            : new Date(Number(chat.lastMessage.time))
        return (
          <div>
            <ListItem
              alignItems="flex-start"
              button
              style={{ height: 80 }}
              onClick={() => {
                leaveRoom(() => {
                  let requestOptions2 = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      token: token,
                    },
                    body: JSON.stringify({
                      roomId: chat.id,
                    }),
                    redirect: 'follow',
                  }
                  fetch(serverRoot + '/room/enter_room', requestOptions2)
                    .then((response) => response.json())
                    .then((result) => {
                      console.log(JSON.stringify(result))
                      if (isDesktop() || isTablet()) {
                        props.setSelectedRoomId(chat.id)
                        props.setSelectedUserId(chat.participent.id)
                      } else {
                        gotoPage('/app/chat', {
                          room_id: chat.id,
                          user_id: chat.participent.id,
                        })
                      }
                    })
                    .catch((error) => console.log('error', error))
                })
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    serverRoot +
                    `/file/download_user_avatar?token=${token}&userId=${chat.participent.id}`
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment style={{ position: 'relative' }}>
                    <Typography
                      noWrap
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        color: '#000',
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}
                    >
                      {chat.participent.firstName +
                        ' ' +
                        chat.participent.lastName}
                    </Typography>
                    {chat.lastMessage === undefined ? null : (
                      <Typography
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          position: 'absolute',
                          top: 16,
                          fontSize: 12,
                          left: 16,
                          color: '#000',
                        }}
                      >
                        {dateTime.toLocaleDateString('fa-IR').toString() +
                          ' ' +
                          dateTime.getHours() +
                          ':' +
                          dateTime.getMinutes() +
                          ':' +
                          dateTime.getSeconds()}
                      </Typography>
                    )}
                  </React.Fragment>
                }
                secondary={
                  <div style={{ width: '100%' }}>
                    {chat.lastMessage === undefined ? null : chat.lastMessage
                        .messageType === 'photo' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 16 + 56,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                        }}
                        icon={<Photo style={{ borderRadius: 4 }} />}
                        label="عکس"
                        color="primary"
                        size={'small'}
                      />
                    ) : chat.lastMessage.messageType === 'audio' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 16 + 56,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                        }}
                        icon={<Audiotrack style={{ borderRadius: 4 }} />}
                        label="صدا"
                        color="primary"
                        size={'small'}
                      />
                    ) : chat.lastMessage.messageType === 'video' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 16 + 56,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                        }}
                        icon={<Videocam style={{ borderRadius: 4 }} />}
                        label="ویدئو"
                        color="primary"
                        size={'small'}
                      />
                    ) : (
                      <Typography
                        noWrap
                        style={{
                          width: '100%',
                          textAlign: 'right',
                          color: '#000',
                          fontSize: 14,
                        }}
                      >
                        {chat.lastMessage.text}
                      </Typography>
                    )}
                    {chat.unread > 0 ? 
                      <div
                        style={{
                          borderRadius: '50%',
                          backgroundColor: colors.primaryMedium,
                          paddingLeft: 4,
                          paddingRight: 4,
                          paddingTop: 4,
                          paddingBottom: 4,
                          width: 28,
                          height: 28,
                          position: 'absolute',
                          left: 16,
                          transform: 'translateY(-20px)',
                          color: '#fff'
                        }}
                      >
                        {chat.unread}
                      </div>  :
                      null
                    }
                  </div>
                }
              />
            </ListItem>
            <Divider component="li" />
          </div>
        )
      })}
    </List>
  ) : (
    <EmptySign />
  )
}
