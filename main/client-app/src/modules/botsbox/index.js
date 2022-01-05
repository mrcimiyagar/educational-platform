import {
  Avatar,
  createTheme,
  Drawer,
  Fab,
  Slide,
  SwipeableDrawer,
  ThemeProvider,
  Typography,
} from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import { Chat } from '@material-ui/icons'
import Add from '@material-ui/icons/Add'
import Edit from '@material-ui/icons/Edit'
import React, { useEffect } from 'react'
import { gotoPage, inTheGame, isDesktop, isInRoom, isMobile, isOnline, isTablet } from '../../App'
import BotContainer from '../../components/BotContainer'
import BotsBoxSearchbar from '../../components/BotsBoxSearchbar'
import HomeToolbar from '../../components/HomeToolbar'
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import { token } from '../../util/settings'
import { registerEvent, serverRoot, socket, useForceUpdate } from '../../util/Utils'

var lastScrollTop = 0
let idDict = {};
let memDict = {};
let clickEvents = {};
let mirrors = [];
let currentEngineHeartbit;

let ckeckCode = (codes) => {
  for (let i = 0; i < codes.length; i++) {
    let code = codes[i];
    let handler = () => {
      if (code.type === 'conditionList') {
        for (let i = 0; i < code.conditions.length; i++) {
          let condition = code.conditions[i];
          let item1 = undefined;
          if (condition.item1 !== undefined) {
            if (condition.item1.type === 'gui') {
              item1 = idDict[condition.item1.elId].obj[condition.item1.property];
            }
            else if (condition.item1.type === 'memory') {
              item1 = memDict[condition.item1.memoryId];
            }
            else if (condition.item1.type === 'constant') {
              item1 = condition.item1.constant;
            }
          }
          let item2 = undefined;
          if (condition.item2 !== undefined) {
            if (condition.item2.type === 'gui') {
              item2 = idDict[condition.item2.elId].obj[condition.item2.property];
            }
            else if (condition.item2.type === 'memory') {
              item2 = memDict[condition.item2.memoryId];
            }
            else if (condition.item2.type === 'constant') {
              item2 = condition.item2.constant;
            }
          }
          
          let allowed = false;
          if (condition.type === 'e' && item1 === item2) {
            allowed = true;
          }
          else if (condition.type === 'lt' && item1 < item2) {
            allowed = true;
          }
          else if (condition.type === 'lte' && item1 <= item2) {
            allowed = true;
          }
          else if (condition.type === 'gte' && item1 >= item2) {
            allowed = true;
          }
          else if (condition.type === 'gt' && item1 > item2) {
            allowed = true;
          }
          else if (condition.type === 'ne' && item1 !== item2) {
            allowed = true;
          }
          
          if (allowed === true) {
            if (condition.then !== undefined) {
              ckeckCode(condition.then);
              break;
            }
          }
        }
      }
      else if (code.type === 'straight') {
        if (code.updateType === 'gui') {
          idDict[code.elId].obj[code.property] = code.newValue;
        }
        else if (code.updateType === 'memory') {
          memDict[code.memoryId] = code.value;
        }
      }
    }
    if (code.delay !== undefined) {
      setTimeout(() => {
        handler();
      }, code.delay);
    }
    else {
      handler();
    }
  }
};

