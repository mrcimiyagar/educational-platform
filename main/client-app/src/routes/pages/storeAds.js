import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Avatar, Card, Dialog, Fab, Slide, Typography } from '@material-ui/core';
import SpacesSearchbar from '../../components/StoreAdsSearchbar';
import HomeToolbar from '../../components/HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';
import { popPage, registerDialogOpen } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'calc(100% + 16px)',
    height: '100vh',
    marginLeft: -16,
    marginRight: -16,
  },
  imageList: {
    width: '100%',
    height: '100%',
    paddingTop: 112,
    paddingBottom: 56,
    overflow: 'auto',
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

var lastScrollTop = 0

export default function StoreAds() {
  
  document.documentElement.style.overflow = 'auto';
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        let element = document.getElementById('adsContainerOuter')
        let botsSearchbar = document.getElementById('adsSearchbar')
        element.onscroll = () => {
          var st = element.scrollTop;
          if (st > lastScrollTop){
              botsSearchbar.style.transform = 'translateY(-100px)'
              botsSearchbar.style.transition = 'transform .5s'
          } else {
              botsSearchbar.style.transform = 'translateY(0)'
              botsSearchbar.style.transition = 'transform .5s'
          }
          lastScrollTop = st <= 0 ? 0 : st;
        }
      });
    }
  }, [open])

  return (
    <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
    <div className={classes.root}>
      <div id={'adsSearchbar'} style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
        <SpacesSearchbar handleClose={handleClose}/>
      </div>
      <ImageList id={'adsContainerOuter'} style={{zIndex: 2}} rowHeight={144} cols={3} gap={1} className={classes.imageList}>
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
  </Dialog>
  );
}
