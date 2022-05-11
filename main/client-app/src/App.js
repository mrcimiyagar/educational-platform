import {
  createTheme,
  Dialog,
  Drawer,
  makeStyles,
  StylesProvider,
  Tab,
  Tabs,
  ThemeProvider,
} from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { notifyUrlChanged } from "./components/SearchEngineFam";
import AudioPlayer from "./routes/pages/audioPlayer";
import Authentication from "./routes/pages/authentication";
import Chat, {
  addMessageToList,
  replaceMessageInTheList,
} from "./routes/pages/chat";
import CreateRoom from "./routes/pages/createRoom";
import DeckPage from "./routes/pages/deck";
import MessengerPage from "./routes/pages/messenger";
import NotePage from "./routes/pages/notes";
import PhotoViewer from "./routes/pages/photoViewer";
import PollPage from "./routes/pages/polls";
import Profile from "./routes/pages/profile";
import SearchEngine from "./routes/pages/searchEngine";
import SearchEngineResults from "./routes/pages/searchEngineResults";
import Store from "./routes/pages/store";
import StoreAds from "./routes/pages/storeAds";
import StoreBot from "./routes/pages/storeBot";
import VideoPlayer from "./routes/pages/videoPlayer";
import SettingsPage from "./routes/pages/settings";
import StartupSound from "./sounds/startup.mp3";
import {
  ColorBase,
  colors,
  homeRoomId,
  initTheme,
  me,
  setColors,
  setHomeRoomId,
  setHomeSpaceId,
  setMe,
  setToken,
  theme,
  token,
} from "./util/settings";
import {
  ConnectToIo,
  leaveRoom,
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
  validateToken,
} from "./util/Utils";
import { ifServerOnline, pathConfig, setDisplay2, setWallpaper } from ".";
import { addNewChat, setLastMessage, updateChat } from "./components/HomeMain";
import GenerateLink from "./routes/pages/generateLink";
import GenerateInvitation from "./routes/pages/invitationsList";
import ConfigGuestAccount from "./routes/pages/configGuestAccount";
import SpacesListPage from "./routes/pages/spacesList";
import Sidebar from "./containers/Sidebar";
import { updateMessageSeen } from "./components/AllChats";
import { updateMessageSeen2 } from "./components/BotChats";
import { updateMessageSeen3 } from "./components/ChannelChats";
import { updateMessageSeen4 } from "./components/GroupChats";
import CreateBotPage from "./routes/pages/createBot";
import CreateBotCategoryPage from "./routes/pages/createBotCategory";
import Workshop from "./routes/pages/workshop";
import StoreDialog from "./routes/pages/storeDialog";
import CreateComment from "./routes/pages/createComment";
import Rocket from "./routes/pages/rocket";
import "react-block-ui/style.css";
import CreateWidget from "./routes/pages/createWidget";
import BotInfoPage from "./routes/pages/botInfo";
import RoomsListPage from "./routes/pages/roomsList";
import Space from "./routes/pages/space";
import InnerNotif, { showInnerNotif } from "./components/InnerNotif";
import SwipeableViews from "react-swipeable-views";
const PouchDB = require("pouchdb").default;

export let openInnerNotif = (text, color) => {
  showInnerNotif({
    text: text,
    color: color,
    vertical: "bottom",
    horizontal: "right",
  });
};

export let boardFrame = undefined;
export let setBoardFrame = (bf) => {
  boardFrame = bf;
};

export let currentTab = undefined;
export let setCurrentTab = undefined;

export let tabs = undefined;
let setTabs = undefined;
export let addTab = (rId) => {
  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      roomId: rId,
    }),
    redirect: "follow",
  };
  let getRoomPromise = fetch(serverRoot + "/room/get_room", requestOptions);
  getRoomPromise
    .then((response) => response.json())
    .then(async (result) => {
      console.log(JSON.stringify(result));
      tabs.push({roomId: rId, title: result.room.title, chatType: result.room.chatType, participentId: result.room.participentId});
      setTabs(tabs);
      setCurrentTab(tabs.length - 1);
    });
};
export let removeTab = (rId) => {
  let tempTabs = [...tabs].filter((tab) => tab.roomId !== rId);
  setTabs(tempTabs);
  setCurrentTab(tabs.length - 1);
};

