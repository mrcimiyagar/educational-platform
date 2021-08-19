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
import { gotoPage, setUser } from '../../App';
import { serverRoot } from '../../util/Utils';
import { token } from '../../util/settings';

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
            <ListItem alignItems="flex-start" button={true} style={{direction: 'rtl'}} onClick={() => {gotoPage('/app/userprofile', {user_id: user.id});}}>
              <ListItemAvatar>
                <Avatar src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${user.id}`} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      className={classes.inline}
                      color="textPrimary"
                      style={{position: 'absolute', right: 64}}
                    >
                      {user.firstName + ' ' + user.lastName}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      className={classes.inline}
                      color="textPrimary"
                      style={{position: 'absolute', right: 64, top: 36}}
                    >
                      مهندس نرم افزار
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
