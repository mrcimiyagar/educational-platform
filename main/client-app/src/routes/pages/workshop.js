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
  setToken,
  token
} from '../../util/settings';
import {
  serverRoot, setConfig
} from '../../util/Utils';
import WorkshopWallpaper from '../../images/workshop-wallpaper.jpg';
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import BotContainer from '../../components/BotContainer';
import Menu from '@material-ui/icons/Menu';
import CachedIcon from '@mui/icons-material/Cached';
import BotIcon from '../../images/bot-image.png';

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

export let updateMyBotsList = () => {};

function Workshop(props) {
  const [bots, setBots] = React.useState([]);
  const [menuMode, setMenuMode] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  updateMyBotsList = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/get_my_bots", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.myBots !== undefined) {
          setBots(result.myBots);
        }
      });
  };
  useEffect(() => {
    setWallpaper({type: 'photo', photo: WorkshopWallpaper});
    updateMyBotsList();
  }, []);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };
  return (
    <div style={{overflow: 'auto', width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, direction: 'rtl'}}>
      <iframe name="coder-frame" allow="clipboard-read;" src={pathConfig.codeServer}
          frameborder="0" style={{border: 0, backgroundColor: 'transparent', background: 'transparent',
          width: '50%', height: '100%', position: 'absolute', left: 0, 
          top: 0, bottom: 0}}>
      </iframe>
      <div style={{position: 'fixed', left: '50%', top: 0}}>
        <AppBar variant='fixed' style={{width: '50%', height: 64, position: 'fixed', right: 0, backdropFilter: 'blur(10px)', backgroundColor: colors.secondary}}>
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
      <Fab color={'secondary'} style={{position: 'fixed', left: 'calc(50% + 24px)', bottom: 24}}>
        <CachedIcon/>
      </Fab>
      <SwipeableDrawer
          open={open}
          onClose={() => setOpen(false)}
          anchor={'right'}
          PaperProps={{style: {
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(10px)'
          }}}
          keepMounted={true}
        >
          <div
            style={{
              width: 360,
              height: '100%',
              display: 'flex',
              direction: 'rtl',
            }}
          >
            <div
              style={{
                width: 80,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.55)'
              }}
            >
              {bots.map((bot, index) => {
                return (
                  <Avatar
                    onClick={() => setMenuMode(index)}
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: '#fff',
                      marginTop: 12,
                      marginRight: 12,
                      padding: 8,
                    }}
                    src={
                      serverRoot + `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
                    }
                  />
                );
              })}
              <Fab
                style={{
                  backgroundColor: '#fff',
                  marginTop: 12,
                  marginRight: 12,
                  boxShadow: 'none'
                }}
                onClick={() => gotoPage('/app/createbot')}
              >
                <Add />
              </Fab>
            </div>
            <div
              style={{
                width: 360 - 80,
                height: '100%',
              }}
            >
              {bots.length > 0 ?
                bots[menuMode].widgets.map(bot => {
                  return (
                    <Avatar
                      onClick={() => setMenuMode(1)}
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: '#fff',
                        marginRight: 16,
                        marginTop: 16,
                        padding: 8,
                      }}
                      src={BotIcon}
                    />
                  );
                }) :
                null
              }
              <Fab color={'secondary'} style={{position: 'fixed', left: 16, bottom: 16}} onClick={() => gotoPage('/app/createwidget', {bot_id: bots[menuMode].id})}>
                <Add />
              </Fab>
            </div>
          </div>
      </SwipeableDrawer>
    </div>
  )
}

export default Workshop;
