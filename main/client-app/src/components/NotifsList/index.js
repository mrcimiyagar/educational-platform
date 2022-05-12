import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { fetchNotifications, isDesktop } from '../../App';
import EmptyIcon from '../../images/empty.png';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptySign from '../EmptySign';
import {colors} from '../../util/settings';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    direction: 'rtl'
  },
  imageList: {
    paddingTop: 48,
    width: '100%',
    height: 'auto',
    paddingBottom: 56,
    paddingLeft: 16,
    paddingRight: 16,
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  inline: {
    display: 'inline',
  },
}));

export default function NotifsList() {
  const classes = useStyles();

  let [notifs, setNotifs] = React.useState([])

  useEffect(() => {
    setNotifs(fetchNotifications());
  }, [])

  return notifs.length > 0 ?
    <List className={classes.root}>
        {notifs.map(notif => {
          let dateTime = new Date(Number(notif.time));
          return (<div style={{width: '100%'}}>
            <ListItem alignItems="flex-start" style={{borderRadius: 16, backgroundColor: 'rgba(200, 10, 120, 0.5)', marginTop: 8, marginRight: -24, width: 'calc(100% + 48px)', backdropFilter: colors.blur}}>
              <ListItemAvatar>
                <Avatar alt="notification avatar" src={notif.icon} />
              </ListItemAvatar>
              <ListItemText
                style={{color: '#fff'}}
                primary={notif.title}
                secondary={
                  <React.Fragment style={{color: '#fff'}}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                      style={{color: '#fff'}}
                    >
                      {notif.text}
                    </Typography>
                    <Typography style={{color: '#fff'}}>
                      {
                        dateTime.toLocaleDateString('fa-IR').toString() +
                        ' ' +
                        dateTime.getHours() +
                        ':' +
                        dateTime.getMinutes() +
                        ':' +
                        dateTime.getSeconds()
                      }
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>);
        })
      }
    </List> :
    <div style={{transform: isDesktop() ? 'translateX(-176px)' : undefined}}>
      <EmptySign/>
    </div>
}
