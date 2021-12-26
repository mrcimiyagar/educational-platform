import { Fab, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import NavigationIcon from '@material-ui/icons/Navigation';
import Rating from '@material-ui/lab/Rating';
import React, { useEffect } from 'react';
import { token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100٪',
    direction: 'rtl'
  },
  inline: {
    display: 'inline',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function StoreComments(props) {
  let forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [comments, setComments] = React.useState([]);
  useEffect(() => {
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        botId: props.botId
      }),
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/get_comments", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.comments !== undefined) {
          setComments(result.comments);
          forceUpdate();
        }
      })
      .catch(error => console.log('error', error));
  }, []);
  return (
    <div style={{marginTop: 32}}>
      <Typography variant={'h6'} style={{marginLeft: 16, marginRight: 16, color: '#fff'}}>کامنت ها</Typography>
      {
          comments.length > 0 ?
            comments.map(comment => (
              <div style={{margin: 16, display: 'flex', position: 'relative'}}>
                <span>
                  <Avatar alt="user avatar" src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${comment.authorId}`} />
                </span>
                <span style={{marginRight: 16, color: '#fff'}}>
                  <b>{comment['Author.firstName'] + ' ' + comment['Author.lastName']}</b>
                  <br/>
                  {comment.text}
                </span>
                <Rating value={comments.Rating} style={{position: 'absolute', left: 0, top: 0}}/>
                <Divider variant="inset" component="li" />
              </div>
            )) :
            <Typography style={{fontSize: 18, width: '100%', height: 150, lineHeight: 8, color: '#fff'}}>کامنتی یافت نشد.</Typography>
      }
      {
        comments.length > 0 ?
          <Fab
            variant="extended"
            size="small"
            color="primary"
            style={{position: 'absolute', marginTop: 16, left: '50%', transform: 'translateX(-50%)'}}
          >
            <NavigationIcon className={classes.extendedIcon} />
            نمایش همه ی کامنت ها
          </Fab> :
          null
      }
    </div>
  );
}