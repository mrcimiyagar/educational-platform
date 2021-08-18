import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { gotoPage } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline',
  },
}));

export default function SearchResultsUsers(props) {
  const classes = useStyles();

  return (
    <Paper style={{
      width: 'calc(100% + 32px)',
      marginLeft: -16,
      marginRight: -16,
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }}>
      <List className={classes.root}>
        {props.data.map(user => (
            <div>
            <ListItem alignItems="flex-start" button={true} onClick={() => gotoPage('/app/userprofile')}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={user.firstName + ' ' + user.lastName}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                    Software Engineer
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            </div>
        ))}
      </List>
    </Paper>
  );
}
