import {
  Avatar,
  createTheme,
  Grow,
  Paper,
  SwipeableDrawer,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import BotContainer from "../../components/BotContainer";
import { colors, token } from "../../util/settings";
import {
  registerEvent,
  serverRoot,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import { Rnd } from "react-rnd";
import { currentRoomId } from "../../App";
import WhiteboardIcon from "../../images/whiteboard.png";
import TaskboardIcon from "../../images/taskboard.png";
import FilesIcon from "../../images/files.png";
import VoteIcon from "../../images/vote.png";
import VideochatIcon from "../../images/videochat.png";
import PresentationIcon from "../../images/presentation.png";
import NotesIcon from "../../images/notebook.png";
import ModulesIcon from "../../images/modules.png";

var lastScrollTop = 0;
let idDict = {};
let memDict = {};
let clickEvents = {};
let mirrors = [];
let styledContents = {};
let timers = {};
let guis = {};
let currentEngineHeartbit;
let widgets = [];
let clickedElId = undefined;

let ckeckCode = (wwId, codes, widgetId) => {
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
                idDict[wwId][condition.item1.elId].obj[
                  condition.item1.property
                ];
            } else if (condition.item1.type === "memory") {
              item1 = memDict[wwId][condition.item1.memoryId];
            } else if (condition.item1.type === "constant") {
              item1 = condition.item1.constant;
            }
          }
          let item2 = undefined;
          if (condition.item2 !== undefined) {
            if (condition.item2.type === "gui") {
              item2 =
                idDict[wwId][condition.item2.elId].obj[
                  condition.item2.property
                ];
            } else if (condition.item2.type === "memory") {
              item2 = memDict[wwId][condition.item2.memoryId];
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
              ckeckCode(wwId, condition.then, widgetId);
              break;
            }
          }
        }
      } else if (code.type === "straight") {
        if (code.updateType === "gui") {
          idDict[wwId][code.elId].obj[code.property] = code.newValue;
        } else if (code.updateType === "memory") {
          memDict[wwId][code.memoryId] = code.value;
        }
      } else if (code.type === "tellBot") {
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            roomId: currentRoomId,
            widgetWorkerId: wwId,
            widgetId: widgetId,
            elementId: clickedElId,
            preview: false,
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

export let openToolbox = () => {};
export let toggleEditMode = () => {};

export default function BotsBox(props) {
  let forceUpdate = useForceUpdate();
  let [editMode, setEditMode] = React.useState(false);
  let [myBots, setMyBots] = React.useState([]);
  let [menuOpen, setMenuOpen] = React.useState(false);
  let [mySelectedBot, setMySelectedBot] = React.useState(0);

  toggleEditMode = () => setEditMode(!editMode);

  const reloadBotsList = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_subscriptions", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setMyBots(result.bots);
      })
      .catch((error) => console.log("error", error));
  };

  openToolbox = () => {
    reloadBotsList();
    setMenuOpen(true);
  };

  let requestInitGui = (wwId, preview = true) => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        widgetWorkerId: wwId,
        preview: preview,
        roomId: props.roomId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/request_initial_gui", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
      })
      .catch((ex) => console.log(ex));
  };

  useEffect(() => {
    let element = document.getElementById("botsContainerOuter");
    let botsSearchbar = document.getElementById("botsSearchbar");
    botsSearchbar.style.transform = "translateY(-100px)";
    element.addEventListener(
      "scroll",
      function () {
        var st = element.scrollTop;
        if (st > lastScrollTop) {
          botsSearchbar.style.transform = "translateY(-100px)";
          botsSearchbar.style.transition = "transform .5s";
        } else {
          botsSearchbar.style.transform = "translateY(0)";
          botsSearchbar.style.transition = "transform .5s";
        }
        lastScrollTop = st <= 0 ? 0 : st;
      },
      false
    );
    reloadBotsList();
  }, []);

  useEffect(() => {
    currentEngineHeartbit = setInterval(() => {
      try {
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
          idDict[mirror.widgetWorkerId][mirror.elId].obj[mirror.property] =
            varCont;
        });
        forceUpdate();
      } catch (ex) {
        console.log(ex);
      }
    }, 1000);

    unregisterEvent("widget_worker_added");
    registerEvent("widget_worker_added", (ww) => {
      let found = false;
      for (let i = 0; i < widgets.length; i++) {
        if (widgets[i].id === ww.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        widgets.push(ww);
        forceUpdate();
        requestInitGui(ww.id, false);
      }
    });

    unregisterEvent("widget_worker_removed");
    registerEvent("widget_worker_removed", (wwId) => {
      for (let i = 0; i < widgets.length; i++) {
        if (widgets[i].id === wwId) {
          widgets.splice(i);
          break;
        }
      }
      forceUpdate();
    });

    unregisterEvent("widget_worker_moved");
    registerEvent("widget_worker_moved", (ww) => {
      for (let i = 0; i < widgets.length; i++) {
        if (widgets[i].id === ww.id) {
          widgets[i].x = ww.x;
          widgets[i].y = ww.y;
          widgets[i].width = ww.width;
          widgets[i].height = ww.height;
          forceUpdate();
          break;
        }
      }
    });

    unregisterEvent("gui");
    registerEvent(
      "gui",
      ({ type, gui: data, widgetId, roomId, widgetWorkerId }) => {
        try {
          if (currentRoomId === roomId) {
            if (type === "init") {
              guis[widgetWorkerId] = data;
              idDict[widgetWorkerId] = {};
              memDict[widgetWorkerId] = {};
              clickEvents[widgetWorkerId] = {};
              styledContents[widgetWorkerId] = {};
              mirrors = mirrors.filter(
                (m) => m.widgetWorkerId !== widgetWorkerId
              );
              forceUpdate();
              let requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  widgetWorkerId: widgetWorkerId,
                  preview: false,
                  roomId: roomId,
                }),
                redirect: "follow",
              };
              fetch(
                serverRoot + "/bot/notify_gui_base_activated",
                requestOptions
              )
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result));
                })
                .catch((ex) => console.log(ex));
            } else if (type === "update") {
              data.forEach((d) => {
                if (d.property === "styledContent") {
                  styledContents[widgetWorkerId][d.elId] = d.newValue;
                }
                idDict[widgetWorkerId][d.elId].obj[d.property] = d.newValue;
              });
              forceUpdate();
            } else if (type === "mirror") {
              data.forEach((d) => {
                d.widgetWorkerId = widgetWorkerId;
              });
              mirrors = mirrors.concat(data);
              forceUpdate();
            } else if (type === "timer") {
              let timer = setInterval(() => {
                data.updates.forEach((d) => {
                  idDict[widgetWorkerId][d.elId].obj[d.property] = d.newValue;
                });
                forceUpdate();
              }, data.interval);
              timers[data.timerId] = timer;
              forceUpdate();
            } else if (type === "untimer") {
              let timer = timers[widgetWorkerId][data.timerId];
              clearInterval(timer);
              delete timers[widgetWorkerId][data.timerId];
              forceUpdate();
            } else if (type === "memorize") {
              memDict[widgetWorkerId][data.memoryId] = data.value;
              forceUpdate();
            } else if (type === "attachClick") {
              clickEvents[widgetWorkerId][data.elId] = () => {
                clickedElId = data.elId;
                ckeckCode(widgetWorkerId, data.codes, widgetId);
                forceUpdate();
              };
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

    let botsSearchbar = document.getElementById("botsSearchbar");
    botsSearchbar.style.transform = "translateY(0)";
    botsSearchbar.style.transition = "transform .5s";

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
        main: "#BBDEFB",
      },
      secondary: {
        main: "#FFC107",
      },
    },
  });

  mirrors.forEach((mirror) => {
    if (mirror.variable.from === "variable") {
      let fetchedDataOfMemory =
        memDict[mirror.widgetWorkerId][mirror.variable.id];
      let varCont = mirror.value;
      varCont = varCont.replace("@" + mirror.variable.id, fetchedDataOfMemory);
      idDict[mirror.widgetWorkerId][mirror.elId].obj[mirror.property] = varCont;
    }
  });

  let updateDesktop = () => {
    widgets = [];
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_module_workers", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
        result.moduleWorkers.forEach((mw) => {
          widgets.push({
            id: mw.id,
            widgetId: mw.type,
            roomId: props.roomId,
            bossId: "admin",
            x: mw.x,
            y: mw.y,
            width: "150px",
            height: "150px",
          });
        });
        forceUpdate();
      }
      });
    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_widget_workers", requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          result.widgetWorkers.forEach((ww) => {
            widgets.push(ww);
            if (
              ww.widgetId !== "whiteboard" &&
              ww.widgetId !== "taskboard" &&
              ww.widgetId !== "filestorage" &&
              ww.widgetId !== "videochat" &&
              ww.widgetId !== "polling" &&
              ww.widgetId !== "notes" &&
              ww.widgetId !== "deck"
            ) {
              requestInitGui(ww.id, false);
            }
          });
          forceUpdate();
        }
      })
      .catch((ex) => console.log(ex));
  };

  Object.keys(styledContents).forEach((wId) => {
    let widEls = styledContents[wId];
    Object.keys(widEls).forEach((scId) => {
      let el = document.getElementById("widget_" + wId + "_element_" + scId);
      if (el !== null) {
        el.innerHTML = styledContents[wId][scId];
      }
    });
  });

  return (
    <div
      id={props.id}
      style={{ width: "100%", height: "100%", display: props.style.display }}
    >
      <div
        id={"botsSearchbar"}
        style={{
          width: "75%",
          position: "absolute",
          right: "12.5%",
          top: 32,
          zIndex: 3,
        }}
      ></div>
      <div
        id={"botsContainerOuter"}
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          zIndex: 2,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <div
          id={"botsContainerInner"}
          style={{ width: "100%", height: 2000, direction: "ltr" }}
        >
          {widgets.map((ww, index) => {
            if (editMode === true) {
              return (
                <Rnd
                  default={{
                    x: ww.x,
                    y: ww.y,
                    transform: "translateY(+144px)",
                    width: ww.width === null ? 150 : ww.width,
                    height: ww.height === null ? 150 : ww.height,
                  }}
                  onDragStop={(e, d) => {
                    ww.x = d.x;
                    ww.y = d.y;
                    if (
                      ww.widgetId === "whiteboard" ||
                      ww.widgetId === "taskboard" ||
                      ww.widgetId === "filestorage" ||
                      ww.widgetId === "videochat" ||
                      ww.widgetId === "polling" ||
                      ww.widgetId === "notes" ||
                      ww.widgetId === "deck"
                    ) {
                      let requestOptions = {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          token: token,
                        },
                        body: JSON.stringify({
                          roomId: props.roomId,
                          moduleWorkerId: ww.id,
                          x: d.x,
                          y: d.y,
                        }),
                        redirect: "follow",
                      };
                      fetch(
                        serverRoot + "/bot/update_prebuilt_module",
                        requestOptions
                      )
                        .then((response) => response.json())
                        .then((result) => {})
                        .catch((ex) => console.log(ex));
                    }
                    else {
                      let requestOptions = {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          token: token,
                        },
                        body: JSON.stringify({
                          widgetWorkerId: ww.id,
                          x: d.x,
                          y: d.y,
                          width: ww.width,
                          height: ww.height,
                        }),
                        redirect: "follow",
                      };
                      fetch(
                        serverRoot + "/bot/update_widget_worker",
                        requestOptions
                      )
                        .then((response) => response.json())
                        .then((result) => {})
                        .catch((ex) => console.log(ex));
                    }
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    ww.width = Number(
                      ref.style.width.substring(0, ref.style.width.length - 2)
                    );
                    ww.height = Number(
                      ref.style.height.substring(0, ref.style.height.length - 2)
                    );
                    let requestOptions = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        token: token,
                      },
                      body: JSON.stringify({
                        widgetWorkerId: ww.id,
                        x: ww.x,
                        y: ww.y,
                        width: Number(
                          ref.style.width.substring(
                            0,
                            ref.style.width.length - 2
                          )
                        ),
                        height: Number(
                          ref.style.height.substring(
                            0,
                            ref.style.height.length - 2
                          )
                        ),
                      }),
                      redirect: "follow",
                    };
                    fetch(
                      serverRoot + "/bot/update_widget_worker",
                      requestOptions
                    )
                      .then((response) => response.json())
                      .then((result) => {})
                      .catch((ex) => console.log(ex));
                  }}
                  enableResizing={!(
                    ww.widgetId === "whiteboard" ||
                    ww.widgetId === "taskboard" ||
                    ww.widgetId === "filestorage" ||
                    ww.widgetId === "videochat" ||
                    ww.widgetId === "polling" ||
                    ww.widgetId === "notes" ||
                    ww.widgetId === "deck"
                  )}
                >
                  {
                    (
                      ww.widgetId === "whiteboard" ||
                      ww.widgetId === "taskboard" ||
                      ww.widgetId === "filestorage" ||
                      ww.widgetId === "videochat" ||
                      ww.widgetId === "polling" ||
                      ww.widgetId === "notes" ||
                      ww.widgetId === "deck"
                    ) ? (
                      <Grow in={true} {...{ timeout: index * 650 }}>
                        <div
                          onClick={() => props.onModuleSelected(ww.widgetId)}
                          style={{
                            width: '100%',
                            height: '100%',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            transform: "translateY(+128px)",
                            backgroundColor: "transparent",
                            display: "flex",
                          }}
                        >
                          <Paper
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                              backgroundColor: colors.field,
                              borderRadius: "50%",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <img
                              style={{
                                width: "calc(100% - 64px)",
                                height: "calc(100% - 64px)",
                                position: "absolute",
                                left: 32,
                                top: 32,
                              }}
                              alt={ww.widgetId}
                              src={
                                ww.widgetId === "whiteboard"
                                  ? WhiteboardIcon
                                  : ww.widgetId === "taskboard"
                                  ? TaskboardIcon
                                  : ww.widgetId === "filestorage"
                                  ? FilesIcon
                                  : ww.widgetId === "videochat"
                                  ? VideochatIcon
                                  : ww.widgetId === "vote"
                                  ? VoteIcon
                                  : ww.widgetId === "notes"
                                  ? NotesIcon
                                  : ww.widgetId === "deck"
                                  ? PresentationIcon
                                  : ""
                              }
                            />
                          </Paper>
                        </div>
                      </Grow>
                    ) : (
                  <BotContainer
                  step={index}
                  realIdPrefix={"widget_" + ww.id + "_element_"}
                  widgetWorkerId={ww.id}
                  isPreview={false}
                  onIdDictPrepared={(idD) => {
                    idDict[ww.id] = idD;
                  }}
                  onElClick={(elId) => {
                    if (clickEvents[ww.id][elId] !== undefined) {
                      clickEvents[ww.id][elId]();
                    }
                  }}
                  editMode={editMode}
                  widgetWidth={"100%"}
                  widgetHeight={"100%"}
                  widgetX={0}
                  widgetY={0}
                  gui={guis[ww.id]}
                />
                    )
                  }
                  {(
                      ww.widgetId === "whiteboard" ||
                      ww.widgetId === "taskboard" ||
                      ww.widgetId === "filestorage" ||
                      ww.widgetId === "videochat" ||
                      ww.widgetId === "polling" ||
                      ww.widgetId === "notes" ||
                      ww.widgetId === "deck"
                    ) ? null : (
                  <Paper
                    style={{
                      width: 32,
                      height: 32,
                      position: "fixed",
                      right: -16,
                      bottom: -16,
                    }}
                  />
                )}
                </Rnd>
              );
            } else {
              return ((
                    ww.widgetId === "whiteboard" ||
                    ww.widgetId === "taskboard" ||
                    ww.widgetId === "filestorage" ||
                    ww.widgetId === "videochat" ||
                    ww.widgetId === "polling" ||
                    ww.widgetId === "notes" ||
                    ww.widgetId === "deck"
                  ) ? (
                    <Grow in={true} {...{ timeout: index * 650 }}>
                      <div
                        onClick={() => props.onModuleSelected(ww.widgetId)}
                        style={{
                          width: 150,
                          height: 150,
                          position: "absolute",
                          left: ww.x,
                          top: ww.y,
                          transform: "translateY(+128px)",
                          backgroundColor: "transparent",
                          display: "flex",
                        }}
                      >
                        <Paper
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            backgroundColor: colors.field,
                            borderRadius: "50%",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <img
                            style={{
                              width: "calc(100% - 64px)",
                              height: "calc(100% - 64px)",
                              position: "absolute",
                              left: 32,
                              top: 32,
                            }}
                            alt={ww.widgetId}
                            src={
                              ww.widgetId === "whiteboard"
                                ? WhiteboardIcon
                                : ww.widgetId === "taskboard"
                                ? TaskboardIcon
                                : ww.widgetId === "filestorage"
                                ? FilesIcon
                                : ww.widgetId === "videochat"
                                ? VideochatIcon
                                : ww.widgetId === "vote"
                                ? VoteIcon
                                : ww.widgetId === "notes"
                                ? NotesIcon
                                : ww.widgetId === "deck"
                                ? PresentationIcon
                                : ""
                            }
                          />
                        </Paper>
                      </div>
                    </Grow>
                  ) : (
                  <BotContainer
                    step={index}
                    realIdPrefix={"widget_" + ww.id + "_element_"}
                    widgetWorkerId={ww.id}
                    isPreview={false}
                    onIdDictPrepared={(idD) => {
                      idDict[ww.id] = idD;
                    }}
                    onElClick={(elId) => {
                      if (clickEvents[ww.id][elId] !== undefined) {
                        clickEvents[ww.id][elId]();
                      }
                    }}
                    editMode={editMode}
                    widgetWidth={ww.width === null ? 150 : ww.width}
                    widgetHeight={ww.height === null ? 150 : ww.height}
                    widgetX={ww.x}
                    widgetY={ww.y}
                    gui={guis[ww.id]}
                  />
              ))
            }
          })}
          <div id="ghostpane" style={{ display: "none" }}></div>
        </div>
      </div>
      <SwipeableDrawer
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        anchor={"left"}
        style={{ direction: "ltr", position: "fixed", zIndex: 99999 }}
        PaperProps={{
          style: {
            background: colors.primaryMedium,
            backdropFilter: "blur(15px)",
          },
        }}
        keepMounted={true}
      >
        <div
          style={{
            width: 360,
            height: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 80,
              height: "100%",
              background: colors.primaryMedium,
            }}
          >
            {myBots.map((bot, index) => (
              <div
                style={{
                  backgroundColor:
                    mySelectedBot === index ? colors.field : "transparent",
                }}
              >
                <Avatar
                  onClick={() => setMySelectedBot(index)}
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: colors.field,
                    marginTop: 12,
                    marginLeft: 12,
                  }}
                  src={
                    bot.id === "modules"
                      ? ModulesIcon
                      : serverRoot +
                        `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
                  }
                />
                <Typography
                  style={{ width: "100%", marginTop: 8, color: colors.text }}
                >
                  {bot.title}
                </Typography>
              </div>
            ))}
          </div>
          <div style={{ width: 280, height: "100%", position: "relative" }}>
            {Object.values(myBots).length > 0
              ? myBots[mySelectedBot].widgets.map((wp) => (
                  <div
                    style={{ width: "100%" }}
                    onClick={() => {
                      if (
                        wp.id === "whiteboard" ||
                        wp.id === "taskboard" ||
                        wp.id === "filestorage" ||
                        wp.id === "videochat" ||
                        wp.id === "polling" ||
                        wp.id === "notes" ||
                        wp.id === "deck"
                      ) {
                        let requestOptions = {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            token: token,
                          },
                          body: JSON.stringify({
                            roomId: props.roomId,
                            type: wp.id,
                            x: 100,
                            y: 100
                          }),
                          redirect: "follow",
                        };
                        fetch(
                          serverRoot + "/bot/add_prebuilt_module",
                          requestOptions
                        )
                          .then((response) => response.json())
                          .then((result) => {
                            if (result.status === "success") {
                              updateDesktop();
                              alert("ماژول به میزکار افزوده شد.");
                            } else {
                              alert(result.message);
                            }
                          })
                          .catch((ex) => console.log(ex));
                      }
                      else {
                        let requestOptions = {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            token: token,
                          },
                          body: JSON.stringify({
                            botId: myBots[mySelectedBot].id,
                            roomId: props.roomId,
                            widgetId: wp.id,
                            x: 100,
                            y: 100,
                            width: 150,
                            height: 150,
                          }),
                          redirect: "follow",
                        };
                        fetch(
                          serverRoot + "/bot/create_widget_worker",
                          requestOptions
                        )
                          .then((response) => response.json())
                          .then((result) => {
                            if (result.status === "success") {
                              updateDesktop();
                              alert("ربات به میزکار افزوده شد.");
                            } else {
                              alert(result.message);
                            }
                          })
                          .catch((ex) => console.log(ex));
                      }
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
                        wp.id === "whiteboard"
                          ? WhiteboardIcon
                          : wp.id === "taskboard"
                          ? TaskboardIcon
                          : wp.id === "filestorage"
                          ? FilesIcon
                          : wp.id === "videochat"
                          ? VideochatIcon
                          : wp.id === "vote"
                          ? VoteIcon
                          : wp.id === "notes"
                          ? NotesIcon
                          : wp.id === "deck"
                          ? PresentationIcon
                          : serverRoot +
                            `/file/download_widget_thumbnail?token=${token}&widgetId=${wp.id}`
                      }
                    />
                    <Typography
                      style={{
                        marginTop: -16,
                        width: "100%",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.text,
                      }}
                    >
                      {wp.title}
                    </Typography>
                  </div>
                ))
              : null}
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
