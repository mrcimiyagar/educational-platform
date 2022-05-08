import { Paper } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import EmptyIcon from '../../images/empty.png';
import { colors, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl'
  },
  inline: {
    display: 'inline',
  },
}));

export default function SearchResultsMessages(props) {
  const classes = useStyles();

  return props.data.length > 0 ?
    <Paper style={{
      width: '100%',
      backgroundColor: colors.field, 
      borderRadius: 16
    }}>
      <List className={classes.root}>
        {props.data.map(message => (
            <div>
              <ListItem key={'search-user-' + message['User.id']} alignItems="flex-start" button={true} style={{direction: 'rtl'}} onClick={() => {}}>
                  <ListItemAvatar>
                    <Avatar rc={serverRoot + `/file/download_user_avatar?token=${token}&userId=${message['User.id']}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                          className={classes.inline}
                          color="textPrimary"
                          style={{position: 'absolute', right: 64, color: colors.text}}
                        >
                          {message.author.firstName + ' ' + message.author.lastName}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          className={classes.inline}
                          color="textPrimary"
                          style={{position: 'absolute', right: 64, top: 36, color: colors.text}}
                        >
                          {message.text}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        ))}
      </List>
    </Paper> :
    <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
      <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
    </div>
}
