import { AppBar, Avatar, Button, Fab, IconButton, makeStyles, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
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
  registerEvent,
  serverRoot, setConfig, useForceUpdate
} from '../../util/Utils';
import WorkshopWallpaper from '../../images/workshop-wallpaper.jpg';
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import BotContainer from '../../components/BotContainer';
import Menu from '@material-ui/icons/Menu';
import CachedIcon from '@mui/icons-material/Cached';

let widget1Gui = {
  type: 'Box'
}

let idDict = {}
let currentWidgetId = 0;

export let updateMyBotsList = () => {};

function Workshop(props) {
  
  let forceUpdate = useForceUpdate();

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
    registerEvent('gui', ({type, gui, widgetId, roomId}) => {
      if (currentWidgetId === widgetId) {
        if (type === 'init') {
          widget1Gui = gui;
          forceUpdate();
        }
      }
    });
    updateMyBotsList();
  }, []);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };
  let requestInitGui = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        widgetId: currentWidgetId,
        preview: true
      }),
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/request_initial_gui", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.myBots !== undefined) {
          setBots(result.myBots);
        }
      });
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
      <Fab color={'secondary'} style={{position: 'fixed', left: 'calc(50% + 24px)', bottom: 24}} onClick={() => requestInitGui()}>
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
                      marginRight: 12
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
                <Button variant={'outlined'} style={{width: 'calc(100% - 48px)', marginRight: 24, marginLeft: 24, marginTop: 24}} onClick={() => gotoPage('/app/botinfo', {bot_id: bots[menuMode].id})}>
                  اطلاعات بات
                </Button> :
                null
              }
              {bots.length > 0 ?
                bots[menuMode].widgets.map(widget => {
                  return (
                    <div style={{width: '100%'}} onClick={() => {
                      currentWidgetId = widget.id;
                      requestInitGui();
                    }}>
                      <img
                        style={{
                          width: 'calc(100% - 48px)',
                          height: 'auto',
                          maxHeight: 200,
                          marginLeft: 24,
                          marginRight: 24,
                          marginTop: 12
                        }}
                        src={serverRoot + `/file/download_widget_thumbnail?token=${token}&widgetId=${widget.id}`}
                      />
                      <Typography style={{marginTop: -16,  width: '100%', textAlign: 'center',
                                          alignItems: 'center', justifyContent: 'center'}}
                      >
                        {widget.title}
                      </Typography>
                    </div>
                  );
                }) :
                null
              }
              {bots.length > 0 ?
                <Fab color={'secondary'} style={{position: 'fixed', left: 16, bottom: 16}} onClick={() => gotoPage('/app/createwidget', {bot_id: bots[menuMode].id})}>
                  <Add />
                </Fab> :
                null
              }
            </div>
          </div>
      </SwipeableDrawer>
    </div>
  )
}

export default Workshop;
