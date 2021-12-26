import { Card, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import BotIcon from '../../images/robot.png';
import { token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 150,
    marginTop: 72
  },
  imageList: {
    display: 'flex',
    flexWrap: 'noWrap',
    width: '100%',
    height: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
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
}));

export default function StoreWidgets(props) {
  const classes = useStyles();
  const [widgets, setWidgets] = React.useState([]);
  let forceUpdate = useForceUpdate();
  useEffect(() => {
    let requestOptions = {
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
    fetch(serverRoot + "/bot/get_widgets", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.widgets !== undefined) {
          setWidgets(result.widgets);
          forceUpdate();
        }
      })
      .catch(error => console.log('error', error));
  }, []);
  return (
    <div className={classes.root}>
      <Typography variant={'h6'} style={{marginLeft: 16, marginRight: 16, color: '#fff'}}>ویجت ها</Typography>
      <ImageList style={{zIndex: 2}} rowHeight={188} cols={2.5} gap={1} className={classes.imageList}>
        {widgets.length > 0 ? 
            widgets.map((item) => (
                <ImageListItem key={'widget_thumbnail_' + item.id} cols={1} rows={1}>
                    <div style={{position: 'relative'}}>
                        <img src={serverRoot + `/file/download_widget_thumbnail?token=${token}&widgetId=${item.id}`}
                            alt={'widget thumbnail'} style={{marginTop: 16, width: 'calc(100% - 64px)', height: 96}} />
                    </div>
                </ImageListItem>)) :
            <Typography style={{fontSize: 18, width: '100%', height: 150, lineHeight: 6, color: '#fff'}}>ویجتی یافت نشد.</Typography>
        }
      </ImageList>
    </div>
  );
}