export let currentUserId = 0;
export let setCurrentUserId = (uId) => {
  currentUserId = uId;
  forceUpdate();
};

export let histPage = undefined;
let setHistPage = undefined;
export let routeTrigger = undefined;
let setRouteTrigger = undefined;

export let sizeMode;
let setSizeMode;
export let isDesktop = () => {
  return sizeMode === "desktop";
};
export let isTablet = () => {
  return sizeMode === "tablet";
};
export let isMobile = () => {
  return sizeMode === "mobile";
};
export let isInMessenger = () => {
  return false;
};
export let series = [];
export let paramsSeries = [];
let forceUpdate = undefined;

export let isRoomVisible = () => {
  return (
    (series.length === 1 && series[0] === "/app/room") ||
    (series.length > 1 && series[series.length - 1] === "/app/room")
  );
};

export let popPage;
export let gotoPage;
export let gotoPageWithDelay;

gotoPage = (p, params) => {
  forceUpdate();

  series.push(p);
  paramsSeries.push(params);
  setHistPage(p);
  setRouteTrigger(!routeTrigger);

  let query = "";
  for (let key in params) {
    query += key + "=" + params[key] + "&";
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1);
  }

  window.history.pushState("", "", p + (query.length > 0 ? "?" : "") + query);
  if (notifyUrlChanged !== undefined) notifyUrlChanged();
};

gotoPageWithDelay = (p, params) => {
  series.push(p);
  paramsSeries.push(params);
  setTimeout(() => {
    forceUpdate();
    setHistPage(p);
    setRouteTrigger(!routeTrigger);
    setTimeout(() => {
      forceUpdate();
    }, 250);
  }, 125);

  let query = "";
  for (let key in params) {
    query += key + "=" + params[key] + "&";
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1);
  }

  window.history.pushState("", "", p + (query.length > 0 ? "?" : "") + query);
  if (notifyUrlChanged !== undefined) notifyUrlChanged();
};

popPage = () => {
  if (series.length > 1) {
    series.pop();
    paramsSeries.pop();
    setHistPage(series[series.length - 1]);
    setRouteTrigger(!routeTrigger);

    let params = paramsSeries[paramsSeries.length - 1];
    let query = "";
    for (let key in params) {
      query += key + "=" + params[key] + "&";
    }
    if (query.length > 0) {
      query = query.substr(0, query.length - 1);
    }

    window.history.pushState(
      "",
      "",
      series[series.length - 1] + (query.length > 0 ? "?" : "") + query
    );

    setTimeout(() => {
      forceUpdate();
    }, 250);
    if (notifyUrlChanged !== undefined) notifyUrlChanged();
  }
};

let DesktopDetector = () => {
  [sizeMode, setSizeMode] = React.useState(
    window.innerWidth > 900
      ? "desktop"
      : window.innerWidth > 600
      ? "tablet"
      : "mobile"
  );
  window.onresize = () => {
    setSizeMode(
      window.innerWidth > 900
        ? "desktop"
        : window.innerWidth > 600
        ? "tablet"
        : "mobile"
    );
    forceUpdate();
  };
  return <div />;
};

export let user = undefined;
export let setUser = (ri) => {
  user = ri;
};

export let query = "";
export let setQuery = (ri) => {
  query = ri;
};

export let setDialogOpen = null;
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen;
};

export let animatePageChange = undefined;

PouchDB.plugin(require("pouchdb-upsert"));
PouchDB.plugin(require("pouchdb-quick-search"));
PouchDB.plugin(require("pouchdb-find").default);
export let db = new PouchDB("SkyDime");