export default function BotsBox(props) {
  let forceUpdate = useForceUpdate();
  let [editMode, setEditMode] = React.useState(false);
  let [widgetPreviews, setWidgetPreviews] = React.useState([{id: 1}]);
  let [widgets, setWidgets] = React.useState([]);
  let [myBots, setMyBots] = React.useState([]);
  let [guis, setGuis] = React.useState({});
  let [previewGuis, setPreviewGuis] = React.useState({});
  let [timers, setTimers] = React.useState({});
  let [menuOpen, setMenuOpen] = React.useState(false);
  let [styledContents, setStyledContents] = React.useState({});
  let [mySelectedBot, setMySelectedBot] = React.useState(0);
  
  let requestInitGui = (wId, preview=true) => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        widgetId: wId,
        preview: preview,
        roomId: props.roomId
      }),
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/request_initial_gui", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
      });
  };

  useEffect(() => {
    let element = document.getElementById('botsContainerOuter')
    let botsSearchbar = document.getElementById('botsSearchbar')
    botsSearchbar.style.transform = 'translateY(-100px)'
    element.addEventListener(
      'scroll',
      function () {
        var st = element.scrollTop
        if (st > lastScrollTop) {
          botsSearchbar.style.transform = 'translateY(-100px)'
          botsSearchbar.style.transition = 'transform .5s'
        } else {
          botsSearchbar.style.transform = 'translateY(0)'
          botsSearchbar.style.transition = 'transform .5s'
        }
        lastScrollTop = st <= 0 ? 0 : st
      },
      false,
    );
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      redirect: 'follow',
    };
    fetch(serverRoot + '/bot/get_subscriptions', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setMyBots(result.bots);
      })
      .catch((error) => console.log('error', error));
  }, [])

  useEffect(() => {
    currentEngineHeartbit = setInterval(() => {
      try {
        mirrors.forEach((mirror) => {
          let timeNow =
            mirror.variable.from === 'time.now.seconds'
              ? new Date().getSeconds()
              : mirror.variable.from === 'time.now.minutes'
              ? new Date().getMinutes()
              : mirror.variable.from === 'time.now.hours'
              ? new Date().getHours() % 12
              : 0;
          let varCont = mirror.value;
          varCont = varCont.replace('@' + mirror.variable.id, timeNow);
          idDict[mirror.widgetId][mirror.elId].obj[mirror.property] = varCont;
        });
        forceUpdate();
      } catch(ex) {console.log(ex);}
    }, 1000);

    if (isOnline) {
      registerEvent('gui', ({type, gui: data, widgetId, roomId}) => {
      if (type === 'init') {
        guis[widgetId] = data;
        idDict[widgetId] = {};
        memDict[widgetId] = {};
        clickEvents[widgetId] = {};
        mirrors = mirrors.filter(m => m.widgetId !== widgetId);
        forceUpdate();
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            widgetId: widgetId
          }),
          redirect: 'follow'
        }
        fetch(serverRoot + "/bot/notify_gui_base_activated", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result));
          });
      } else if (type === 'update') {
        data.forEach((d) => {
          if (d.property === 'styledContent') {
            styledContents[widgetId][d.elId] = d.newValue;
          }
          idDict[widgetId][d.elId].obj[d.property] = d.newValue;
        });
        setStyledContents(styledContents);
        forceUpdate();
      } else if (type === 'mirror') {
        data.forEach((d) => {
          d.widgetId = widgetId
        })
        mirrors = mirrors.concat(data)
        forceUpdate()
      } else if (type === 'timer') {
        let timer = setInterval(() => {
          data.updates.forEach((d) => {
            idDict[widgetId][d.elId].obj[d.property] = d.newValue
          })
          forceUpdate()
        }, data.interval)
        timers[data.timerId] = timer
        setTimers(timers)
        forceUpdate()
      } else if (type === 'untimer') {
        let timer = timers[data.timerId]
        clearInterval(timer)
        delete timers[data.timerId]
        setTimers(timers)
        forceUpdate()
      } else if (type === 'memorize') {
        memDict[widgetId][data.memoryId] = data.value
        forceUpdate();
      } else if (type === 'attachClick') {
        clickEvents[widgetId][data.elId] = () => {
          ckeckCode(data.codes);
          forceUpdate();
        };
      }
    })
  }
    let botsSearchbar = document.getElementById('botsSearchbar')
    botsSearchbar.style.transform = 'translateY(0)'
    botsSearchbar.style.transition = 'transform .5s'

    updateDesktop();

    return () => {
      if (currentEngineHeartbit !== undefined) {
        clearInterval(currentEngineHeartbit);
      }
    };
  }, []);

  let theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#FFC107',
      },
    },
  })

  mirrors.forEach((mirror) => {
    if (mirror.variable.from === 'variable') {
      let fetchedDataOfMemory = memDict[mirror.widgetId][mirror.variable.id];
      let varCont = mirror.value;
      varCont = varCont.replace('@' + mirror.variable.id, fetchedDataOfMemory);
      idDict[mirror.widgetId][mirror.elId].obj[mirror.property] = varCont;
    }
  });

  let updateDesktop = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/bot/get_widget_workers', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
          setWidgets(result.widgetWorkers);
          result.widgetWorkers.forEach(ww => {
            requestInitGui(ww.widgetId, false);
          });
        }
      });
  };

  Object.keys(styledContents).forEach(wId => {
    let widEls = styledContents[wId];
    Object.keys(widEls).forEach(scId => {
      let el = document.getElementById('widget_' + wId + '_element_' + scId);
      if (el !== null) {
        el.innerHTML = styledContents[wId][scId];
      }
    });
  });

  return (
    <div id={props.id}
      style={{ width: '100%', height: '100%', display: props.style.display }}
    >
      <div
        id={'botsSearchbar'}
        style={{
          width: '75%',
          position: 'absolute',
          right: '12.5%',
          top: 32,
          zIndex: 3,
        }}
      >
        <BotsBoxSearchbar openMenu={props.openMenu} />
      </div>
      <div
        id={'botsContainerOuter'}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          zIndex: 2,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <div id={'botsContainerInner'} style={{ width: '100%', height: 2000 }}>
          {widgets.map((w) => {
            return (
              <BotContainer
                realIdPrefix={'widget_' + w.id + '_element_'}
                widgetId={w.id}
                isPreview={false}
                onIdDictPrepared={(idD) => {
                  idDict['widget-' + w.id] = idD
                }}
                onElClick={(elId) => {
                  if (clickEvents[w.id][elId] !== undefined) {
                    clickEvents[w.id][elId]();
                  }
                }}
                editMode={editMode}
                widgetWidth={250}
                widgetHeight={250}
                widgetX={16}
                widgetY={28}
                gui={guis[w.id]}
              />
            )
          })}
          <div id="ghostpane" style={{ display: 'none' }}></div>
        </div>
      </div>
      <ThemeProvider theme={theme}>
      {(isDesktop() && isInRoom()) ? null :
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
        >
      <Fab
        color={'secondary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (72 + 12) : 12,
          right: 16 + 72,
          zIndex: 4,
        }}
        onClick={() => gotoPage('/app/chat', {room_id: props.roomId, user_id: props.userId})}
      >
        <Chat />
      </Fab>
      </Slide>}
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
        >
      <Fab
        color={'secondary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (72 + 16) : 16,
          left: isDesktop() && isInRoom() ? 32 : 16,
          zIndex: 4,
        }}
        onClick={() => setEditMode(!editMode)}
      >
        <Edit />
      </Fab>
      </Slide>
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
        >
      <Fab
        size={'medium'}
        color={'primary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (56 + 16 + 72 + 16) : (16 + 56 + 16),
          left: (isDesktop() && isInRoom() ? 32 : 16) + 4,
          zIndex: 4,
        }}
        onClick={() => setMenuOpen(true)}
      >
        <Add />
      </Fab>
      </Slide>
      </ThemeProvider>
      <SwipeableDrawer
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        anchor={'left'}
        style={{ direction: 'ltr', position: 'fixed', zIndex: 99999 }}
        PaperProps={{
          style: {
            background: 'rgba(225, 225, 225, 0.55)',
            backdropFilter: 'blur(15px)'
          }
        }}
        keepMounted={true}
      >
        <div
          style={{
            width: 360,
            height: '100%',
            display: 'flex',
          }}
        >
          <div style={{ position: 'relative', width: 80, height: '100%', background: 'rgba(225, 225, 225, 0.55)' }}>
            {
              myBots.map(bot => (
                <Avatar
                  src={serverRoot + `/file/download_bot_avatar?token=${token}&botId=${bot.id}`}
                  style={{
                    width: 64,
                    height: 64,
                    marginLeft: 8,
                    marginTop: 16,
                    backgroundColor: '#fff'
                  }}
                />
              ))
            }
          </div>
          <div style={{ width: 280, height: '100%', position: 'relative' }}>
            {Object.values(myBots).length > 0 ?
              myBots[mySelectedBot].widgets.map((wp) => (
              <div style={{width: '100%'}} onClick={() => {
                let requestOptions = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    token: token,
                  },
                  body: JSON.stringify({
                    botId: myBots[mySelectedBot].id,
                    roomId: props.roomId,
                    widgetId: wp.id,
                    x: 100,
                    y: 100,
                    width: 150,
                    height: 150
                  }),
                  redirect: 'follow',
                }
                fetch(serverRoot + '/bot/create_widget_worker', requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.status === 'success') {
                      updateDesktop();
                      alert('ربات به میزکار افزوده شد.');
                    }
                    else {
                      alert(result.message);
                    }
                  });
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
                  src={serverRoot + `/file/download_widget_thumbnail?token=${token}&widgetId=${wp.id}`}
                />
                <Typography style={{marginTop: -16,  width: '100%', textAlign: 'center',
                                    alignItems: 'center', justifyContent: 'center'}}
                >
                  {wp.title}
                </Typography>
              </div>
              )) :
              null
            }
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  )
}
