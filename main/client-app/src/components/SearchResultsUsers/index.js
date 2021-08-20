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
import EmptyIcon from '../../images/empty.png'

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

  return props.data.length > 0 ?
      <Paper style={{
        width: 'calc(100% + 32px)',
        marginLeft: -16,
        marginRight: -16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
      }}>
            <List className={classes.root}>
              {props.data.map(user => (
                <div>
                <ListItem key={'search-user-' + user.id} alignItems="flex-start" button={true} style={{direction: 'rtl'}} onClick={() => {gotoPage('/app/userprofile', {user_id: user.id});}}>
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
    </Paper> :
    <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
        <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
    </div>
}
