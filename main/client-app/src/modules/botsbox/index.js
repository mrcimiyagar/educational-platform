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
import WhiteboardIcon from '../../images/whiteboard.png';
import TaskboardIcon from '../../images/taskboard.png';
import FilesIcon from '../../images/files.png';

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
    fetch(serverRoot + "/bot/get_widget_workers", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          widgets = result.widgetWorkers;
          widgets.push({
            id: "whiteboard",
            widgetId: "whiteboard",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "taskboard",
            widgetId: "taskboard",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32 + 150 + 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "filestorage",
            widgetId: "filestorage",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32 + 150 + 32 + 150 + 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "videochat",
            widgetId: "videochat",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32 + 150 + 32 + 150 + 32 + 150 + 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "polling",
            widgetId: "polling",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32 + 150 + 32 + 150 + 32 + 150 + 32 + 150 + 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "notes",
            widgetId: "notes",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y: 32 + 150 + 32 + 150 + 32 + 150 + 32 + 150 + 32 + 150 + 32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          widgets.push({
            id: "deck",
            widgetId: "deck",
            roomId: props.roomId,
            bossId: "admin",
            x: 32,
            y:
              32 +
              150 +
              32 +
              150 +
              32 +
              150 +
              32 +
              150 +
              32 +
              150 +
              32 +
              150 +
              32,
            width: "calc(100% - 64px)",
            height: "150px",
          });
          forceUpdate();
          result.widgetWorkers.forEach((ww) => {
            if (
              ww.id !== "whiteboard" &&
              ww.id !== "taskboard" &&
              ww.id !== "filestorage" &&
              ww.id !== "videochat" &&
              ww.id !== "polling" &&
              ww.id !== "notes" &&
              ww.id !== "deck"
            ) {
              requestInitGui(ww.id, false);
            }
          });
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
                <Grow in={true} {...{ timeout: 650 }}>
                  <div
                    onClick={() => props.onModuleSelected("whiteboard")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 16,
                      top: 16,
                      transform: "translateY(+128px)",
                      backgroundColor: "transparent",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <img style={{width: 'calc(100% - 8px)', height: 'calc(100% - 8px)', position: 'absolute', left: 4, top: 0}} alt={'whiteboard'} src={WhiteboardIcon} />
                    </div>
                  </div>
                </Grow>
                <Grow in={true} {...{ timeout: 2 * 650 }}>
                  <div
                    onClick={() => props.onModuleSelected("taskboard")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 'calc(50% + 8px)',
                      top: 16,
                      transform: "translateY(+128px)",
                      backgroundColor: "transparent",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <img style={{width: 'calc(100% - 8px)', height: 'calc(100% - 8px)', position: 'absolute', left: 4, top: 0}} alt={'whiteboard'} src={TaskboardIcon} />
                    </div>
                  </div>
                </Grow>
                <Grow in={true} {...{ timeout: 3 * 650 }}>
                  <div
                    onClick={() => props.onModuleSelected("filestorage")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 16,
                      top: 16 + 150 + 16,
                      transform: "translateY(+128px)",
                      display: "flex",
                    }}
                  >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <img style={{width: 'calc(100% - 24px)', height: 'calc(100% - 8px)', position: 'absolute', left: 12, top: 0}} alt={'whiteboard'} src={FilesIcon} />
                  </div>
                  </div>
                </Grow>
                <Grow in={true} {...{ timeout: 4 * 650 }}>
                  <Paper
                    onClick={() => props.onModuleSelected("videochat")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 'calc(50% + 8px)',
                      top: 16 + 150 + 16,
                      transform: "translateY(+128px)",
                      borderRadius: 24,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "transparent",
                      backgroundImage:
                        "linear-gradient(315deg, rgba(133, 255, 189, 0.5) 0%, rgba(255, 251, 125, 0.5) 100%)",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Typography
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 27,
                          fontWeight: "bold",
                          transform: "translateY(-50%)",
                          color: "#fff",
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        ویدئو چت
                      </Typography>
                    </div>
                  </Paper>
                </Grow>
                <Grow in={true} {...{ timeout: 5 * 650 }}>
                  <Paper
                    onClick={() => props.onModuleSelected("polling")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 16,
                      top: 16 + 150 + 16 + 150 + 16,
                      transform: "translateY(+128px)",
                      borderRadius: 24,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "transparent",
                      backgroundImage:
                        "linear-gradient(43deg, rgba(65, 88, 208, 0.5) 0%, rgba(200, 80, 192, 0.5) 50%, rgba(255, 204, 112, 0.5) 100%)",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Typography
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 27,
                          fontWeight: "bold",
                          transform: "translateY(-50%)",
                          color: "#fff",
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        رای گیری
                      </Typography>
                    </div>
                  </Paper>
                </Grow>
                <Grow in={true} {...{ timeout: 6 * 650 }}>
                  <Paper
                    onClick={() => props.onModuleSelected("notes")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 'calc(50% + 8px)',
                      top: 16 + 150 + 16 + 150 + 16,
                      transform: "translateY(+128px)",
                      borderRadius: 24,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "transparent",
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(98, 132, 255, 0.5) 50%, rgba(255, 0, 0, 0.5) 100%)",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Typography
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 27,
                          fontWeight: "bold",
                          transform: "translateY(-50%)",
                          color: "#fff",
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        یادداشت ها
                      </Typography>
                    </div>
                  </Paper>
                </Grow>
                <Grow in={true} {...{ timeout: 7 * 650 }}>
                  <Paper
                    onClick={() => props.onModuleSelected("deck")}
                    style={{
                      width: 'calc(50% - 24px)',
                      height: 150,
                      position: "absolute",
                      left: 16,
                      top: 16 + 150 + 16 + 150 + 16 + 150 + 16,
                      transform: "translateY(+128px)",
                      borderRadius: 24,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "transparent",
                      backgroundImage:
                        "linear-gradient(315deg, rgba(133, 255, 189, 0.5) 0%, rgba(255, 251, 125, 0.5) 100%)",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Typography
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 27,
                          fontWeight: "bold",
                          transform: "translateY(-50%)",
                          color: "#fff",
                          width: "100%",
                          textAlign: "right",
                        }}
                      >
                        سالن ارائه
                      </Typography>
                    </div>
                  </Paper>
                </Grow>
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
                >
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
                  <Paper
                    style={{
                      width: 32,
                      height: 32,
                      position: "fixed",
                      right: -16,
                      bottom: -16,
                    }}
                  />
                </Rnd>
              );
            } else {
              return (
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
              );
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
              <div style={{backgroundColor: mySelectedBot === index ? colors.field : 'transparent'}}>
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
                    serverRoot +
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
