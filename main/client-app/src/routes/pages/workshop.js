import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Fab,
  IconButton,
  Slide,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Add, Close, Edit } from "@material-ui/icons";
import React, { useEffect } from "react";
import { pathConfig, setWallpaper } from "../..";
import { currentRoomId, gotoPage, isDesktop } from "../../App";
import Jumper from "../../components/SearchEngineFam";
import { colors, token } from "../../util/settings";
import { registerEvent, serverRoot, unregisterEvent, useForceUpdate } from "../../util/Utils";
import WorkshopWallpaper from "../../images/space-wallpaper.png";
import BotContainer from "../../components/BotContainer";
import Menu from "@material-ui/icons/Menu";
import CachedIcon from "@mui/icons-material/Cached";
import CreateBotPage from "./createBot";
import CreateWidget from "./createWidget";
import BotInfoPage from "./botInfo";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

let widget1Gui = {
  type: "Box",
};

let idDict = {};
let memDict = {};
let clickEvents = {};
let mirrors = [];
let currentWidgetId = 0;
let currentEngineHeartbit;
let clickedElId = undefined;

export let updateMyBotsList = () => {};

let ckeckCode = (codes) => {
  for (let i = 0; i < codes.length; i++) {
    let code = codes[i];
    let handler = () => {
      if (code.type === "conditionList") {
        for (let i = 0; i < code.conditions.length; i++) {
          let condition = code.conditions[i];
          let item1 = undefined;
          if (condition.item1 !== undefined) {
            if (condition.item1.type === "gui") {
              item1 =
                idDict[condition.item1.elId].obj[condition.item1.property];
            } else if (condition.item1.type === "memory") {
              item1 = memDict[condition.item1.memoryId];
            } else if (condition.item1.type === "constant") {
              item1 = condition.item1.constant;
            }
          }
          let item2 = undefined;
          if (condition.item2 !== undefined) {
            if (condition.item2.type === "gui") {
              item2 =
                idDict[condition.item2.elId].obj[condition.item2.property];
            } else if (condition.item2.type === "memory") {
              item2 = memDict[condition.item2.memoryId];
            } else if (condition.item2.type === "constant") {
              item2 = condition.item2.constant;
            }
          }

          let allowed = false;
          if (condition.type === "e" && item1 === item2) {
            allowed = true;
          } else if (condition.type === "lt" && item1 < item2) {
            allowed = true;
          } else if (condition.type === "lte" && item1 <= item2) {
            allowed = true;
          } else if (condition.type === "gte" && item1 >= item2) {
            allowed = true;
          } else if (condition.type === "gt" && item1 > item2) {
            allowed = true;
          } else if (condition.type === "ne" && item1 !== item2) {
            allowed = true;
          }

          if (allowed === true) {
            if (condition.then !== undefined) {
              ckeckCode(condition.then);
              break;
            }
          }
        }
      } else if (code.type === "straight") {
        if (code.updateType === "gui") {
          idDict[code.elId].obj[code.property] = code.newValue;
        } else if (code.updateType === "memory") {
          memDict[code.memoryId] = code.value;
        }
      } else if (code.type === 'tellBot') {
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            widgetId: currentWidgetId,
            elementId: clickedElId,
            preview: true,
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/bot/element_clicked", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
          });
      }
    };
    if (code.delay !== undefined) {
      setTimeout(() => {
        handler();
      }, code.delay);
    } else {
      handler();
    }
  }
};

let editingBot = undefined;

