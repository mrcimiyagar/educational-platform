import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Avatar, Card, Fab, Typography } from '@material-ui/core';
import SpacesSearchbar from '../../components/StoreAdsSearchbar';
import HomeToolbar from '../../components/HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    width: 'calc(100% + 32px)',
    height: '100vh',
    marginLeft: -16,
    marginRight: -16
  },
  imageList: {
    backgroundColor: '#fff',
    width: '100%',
    height: 'auto',
    paddingBottom: 56,
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

export default function StoreAds() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
          <SpacesSearchbar/>
        </div>
      </HomeToolbar>
      <ImageList style={{zIndex: 2}} rowHeight={144} cols={3} gap={1} className={classes.imageList}>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} style={{ width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/647171/header.jpg?t=1556904675'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} cols={2} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644921/header.jpg?t=1542406005'} style={{width: '100%'}} />
        </ImageListItem>
        <ImageListItem key={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} cols={1} rows={1}>
          <img src={'https://cdn.cloudflare.steamstatic.com/steam/apps/644910/header.jpg?t=1542406074'} style={{width: '100%'}} />
        </ImageListItem>
      </ImageList>
      <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}>
        <MessageIcon />
      </Fab>
    </div>
  );
}
