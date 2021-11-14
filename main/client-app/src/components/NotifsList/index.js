import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import EmptyIcon from '../../images/empty.png';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptySign from '../EmptySign';

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
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/notifications/get_notifications", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              if (result.notifications !== undefined) {
                setNotifs(result.notifications);
              }
          })
          .catch(error => console.log('error', error));
  }, [])

  return notifs.length > 0 ?
    <List className={classes.root}>
        {notifs.map(i => (
          <div style={{width: '100%'}}>
        <ListItem alignItems="flex-start" style={{borderRadius: 16, backgroundColor: 'rgba(200, 10, 120, 0.5)', marginTop: 8, marginRight: -24, width: 'calc(100% + 48px)', backdropFilter: 'blur(10px)'}}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            style={{color: '#fff'}}
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment style={{color: '#fff'}}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                  style={{color: '#fff'}}
                >
                  Ali Connors
                </Typography>
                <Typography style={{color: '#fff'}}>{" — I'll be in your neighborhood doing errands this…"}</Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start" style={{borderRadius: 16, backgroundColor: 'rgba(100, 10, 240, 0.5)', marginTop: 8, marginRight: -24, width: 'calc(100% + 48px)', backdropFilter: 'blur(10px)'}}>
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText
            style={{color: '#fff'}}
            primary="Summer BBQ"
            secondary={
              <React.Fragment style={{color: '#fff'}}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                  style={{color: '#fff'}}
                >
                  to Scott, Alex, Jennifer
                </Typography>
                <Typography style={{color: '#fff'}}>{" — Wish I could come, but I'm out of town this…"}</Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start" style={{borderRadius: 16, backgroundColor: 'rgba(20, 200, 100, 0.5)', marginTop: 8, marginRight: -24, width: 'calc(100% + 48px)', backdropFilter: 'blur(10px)'}}>
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText style={{color: '#fff'}}
            primary="Oui Oui"
            secondary={
              <React.Fragment style={{color: '#fff'}}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  style={{color: '#fff'}}
                  color="textPrimary"
                >
                  Sandra Adams
                </Typography>
                <Typography style={{color: '#fff'}}>{' — Do you have Paris recommendations? Have you ever…'}</Typography>
              </React.Fragment>
            }
          />
        </ListItem>
          </div>
        ))
      }
    </List> :
    <EmptySign/>
}