function Workshop(props) {
  let forceUpdate = useForceUpdate();

  const [bots, setBots] = React.useState([]);
  const [menuMode, setMenuMode] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [timers, setTimers] = React.useState({});
  const [showCreateBot, setShowCreateBot] = React.useState(false);
  const [showCreateWidget, setShowCreateWidget] = React.useState(false);
  const [showBotInfo, setShowBotInfo] = React.useState(false);
  const [selectedBotId, setSelectedBotId] = React.useState(undefined);
  const [botSecret, setBotSecret] = React.useState({});
  let [styledContents, setStyledContents] = React.useState({});

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      props.onClose();
    }, 250);
  };

  updateMyBotsList = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_my_bots", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.myBots !== undefined) {
          setBots(result.myBots);
        }
      });
  };

  useEffect(() => {
    currentEngineHeartbit = setInterval(() => {
      mirrors.forEach((mirror) => {
        let timeNow =
          mirror.variable.from === "time.now.seconds"
            ? new Date().getSeconds()
            : mirror.variable.from === "time.now.minutes"
            ? new Date().getMinutes()
            : mirror.variable.from === "time.now.hours"
            ? new Date().getHours() % 12
            : 0;
        let varCont = mirror.value;
        varCont = varCont.replace("@" + mirror.variable.id, timeNow);
        idDict[mirror.elId].obj[mirror.property] = varCont;
      });
      forceUpdate();
    }, 1000);

    registerEvent("gui", ({ type, gui: data, widgetId, roomId }) => {
      if (currentWidgetId === widgetId) {
        if (type === "init") {
          idDict = {};
          memDict = {};
          clickEvents = {};
          mirrors = [];
          widget1Gui = data;
          forceUpdate();
          let requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
              widgetId: currentWidgetId,
              preview: true,
            }),
            redirect: "follow",
          };
          fetch(serverRoot + "/bot/notify_gui_base_activated", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result));
            });
        } else if (type === "update") {
          data.forEach((d) => {
            if (d.property === "styledContent") {
              styledContents[d.elId] = d.newValue;
            }
            if (idDict[d.elId] === undefined) return;
            idDict[d.elId].obj[d.property] = d.newValue;
          });
          setStyledContents(styledContents);
          forceUpdate();
        } else if (type === "mirror") {
          data.forEach((d) => {
            d.widgetId = widgetId;
          });
          mirrors = mirrors.concat(data);
          forceUpdate();
        } else if (type === "timer") {
          let timer = setInterval(() => {
            data.updates.forEach((d) => {
              idDict[d.elId].obj[d.property] = d.newValue;
            });
            forceUpdate();
          }, data.interval);
          timers[data.timerId] = timer;
          setTimers(timers);
          forceUpdate();
        } else if (type === "untimer") {
          let timer = timers[data.timerId];
          clearInterval(timer);
          delete timers[data.timerId];
          setTimers(timers);
          forceUpdate();
        } else if (type === "memorize") {
          memDict[data.memoryId] = data.value;
          forceUpdate();
        } else if (type === "attachClick") {
          clickEvents[data.elId] = () => {
            clickedElId = data.elId;
            ckeckCode(data.codes);
            forceUpdate();
          };
        }
      }
    });

    updateMyBotsList();

    return () => {
      if (
        currentEngineHeartbit !== null &&
        currentEngineHeartbit !== undefined
      ) {
        clearInterval(currentEngineHeartbit);
        currentEngineHeartbit = undefined;
      }
      unregisterEvent('gui');
    };
  }, []);

  const toggleDrawer = (anchor, menuOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMenuOpen(menuOpen);
  };

  let requestInitGui = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        widgetId: currentWidgetId,
        preview: true,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/request_initial_gui", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
      });
  };

  mirrors.forEach((mirror) => {
    if (mirror.variable.from === "variable") {
      let fetchedDataOfMemory = memDict[mirror.variable.id];
      let varCont = mirror.value;
      varCont = varCont.replace("@" + mirror.variable.id, fetchedDataOfMemory);
      idDict[mirror.elId].obj[mirror.property] = varCont;
    }
  });

  Object.keys(styledContents).forEach((scId) => {
    let el = document.getElementById("element_" + scId);
    if (el !== null) {
      el.innerHTML = styledContents[scId];
    }
  });

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: "transparent",
        },
      }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          overflow: "auto",
          width: "100%",
          height: "100%",
          direction: "rtl",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            left: 0,
            top: 0,
          }}
          src={WorkshopWallpaper}
          alt={"workshop wallpaper"}
        />
        <AppBar
          variant="fixed"
          style={{
            width: "100%",
            height: 64,
            position: "fixed",
            right: 0,
            backgroundColor: colors.primaryMedium,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Toolbar style={{height: 64}}>
            <IconButton onClick={toggleDrawer("right", true)}>
              <Menu style={{ fill: colors.icon }} />
            </IconButton>
            <Typography variant="h6" style={{ color: colors.text, flex: 1 }}>
              کارگاه
            </Typography>
            <IconButton onClick={handleClose}>
              <Close style={{ fill: colors.icon }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <BotContainer
          realIdPrefix={"element_"}
          onIdDictPrepared={(idD) => {
            idDict = idD;
          }}
          onElClick={(elId) => {
            if (clickEvents[elId] !== undefined) {
              clickEvents[elId]();
            }
          }}
          widgetId={1}
          isPreview={false}
          editMode={false}
          widgetWidth={300}
          widgetHeight={300}
          widgetX={(window.innerWidth - 300) / 2}
          widgetY={(window.innerHeight - 300) / 2}
          gui={widget1Gui}
        />
        <Fab
          style={{
            position: "fixed",
            left: 24,
            bottom: 24,
            backgroundColor: colors.accent,
          }}
          onClick={() => requestInitGui()}
        >
          <CachedIcon />
        </Fab>
        <SwipeableDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchor={"right"}
          PaperProps={{
            style: {
              background: colors.primaryMedium,
              backdropFilter: "blur(10px)",
            },
          }}
          keepMounted={true}
        >
          <div
            style={{
              width: 360,
              height: "100%",
              display: "flex",
              direction: "rtl",
            }}
          >
            <div
              style={{
                width: 80,
                height: "100%",
                background: colors.primaryDark
              }}
            >
              {bots.map((bot, index) => {
                return (
                  <>
                  <Avatar
                    onClick={() => setMenuMode(index)}
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: colors.field,
                      marginTop: 12,
                      marginRight: 12,
                    }}
                    src={
                      serverRoot +
                      `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
                    }
                  />
                  <Typography style={{width: '100%', marginTop: 8, color: colors.text}}>
                    {bot.title}
                  </Typography>
                  </>
                );
              })}
              <Fab
                style={{
                  backgroundColor: colors.field,
                  marginTop: 12,
                  marginRight: 12,
                  boxShadow: "none",
                }}
                onClick={() => setShowCreateBot(true)}
              >
                <Add style={{fill: colors.icon}} />
              </Fab>
            </div>
            <div
              style={{
                width: 360 - 80,
                height: "100%",
              }}
            >
              {bots.length > 0 ? (
                <Button
                  style={{
                    width: "calc(100% - 48px)",
                    marginRight: 24,
                    marginLeft: 24,
                    marginTop: 24,
                    backgroundColor: colors.accent2,
                    borderRadius: 16,
                    color: '#fff'
                  }}
                  onClick={() => {setSelectedBotId(bots[menuMode].id); setShowBotInfo(true);}}
                >
                  اطلاعات بات
                </Button>
              ) : null}
              {bots.length > 0
                ? bots[menuMode].widgets.map((widget) => {
                    return (
                      <div
                        style={{ width: "100%" }}
                        onClick={() => {
                          currentWidgetId = widget.id;
                          requestInitGui();
                        }}
                      >
                        <img
                          style={{
                            width: "calc(100% - 48px)",
                            height: "auto",
                            maxHeight: 200,
                            marginLeft: 24,
                            marginRight: 24,
                            marginTop: 12,
                          }}
                          src={
                            serverRoot +
                            `/file/download_widget_thumbnail?token=${token}&widgetId=${widget.id}`
                          }
                        />
                        <Typography
                          style={{
                            marginTop: -16,
                            width: "100%",
                            textAlign: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            color: colors.text
                          }}
                        >
                          {widget.title}
                        </Typography>
                      </div>
                    );
                  })
                : null}
              {bots.length > 0 ? (
                <Fab
                  style={{ backgroundColor: colors.accent, position: "fixed", left: 16, bottom: 16 }}
                  onClick={() => {setSelectedBotId(bots[menuMode].id); setShowCreateWidget(true);}}
                >
                  <Add />
                </Fab>
              ) : null}
              
              {bots.length > 0 ? (
                <Fab
                  style={{ backgroundColor: colors.accent, position: "fixed", left: 16 + 56 + 16, bottom: 16 }}
                  onClick={() => {editingBot = bots[menuMode]; setShowCreateBot(true);}}
                >
                  <Edit />
                </Fab>
              ) : null}
            </div>
          </div>
        </SwipeableDrawer>
        {showCreateBot ? <CreateBotPage editingBot={editingBot} onClose={() => {editingBot = undefined; setShowCreateBot(false);}} /> : null}
        {(showCreateWidget && selectedBotId !== undefined) ? <CreateWidget bot_id={selectedBotId} onClose={() => setShowCreateWidget(false)} /> : null}
        {(showBotInfo && selectedBotId !== undefined) ? <BotInfoPage forceUpdate={forceUpdate} botSecret={botSecret} setBotSecret={setBotSecret} bot_id={selectedBotId} onClose={() => setShowBotInfo(false)} /> : null}
      </div>
    </Dialog>
  );
}

export default Workshop;
