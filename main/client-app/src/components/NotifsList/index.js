import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl'
  },
  inline: {
    display: 'inline',
  },
}));

export default function NotifsList() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <div style={{width: '100%'}}>

      <ListItem alignItems="flex-start" style={{width: '100%', borderRadius: 16, backgroundColor: 'rgba(200, 10, 120, 0.5)', marginTop: 8, marginRight: -24, width: 'calc(100% + 48px)', backdropFilter: 'blur(10px)'}}>
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
      ))}
    </List>
  );
}
