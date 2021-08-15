import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { gotoPage } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
    direction: 'rtl'
  },
  inline: {
    display: 'inline',
  },
}));

export default function ChatsList() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(index => (
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
    </List>
  );
}
