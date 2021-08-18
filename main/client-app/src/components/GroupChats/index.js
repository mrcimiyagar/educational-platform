import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { gotoPage, roomId } from '../../App';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptyIcon from '../../images/empty.png'

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

export default function GroupChats() {
  const classes = useStyles();

  let [rooms, setRooms] = React.useState([])

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/get_rooms", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              setRooms(result.rooms);
          })
          .catch(error => console.log('error', error));
  }, [])

  return rooms.length > 0 ?
    <List className={classes.root}>
      {rooms.map(index => (
      <div>
      <ListItem alignItems="flex-start" button onClick={() => gotoPage('/app/chat')}>
        <ListItemAvatar>
          <Avatar src="https://material-ui.com/static/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment style={{position: 'relative'}}>
            <Typography style={{width: '100%', textAlign: 'right'}}>
                {"کیهان محمدی"}
            </Typography>
            <Typography style={{width: '100%', textAlign: 'left', position: 'absolute', top: 16, fontSize: 12, left: 16, color: 'rgba(0, 0, 0, 0.5)'}}>
                {"1400/11/13"}
            </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
            <Typography style={{width: '100%', textAlign: 'right'}}>
                {"سلام . چطوری پویان ؟"}
            </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
      </div>
      ))}
    </List> :
    <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
      <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
    </div>
}
