import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { gotoPage, isDesktop, roomId } from '../../App';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptyIcon from '../../images/empty.png'
import { Chip } from '@material-ui/core';
import { Audiotrack, Photo, Videocam, VideocamSharp } from '@material-ui/icons';
import EmptySign from '../EmptySign';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl', 
    backgroundColor: 'rgba(255, 255, 255, 0.35)', 
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
  },
  inline: {
    display: 'inline',
  },
}));

export default function ChannelChats(props) {
  const classes = useStyles();

  return props.chats.length > 0 ?
  <List className={classes.root}>
  {props.chats.map(chat => {
  let dateTime = chat.lastMessage === undefined ? undefined : new Date(Number(chat.lastMessage.time))
  return (
  <div>
  <ListItem alignItems="flex-start" button style={{height: 80}} onClick={() => {
      if (isDesktop === 'desktop' || isDesktop === 'tablet') {
        props.setSelectedRoomId(chat.id)
      }
      else {
        gotoPage('/app/chat', {room_id: chat.id});
      }
    }}>
    <ListItemAvatar>
      <Avatar src="https://material-ui.com/static/images/avatar/3.jpg" />
    </ListItemAvatar>
    <ListItemText
      primary={
        <React.Fragment style={{position: 'relative'}}>
        <Typography noWrap style={{width: '100%', textAlign: 'right', color: '#000', fontSize: 17, fontWeight: 'bold'}}>
            {chat.channel.title}
        </Typography>
        {chat.lastMessage === undefined ? null :
        <Typography style={{width: '100%', textAlign: 'left', position: 'absolute', top: 16, fontSize: 12, left: 16, color: '#000'}}>
            {dateTime && (dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds())}
        </Typography>}
        </React.Fragment>
      }
      secondary={
        chat.lastMessage === undefined ?
          null :
          chat.lastMessage.messageType === 'photo' ?
           <Chip
              style={{position: 'absolute', right: 16 + 56, direction: 'ltr', transform: 'translateY(8px)'}}
              icon={<Photo style={{borderRadius: 4}} />}
              label="عکس"
              color="primary"
              size={'small'}
            /> :
            chat.lastMessage.messageType === 'audio' ?
              <Chip
                style={{position: 'absolute', right: 16 + 56, direction: 'ltr', transform: 'translateY(8px)'}}
                icon={<Audiotrack style={{borderRadius: 4}} />}
                label="صدا"
                color="primary"
                size={'small'}
              /> :
              chat.lastMessage.messageType === 'video' ?
                <Chip
                  style={{position: 'absolute', right: 16 + 56, direction: 'ltr', transform: 'translateY(8px)'}}
                  icon={<Videocam style={{borderRadius: 4}} />}
                  label="ویدئو"
                  color="primary"
                  size={'small'}
                /> :
                <Typography noWrap style={{width: '100%', textAlign: 'right', color: '#000', fontSize: 14}}>
                  {chat.lastMessage.text}
                </Typography>
      }
    />
  </ListItem>
  <Divider component="li" />
  </div>)
  })}
</List> :
    <EmptySign/>
}
