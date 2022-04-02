import {
  createTheme,
  Dialog,
  Drawer,
  StylesProvider,
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
import RoomPage from "./routes/pages/room";
import RoomsTree from "./routes/pages/roomsTree";
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
import {
  addMessageToList2,
  replaceMessageInTheList2,
} from "./components/ChatEmbeddedInMessenger";
import {
  addMessageToList3,
  replaceMessageInTheList3,
} from "./components/ChatEmbedded";
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
const PouchDB = require("pouchdb").default;

export let boardFrame = undefined;
export let setBoardFrame = (bf) => {
  boardFrame = bf;
};

export let currentRoomId = undefined;
let setCRId = undefined;
export let setCurrentRoomId = (id) => {setInTheGame(false); setTimeout(() => setCRId(id), 250);};

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
export let isInRoom = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  let entries = Object.fromEntries(urlSearchParams.entries());
  let counter = series.length - 1;
  while (counter >= 0) {
    if (series[counter] in pages) {
      if (
        series[counter] === "/app/room" ||
        (series[counter] === "/app/home" && entries.tab_index === "4")
      ) {
        return true;
      } else {
        return false;
      }
    }
    counter--;
  }
  return false;
};
export let isInMessenger = () => {
  let counter = series.length - 1;
  while (counter >= 0) {
    if (series[counter] in pages) {
      if (series[counter] === "/app/home") {
        return true;
      } else {
        return false;
      }
    }
    counter--;
  }
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

export let roomId = 0;
export let setRoomId = (ri) => {
  if (ri === undefined || ri === null) return;
  roomId = ri;
};

export let user = undefined;
export let setUser = (ri) => {
  user = ri;
};

export let query = "";
export let setQuery = (ri) => {
  query = ri;
};

let dialogs = {
  "/app/chat": Chat,
  "/app/storebot": StoreBot,
  "/app/storeads": StoreAds,
  "/app/photoviewer": PhotoViewer,
  "/app/poll": PollPage,
  "/app/notes": NotePage,
  "/app/deck": DeckPage,
  "/app/searchengineresults": SearchEngineResults,
  "/app/userprofile": Profile,
  "/app/createroom": CreateRoom,
  "/app/roomstree": RoomsTree,
  "/app/audioplayer": AudioPlayer,
  "/app/settings": SettingsPage,
  "/app/videoplayer": VideoPlayer,
  "/app/generate_invite_link": GenerateLink,
  "/app/generate_invitation": GenerateInvitation,
  "/app/spaces_list": SpacesListPage,
  "/app/createbot": CreateBotPage,
  "/app/createbotcategory": CreateBotCategoryPage,
  "/app/storedialog": StoreDialog,
  "/app/createcomment": CreateComment,
  "/app/createwidget": CreateWidget,
  "/app/botinfo": BotInfoPage,
  "/app/roomslist": RoomsListPage,
  "/app/rocket": Rocket,
};
let pages = {
  "/app/store": Store,
  "/app/home": MessengerPage,
  "/app/room": RoomPage,
  "/app/searchengine": SearchEngine,
  "/app/auth": Authentication,
  "/app/use_invitation": ConfigGuestAccount,
  "/app/workshop": Workshop,
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
let onBsClose = () => {}
export let setOnBsClosed = (callback) => {onBsClose = callback;};

export let isOnline = true;
export let authenticationValid = undefined;
export let setAuthenticationValid = undefined;

MainAppContainer = (props) => {
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
  [currentRoomId, setCRId] = React.useState(homeRoomId);

  const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
  const [connectedIO, setConnectedIO] = React.useState(false);

  setHistPage = setHp;
  histPage = hp;
  animatePageChange = () => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(1);
    }, 250);
  };
  useEffect(() => {
    if (histPage === "/app/searchengine") {
      setWallpaper({ type: "color", color: colors.accentDark });
    }
  }, [histPage]);
  window.onpopstate = function (e) {
    e.preventDefault();
    if (setDialogOpen !== null) {
      setDialogOpen(false);
    }
    setTimeout(popPage, 250);
  };
  let P = undefined;
  let D = undefined;
  let pQuery = undefined;
  let dQuery = undefined;
  if (series[series.length - 1] in pages) {
    P = pages[series[series.length - 1]];
    pQuery = paramsSeries[paramsSeries.length - 1];
  } else {
    if (series[series.length - 1] in dialogs) {
      D = dialogs[series[series.length - 1]];
      dQuery = paramsSeries[paramsSeries.length - 1];
      let counter = series.length - 2;
      while (counter >= 0) {
        if (series[counter] in pages) {
          P = pages[series[counter]];
          pQuery = paramsSeries[counter];
          break;
        }
        counter--;
      }
    }
  }
  useEffect(() => {
    setDisplay2("none");
  }, []);
  useEffect(() => {
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
              addMessageToList2(msgCopy);
              addMessageToList3(msgCopy);
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
            messages.forEach((msg) => replaceMessageInTheList2(msg));
            messages.forEach((msg) => replaceMessageInTheList3(msg));
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
              gotoPage("/app/use_invitation", params);
            } else if (window.location.pathname === "/app/room") {
              gotoPage("/app/room", params);
            } else {
              setAuthenticationValid(false);
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
          if (
            window.location.pathname === "/" ||
            window.location.pathname === ""
          ) {
            gotoPage("/app/home", { tab_index: 0 });
          } else {
            gotoPage(window.location.pathname, params);
          }
        });
      }
    );
  }, []);

  setBSO = (value) => {
    setBottomSheetOpen(value);
  };

  if (!connectedIO) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <ColorBase />
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
      <ColorBase />
      <DesktopDetector />
      <Sidebar />
      <Space room_id={currentRoomId} key={currentRoomId} />
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
        onClose={() => {onBsClose(); setBottomSheetOpen(false);}}
      >
        <div style={{ margin: 32 }}>{bottomSheetContent}</div>
      </Drawer>
    </div>
  );
};

export default MainAppContainer;
