import { AppBar, Avatar, Fab, IconButton, makeStyles, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import { Add, People } from '@material-ui/icons';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import React, { useEffect } from "react";
import { pathConfig, setWallpaper } from '../..';
import { db, gotoPage, isDesktop, isInRoom } from '../../App';
import Jumper from '../../components/SearchEngineFam';
import WhiteColorTextField from '../../components/WhiteColorTextField';
import Wallpaper from '../../images/chat-wallpaper.jpg';
import CloudIcon from '../../images/logo.png';
import {
  colors,
  setHomeRoomId,
  setHomeSpaceId,
  setMe,
  setToken
} from '../../util/settings';
import {
  serverRoot, setConfig
} from '../../util/Utils';
import WorkshopWallpaper from '../../images/workshop-wallpaper.jpg';
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import BotContainer from '../../components/BotContainer';
import Menu from '@material-ui/icons/Menu';
import HomeDrawer from '../../components/HomeDrawer';

let widget1Gui = {
  type: 'Box',
  id: 'clockBox',
  width: '100%',
  height: '100%',
  transition: 'transform 1s',
  children: [
    {
      type: 'Image',
      id: 'clockBackImage',
      width: '100%',
      height: '100%',
      borderRadius: 1000,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      src:
        'https://i.pinimg.com/originals/eb/ad/bc/ebadbc481c675e0f2dea0cc665f72497.jpg',
    },
    {
      type: 'Box',
      id: 'clockBackShadow',
      width: '100%',
      height: '100%',
      borderRadius: 1000,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2,
      background: 'rgba(255, 255, 255, 0.5)',
    },
    {
      type: 'Text',
      id: 'clockMsg',
      width: '100%',
      height: 'auto',
      position: 'absolute',
      alignChildren: 'center',
      top: 32,
      zIndex: 3,
      text: 'سلام کیهان',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Image',
      id: 'weather',
      width: '50%',
      position: 'absolute',
      alignChildren: 'center',
      top: 56,
      right: 56,
      zIndex: 3,
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrRZ2vclesoWZ4DOCjXPzbAvg5VEFEn7OiHQ&usqp=CAU',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Text',
      id: 'weatherMsg',
      width: '100%',
      height: 'auto',
      position: 'absolute',
      alignChildren: 'center',
      top: 112 + 40 + 24,
      zIndex: 3,
      text: 'نیمه ابری 31 درجه',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Box',
      id: 'secondHand',
      width: 250,
      height: 25,
      position: 'absolute',
      left: 100,
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(75deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'secondImage',
          width: 250,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand1,
        },
      ],
    },
    {
      type: 'Box',
      id: 'minuteHand',
      width: 450,
      height: 25,
      position: 'absolute',
      left: '0',
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(-135deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'minuteImage',
          width: 200,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand1,
        },
      ],
    },
    {
      type: 'Box',
      id: 'hourHand',
      width: 450,
      height: 25,
      position: 'absolute',
      left: 0,
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(295deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'hourImage',
          width: 250,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand2,
        },
      ],
    },
  ],
}

let idDict = {}

function Workshop(props) {
  useEffect(() => {
    setWallpaper({type: 'photo', photo: WorkshopWallpaper});
  }, []);
  let [open, setOpen] = React.useState(false);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };
  return (
    <div style={{overflow: 'auto', width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, direction: 'rtl'}}>
      <iframe name="coder-frame" src={pathConfig.codeServer}
          frameborder="0" style={{border: 0, backgroundColor: 'transparent', background: 'transparent',
          width: '50%', height: '100%', position: 'absolute', left: 0, 
          top: 0, bottom: 0, left: 0}}>
        </iframe>
      <div style={{position: 'fixed', left: '50%', top: 0}}>
        <AppBar variant='fixed' style={{width: '50%', height: 64, position: 'fixed', right: 0, backgroundColor: colors.primaryMedium}}>
          <Toolbar>
            <IconButton onClick={toggleDrawer('right', true)}>
              <Menu style={{fill: '#fff'}}/>
            </IconButton>
            <Typography variant='h6' style={{color: '#fff'}}>
              کارگاه
            </Typography>
          </Toolbar>
        </AppBar>
        <BotContainer
          onIdDictPrepared={(idD) => {
            idDict['widget-1'] = idD
          }}
          widgetId={1}
          isPreview={false}
          editMode={false}
          widgetWidth={450}
          widgetHeight={450}
          widgetX={(window.innerWidth / 4) - 225 / 2}
          widgetY={window.innerHeight / 2 - 175}
          gui={widget1Gui}
        />
      </div>
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: isDesktop() ? -52 : 0
        }}
      >
        <Jumper />
      </div>
      <Fab color={'secondary'} onClick={() => gotoPage('/app/createbot')} style={{position: 'fixed', left: 'calc(50% + 24px)', bottom: 24}}>
        <Add/>
      </Fab>
      <SwipeableDrawer
        onClose={toggleDrawer('right', false)}
        open={open}
        anchor={'right'}
      >
        <div
          style={{
            width: 360,
            height: '100%',
            backgroundColor: '#fff',
            display: 'flex',
            direction: 'rtl',
          }}
        >
          <div style={{ width: 80, height: '100%', backgroundColor: '#eee' }}>
            <Avatar
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#fff',
                position: 'absolute',
                right: 8,
                top: 16,
                padding: 8,
              }}
              src={People}
            />
          </div>
          <div style={{ width: 280, height: '100%' }}>
              
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

export default Workshop;
