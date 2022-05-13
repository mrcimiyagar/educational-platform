import { Chip, Fade, Grow } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Audiotrack, Done, DoneAll, Photo, Videocam } from '@material-ui/icons'
import React from 'react'
import { isDesktop, isTablet, setCurrentUserId } from '../../App'
import EmptySign from '../../components/EmptySign'
import { resetMessages } from '../../routes/pages/chat'
import { colors, me, token } from '../../util/settings'
import { isMobile, serverRoot, useForceUpdate } from '../../util/Utils'
import {inTheGame} from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    direction: 'rtl'
  },
  inline: {
    display: 'inline'
  },
}))

export let updateMessageSeen = () => {};

export default function AllChats(props) {
  let forceUpdate = useForceUpdate();
  const classes = useStyles()
  updateMessageSeen = (msg) => {
    props.chats.forEach(chat => {
      if (msg.roomId === chat.id && msg.id === chat.lastMessage.id) {
        chat.lastMessage.seen = msg.seen;
      }
    });
    forceUpdate();
  };

  return props.chats.length > 0 ? (
    <List className={classes.root}>
      {props.chats.map((chat, index) => {
        let dateTime =
          chat.lastMessage === undefined
            ? undefined
            : new Date(Number(chat.lastMessage.time))
        return (
          <Grow in={inTheGame} {...{ timeout: (index + 1) * 500 }} transitionDuration={1000}>
          <div>
            <ListItem
              alignItems="flex-start"
              button
              style={{ height: 80, backgroundColor: colors.field, borderRadius: (index === 0 ? '16px 16px ' : '0 0 ') + (index === (props.chats.length - 1) ? '16px 16px' : '0 0')}}
              onClick={() => {
                if (isMobile()) props.setInTheGame(false);
                resetMessages();
                props.setSelectedChatId(chat.id);
                setCurrentUserId(chat.participent.id);
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
                        color: colors.text,
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
                          color: colors.text,
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
                  <div style={{ width: '100%', position: 'relative' }}>
                    {chat.lastMessage.authorId === me.id ?
                        <div style={{ position: 'relative' }}>
                          <Done id={'message-seen-chat-' + chat.lastMessage.id} style={{fill: colors.accent, left: 12 + 40, position: 'absolute', top: 0, display: (chat.lastMessage.seen === 0 || chat.lastMessage.seen === undefined) ? 'block' : 'none', width: 16, height: 16 }} /> :
                          <DoneAll id={'message-seen-chat-all-' + chat.lastMessage.id} style={{fill: colors.accent, left: 12 + 40, position: 'absolute', top: 0, display: (chat.lastMessage.seen > 0  && chat.lastMessage.seen !== undefined) ? 'block' : 'none', width: 16, height: 16 }} /> :
                        </div> :
                      null
                    }
                    {chat.lastMessage === undefined ? null : chat.lastMessage
                        .messageType === 'photo' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                          backgroundColor: colors.accent
                        }}
                        icon={<Photo style={{ borderRadius: 4 }} />}
                        label="عکس"
                        size={'small'}
                      />
                    ) : chat.lastMessage.messageType === 'audio' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                          backgroundColor: colors.accent
                        }}
                        icon={<Audiotrack style={{ borderRadius: 4 }} />}
                        label="صدا"
                        size={'small'}
                      />
                    ) : chat.lastMessage.messageType === 'video' ? (
                      <Chip
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          direction: 'ltr',
                          transform: 'translateY(8px)',
                          backgroundColor: colors.accent
                        }}
                        icon={<Videocam style={{ borderRadius: 4 }} />}
                        label="ویدئو"
                        size={'small'}
                      />
                    ) : (
                      <Typography
                        noWrap
                        style={{
                          width: '100%',
                          textAlign: 'right',
                          color: colors.text,
                          fontSize: 14,
                          top: 0,
                          right: 0,
                          position: 'absolute'
                        }}
                      >
                        {chat.lastMessage.text}
                      </Typography>
                    )}
                    {chat.unread > 0 ?
                      <div
                        style={{
                          borderRadius: '50%',
                          backgroundColor: colors.accent,
                          paddingLeft: 4,
                          paddingRight: 4,
                          paddingTop: 4,
                          paddingBottom: 4,
                          width: 28,
                          height: 28,
                          position: 'absolute',
                          left: 16,
                          top: 16,
                          transform: 'translateY(-20px)',
                          color: colors.text
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
            {
              (props.chats.length - 1) > index ?
                <Divider component="li" /> :
                null
            }
          </div>
          </Grow>
        )
      })}
    </List>
  ) : (
    <EmptySign />
  )
}