export let cacheNotification = (notif) => {
  notif.type = "notification";
  db.putIfNotExists("notification_" + Date.now() + "_" + Math.random(), notif)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchNotifications = async () => {
  let data = await db.find({
    selector: { type: { $eq: "notification" } },
  });
  data = data.docs;
  return data;
};

export let cacheFile = (fileId, data) => {
  let box = { data, type: "file", id: fileId };
  db.putIfNotExists("file_" + fileId, box)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchFile = async (fileId) => {
  let data = await db.find({
    selector: { _id: { $eq: "file_" + fileId } },
  });
  data = data.docs;
  return data[0];
};

export let cacheMessage = (msg) => {
  msg.type = "message";
  db.putIfNotExists("message_" + msg.id, msg)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchMessagesOfRoom = async (roomId) => {
  let data = await db.find({
    selector: { roomId: { $eq: roomId }, type: { $eq: "message" } },
  });
  data = data.docs;
  data.forEach((message) => {
    message.time = Number(message.time);
  });
  function compare(a, b) {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  }
  data.sort(compare);
  return data;
};

export let cacheChat = (chat) => {
  chat.type = "chat";
  db.putIfNotExists("chat_" + chat.id, chat)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchChats = async () => {
  let data = await db.find({
    selector: { type: { $eq: "chat" } },
  });
  data = data.docs;
  data.forEach((chat) => {
    if (chat.lastMessage === undefined) {
      chat.lastMessage = { time: 0 };
    }
    chat.lastMessage.time = Number(chat.lastMessage.time);
  });
  function compare(a, b) {
    if (a.lastMessage.time < b.lastMessage.time) {
      return -1;
    }
    if (a.lastMessage.time > b.lastMessage.time) {
      return 1;
    }
    return 0;
  }
  data.sort(compare);
  return data;
};

export let cacheSpace = (space) => {
  space.type = "space";
  db.putIfNotExists("space_" + space.id, space)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchSpaces = async () => {
  let data = await db.find({
    selector: { type: { $eq: "space" } },
  });
  data = data.docs;
  return data;
};

export let cacheRoom = (room) => {
  room.type = "room";
  db.putIfNotExists("room_" + room.id, room)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchRooms = async () => {
  let data = await db.find({
    selector: { type: { $eq: "room" } },
  });
  data = data.docs;
  return data;
};

export let fetchRoom = async (roomId) => {
  let data = await db.find({
    selector: { type: { $eq: "room" }, id: { $eq: roomId } },
  });
  data = data.docs;
  if (data.length === 0) return {};
  else return data[0];
};

export let cacheMembership = (membership) => {
  membership.type = "membership";
  db.putIfNotExists("membership_" + membership.id, membership)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchMemberships = async () => {
  let data = await db.find({
    selector: { type: { $eq: "membership" } },
  });
  data = data.docs;
  return data;
};

export let fetchMembership = async (roomId) => {
  let data = await db.find({
    selector: { type: { $eq: "membership" }, roomId: { $eq: roomId } },
  });
  data = data.docs;
  if (data.length === 0) return {};
  else return data[0];
};

export let cacheMe = (me) => {
  me.type = "me";
  db.putIfNotExists("me", me)
    .then(function (res) {})
    .catch(function (err) {});
};

export let fetchMe = async () => {
  let data = await db.find({
    selector: { type: { $eq: "me" } },
  });
  data = data.docs;
  if (data.length === 0) return {};
  else return data[0];
};

const rand = () => {
  return Math.random().toString(36).substr(2);
};

const randId = () => {
  return rand() + rand();
};

export let inTheGame, setInTheGame;
export let uploadingFiles, setUploadingFiles;
export let markFileAsUploading = (roomId, file) => {
  if (uploadingFiles[roomId] === undefined) uploadingFiles[roomId] = {};
  let id = randId();
  file.message.id = id;
  uploadingFiles[roomId][id] = file;
  return id;
};
export let markFileAsUploaded = (roomId, id) => {
  if (uploadingFiles[roomId] === undefined) uploadingFiles[roomId] = {};
  delete uploadingFiles[roomId][id];
};

let MainAppContainer;
export let setBSO = (value) => {};
let bottomSheetContent = [];
export let setBottomSheetContent = (value) => {
  bottomSheetContent = value;
  forceUpdate();
};
let onBsClose = () => {};
export let setOnBsClosed = (callback) => {
  onBsClose = callback;
};

export let isOnline = true;
export let authenticationValid = undefined;
export let setAuthenticationValid = undefined;

export let setCurrentNav = () => {};
export let setCurrentModuleWorker = () => {};

let showGuestConfiguration = () => {};

MainAppContainer = (props) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

  window.onunload = () => leaveRoom(() => {});
  window.onbeforeunload = () => leaveRoom(() => {});

  console.warn = () => {};
  [inTheGame, setInTheGame] = React.useState(false);
  setToken(localStorage.getItem("token"));
  setHomeSpaceId(localStorage.getItem("homeSpaceId"));
  setHomeRoomId(localStorage.getItem("homeRoomId"));
  forceUpdate = useForceUpdate();
  let [hp, setHp] = React.useState();
  let [opacity, setOpacity] = React.useState(0);
  [routeTrigger, setRouteTrigger] = React.useState(false);
  [uploadingFiles, setUploadingFiles] = React.useState({});
  [authenticationValid, setAuthenticationValid] = React.useState(true);

  const useStyles = makeStyles({
    indicator: {
      backgroundColor: colors.oposText,
    },
    tab: {
      color: colors.oposText,
    },
  });

  let classes = useStyles();

  const [sn, setSN] = React.useState(Number(props.selected_nav));
  const [mwId, setMwId] = React.useState(Number(props.module_worker_id));

  setCurrentNav = setSN;
  setCurrentModuleWorker = setMwId;

  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [connectedIO, setConnectedIO] = React.useState(false);
  const [currentRequestingRoomAccessType, setCurrentRequestingRoomAccessType] =
    React.useState(undefined);
  const [guestParams, setGuestParams] = React.useState(undefined);
  const [showGuestGonfig, setShowGuestConfig] = React.useState(false);
  [currentTab, setCurrentTab] = React.useState(0);
  [tabs, setTabs] = React.useState([{roomId: props.room_id !== undefined ? props.room_id : homeRoomId, title: 'خانه'}]);

  showGuestConfiguration = (p) => {
    setGuestParams(p);
    setShowGuestConfig(true);
  };

  setHistPage = setHp;
  histPage = hp;
  animatePageChange = () => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
    }, 250);
  };
  useEffect(() => {
    setDisplay2("none");
  }, []);
  useEffect(() => {
    tabs[0] = {roomId: props.room_id !== undefined ? props.room_id : homeRoomId, title: 'خانه'};
    setTabs(tabs);
    ifServerOnline(
      () => {
        isOnline = true;
        ConnectToIo(localStorage.getItem("token"), () => {
          registerEvent("you-moved", ({ roomId }) => {
            window.location.href =
              pathConfig.mainFrontend +
              `/app/room?room_id=${roomId}&tab_index=0`;
          });
          unregisterEvent("chat-list-updated");
          registerEvent("chat-list-updated", ({ room }) => {
            let requestOptions3 = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                roomId: room.id,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/chat/get_chat", requestOptions3)
              .then((response) => response.json())
              .then((result) => {
                setLastMessage(result.room.lastMessage, result.room);
              });
          });
          unregisterEvent("message-added");
          registerEvent("message-added", ({ msgCopy }) => {
            if (me.id !== msgCopy.authorId) {
              addMessageToList(msgCopy);
              setLastMessage(msgCopy);
              updateMessageSeen(msgCopy);
              updateMessageSeen2(msgCopy);
              updateMessageSeen3(msgCopy);
              updateMessageSeen4(msgCopy);
              let requestOptions3 = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  roomId: msgCopy.roomId,
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/chat/get_chat", requestOptions3)
                .then((response) => response.json())
                .then((result) => {
                  updateChat(result.room);
                });
            }
          });
          unregisterEvent("chat-created");
          registerEvent("chat-created", ({ room }) => {
            addNewChat(room);
          });
          unregisterEvent("message-seen");
          registerEvent("message-seen", ({ messages }) => {
            messages.forEach((msg) => replaceMessageInTheList(msg));
            messages.forEach((msg) => updateMessageSeen(msg));
            messages.forEach((msg) => updateMessageSeen2(msg));
            messages.forEach((msg) => updateMessageSeen3(msg));
            messages.forEach((msg) => updateMessageSeen4(msg));
          });
          setConnectedIO(true);
        });
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          redirect: "follow",
        };
        fetch(serverRoot + "/auth/get_me", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (result.user !== undefined && result.user !== null) {
              setMe(result.user);
              cacheMe(result.user);
            } else {
              fetchMe().then((m) => {
                setMe(m);
              });
            }
          })
          .catch((error) => console.log("error", error));

        let query = window.location.search;
        let params = {};
        if (query !== undefined && query !== null) {
          if (query.length > 1) {
            query = query.substr(1);
          }
          let querySep = query.split("&");
          querySep.forEach((part) => {
            let keyValue = part.split("=");
            params[keyValue[0]] = keyValue[1];
          });
        }

        validateToken(token, (result) => {
          if (result) {
            animatePageChange();
            if (
              window.location.pathname === "/" ||
              window.location.pathname === ""
            ) {
              gotoPage("/app/home", { tab_index: 0 });
            } else {
              gotoPage(window.location.pathname, params);
            }
          } else {
            localStorage.removeItem("token");
            animatePageChange();
            if (window.location.pathname === "/app/use_invitation") {
              showGuestConfiguration(params);
            } else if (window.location.pathname === "/app/room") {
              gotoPage("/app/room", params);
            } else {
              let requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  roomId: tabs[0],
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/room/get_room", requestOptions)
                .then((res) => res.json())
                .then((result) => {
                  if (result.room === undefined) {
                    setAuthenticationValid(false);
                    return;
                  }
                  setCurrentRequestingRoomAccessType(result.room.accessType);
                  if (result.room.accessType === "public") {
                    setAuthenticationValid(true);
                  } else {
                    setAuthenticationValid(false);
                  }
                })
                .catch((ex) => console.error(ex));
            }
          }
        });

        var audio = new Audio(StartupSound);
        audio.play();
      },
      () => {
        isOnline = false;
        fetchMe().then((m) => {
          setMe(m);
          let query = window.location.search;
          let params = {};
          if (query !== undefined && query !== null) {
            if (query.length > 1) {
              query = query.substr(1);
            }
            let querySep = query.split("&");
            querySep.forEach((part) => {
              let keyValue = part.split("=");
              params[keyValue[0]] = keyValue[1];
            });
          }
          animatePageChange();
        });
      }
    );
  }, []);

  setBSO = (value) => {
    setBottomSheetOpen(value);
  };

  if (showGuestConfiguration && guestParams !== undefined) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <ConfigGuestAccount {...guestParams} />
      </div>
    );
  }

  if (currentRequestingRoomAccessType !== "public" && !connectedIO) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <DesktopDetector />
        {authenticationValid ? null : <Authentication />}
      </div>
    );
  }

  return (
    <div
      style={{
        width: window.innerWidth + "px",
        minHeight: "100vh",
        height: "100vh",
        maxHeight: "100vh",
        direction: "rtl",
      }}
    >
      <DesktopDetector />
      <Sidebar />
      <Tabs
        variant={"scrollable"}
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        classes={{
          indicator: classes.indicator,
        }}
        style={{
          direction: "rtl",
          backgroundColor: colors.primaryMedium,
          backdropFilter: "blur(10px)",
          height: 120
        }}
      >
        {tabs.map((tab, tabIndex) => (
          <Tab
            classes={{ root: classes.tab }}
            style={{ color: colors.oposText, fontWeight: "bold" }}
            label={tab.title}
            icon={
              <img
                style={{ width: 72, height: 72, borderRadius: 16 }}
                src={
                  tab.chatType === 'p2p' ?
                  (serverRoot +
                    `/file/download_user_avatar?userId=${tab.participentId}`)
                  : 
                  (serverRoot +
                  `/file/download_room_avatar?token=${token}&roomId=${tab.roomId}`)
                }
              />
            }
            value={tabIndex}
          />
        ))}
      </Tabs>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {tabs.map((tab, tabIndex) => (
          <div
            style={{
              width: "100%",
              height: "calc(100% - 56px)",
              position: "fixed",
              left: 0,
              top: 120,
              display: tabIndex === currentTab ? "block" : "none",
            }}
          >
            <Space
              selected_nav={sn}
              module_worker_id={mwId}
              room_id={tab.roomId}
              show={tabIndex === currentTab}
              index={tabIndex}
            />
          </div>
        ))}
      </div>
      <InnerNotif />
      <Drawer
        PaperProps={{
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }}
        anchor="bottom"
        style={{ position: "fixed", zIndex: 99999 }}
        open={bottomSheetOpen}
        onClose={() => {
          onBsClose();
          setBottomSheetOpen(false);
        }}
      >
        <div style={{ margin: 32 }}>{bottomSheetContent}</div>
      </Drawer>
    </div>
  );
};

export default MainAppContainer;
