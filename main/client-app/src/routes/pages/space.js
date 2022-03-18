import { Dialog, Paper } from "@mui/material";
import SpaceSearchbar from "../../components/SpaceSearchbar";
import SpaceBottombar from "../../components/SpaceBottombar";
import Authentication from "./authentication";
import { authenticationValid } from "../../App";
import {
  AppBar,
  Avatar,
  createTheme,
  SwipeableDrawer,
  Fab,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { Attachment, ChatIcon, Search, Visibility } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Menu from "@material-ui/icons/Menu";
import NotesIcon from "@material-ui/icons/Notes";
import PhotoIcon from "@material-ui/icons/Photo";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PollIcon from "@material-ui/icons/Poll";
import Settings from "@material-ui/icons/Settings";
import ViewCarouselIcon from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { useFilePicker } from "use-file-picker";
import { pathConfig, setWallpaper } from "../..";
import {
  gotoPage,
  isDesktop,
  isInRoom,
  isMobile,
  isOnline,
  isTablet,
  setInTheGame,
  setRoomId,
} from "../../App";
import ChatEmbedded from "../../components/ChatEmbedded";
import FilesGrid from "../../components/FilesGrid/FilesGrid";
import RoomBottombar from "../../components/RoomBottombar";
import Jumper from "../../components/SearchEngineFam";
import HomeIcon from "../../images/home.png";
import PeopleIcon from "../../images/people.png";
import BotIcon from "../../images/robot.png";
import RoomIcon from "../../images/room.png";
import { BoardBox } from "../../modules/boardbox/boardbox";
import BotsBox, { openToolbox } from "../../modules/botsbox";
import { ConfBox } from "../../modules/confbox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { UsersBox } from "../../modules/usersbox/usersbox";
import store, { changeConferenceMode } from "../../redux/main";
import {
  colors,
  homeRoomId,
  setMe,
  setToken,
  token,
} from "../../util/settings";
import {
  ConnectToIo,
  leaveRoom,
  registerEvent,
  serverRoot,
  setRoom,
  socket,
  switchRoom,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import DesktopWallpaper2 from "../../images/desktop-wallpaper.jpg";
import { MachinesBox } from "../../modules/machinesbox/machinesbox";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Chat from "./chat";
import MessengerPage from "./messenger";
import Store from "./store";
import MainSettings from "./mainsettings";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedroomBabyOutlinedIcon from "@mui/icons-material/BedroomBabyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

let accessChangeCallback = undefined;
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback;
};
let accessChangeCallbackNavbar = undefined;
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback;
};
export let reloadConf = undefined;

function isObjectEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: "#eee",
    "&$selected": {
      color: "#fff",
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
});

export let membership = undefined;
export let setMembership = () => {};
let pickingFile = false;

let attachWebcamOnMessenger = undefined;
let roomId = undefined;

let oldSt = 0;

export default function Space(props) {
  props = {};
  const [searchBarFixed, setSearchBarFixed] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState(undefined);
  const attachScrollCallback = () => {
    const searchScrollView = document.getElementById("botsContainerOuter");
    if (searchScrollView === null) {
      setTimeout(() => attachScrollCallback(), 500);
    } else {
      searchScrollView.addEventListener(
        "scroll",
        function () {
          var st = searchScrollView.scrollTop;
          if (st > oldSt) {
            setSearchBarFixed(true);
          } else {
            setSearchBarFixed(false);
          }
          oldSt = st;
        },
        false
      );
    }
  };
  useEffect(() => attachScrollCallback(), []);

  roomId = homeRoomId;
  props.room_id = homeRoomId;

  const useStyles = makeStyles({
    root: {
      width: "100%",
      position: "fixed",
      bottom: 0,
      backgroundColor: colors.primaryMedium,
    },
    indicator: {
      backgroundColor: "#fff",
    },
    tab: {
      color: "#fff",
      minWidth: isDesktop() || isTablet() ? 100 : undefined,
      maxWidth: isDesktop() || isTablet() ? 100 : undefined,
      width: isDesktop() || isTablet() ? 100 : undefined,
    },
  });

  document.documentElement.style.overflow = "auto";

  let forceUpdate = useForceUpdate();

  const classes = useStyles();
  const classesAction = useStylesAction();

  const [jumperOpen, setJumperOpen] = React.useState(true);
  [membership, setMembership] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [currentRoomNav, setCurrentRoomNav] = React.useState(
    Number(props.tab_index)
  );
  const [fileMode, setFileMode] = React.useState(0);
  const [menuMode, setMenuMode] = React.useState(0);
  const [opacity, setOpacity] = React.useState(1);
  let [webcamOn, setWebcamOn] = React.useState(false);
  let [webcamOnSecond, setWebcamOnSecond] = React.useState(false);
  let [messengerView, setMessengerView] = React.useState(true);

  let enterRoom = (callback) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
      signal: controller.signal,
    };

    let enterRoomPromise = fetch(
      serverRoot + "/room/enter_room",
      requestOptions2
    );

    enterRoomPromise
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.membership !== undefined) {
          clearTimeout(timeoutId);
          setMembership(result.membership);
          forceUpdate();

          if (callback !== undefined) callback();
        }
      })
      .catch((error) => {
        console.log("error", error);
        enterRoom(callback);
      });
  };

  let loadData = (callback) => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    let getRoomPromise = fetch(serverRoot + "/room/get_room", requestOptions);
    getRoomPromise
      .then((response) => response.json())
      .then(async (result) => {
        console.log(JSON.stringify(result));
        setRoom(result.room);
        setToken(localStorage.getItem("token"));
        unregisterEvent("view-updated");
        registerEvent("view-updated", (v) => {});
        window.scrollTo(0, 0);
        store.dispatch(changeConferenceMode(true));
        if (
          (token === null || token === undefined || token === "") &&
          result.room.accessType === "public"
        ) {
          let requestOptions2 = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: props.room_id,
            }),
            redirect: "follow",
          };
          let r = await fetch(serverRoot + "/room/anon", requestOptions2);
          r = await r.json();
          if (r.status === "success") {
            let auth = r.auth;
            localStorage.setItem("token", auth.token);
            window.location.reload();
          }
        } else {
          enterRoom(callback);
        }
      })
      .catch((error) => console.log("error", error));
  };

  //socket.io.removeAllListeners("reconnect");
  //socket.io.on("reconnect", () => {
  //loadData();
  //});

  let loadFiles = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: roomId,
        fileMode:
          fileMode === 0
            ? "photo"
            : fileMode === 1
            ? "audio"
            : fileMode === "video"
            ? 2
            : 3,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/file/get_files", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        result.files.forEach((fi) => {
          fi.progress = 100;
        });
        setFiles(result.files);
      })
      .catch((error) => console.log("error", error));
  };

  let syncWallpaper = () => {
    /*let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/room/get_room_wallpaper", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.wallpaper === null) {
          setWallpaper({
            type: "photo",
            photo: DesktopWallpaper2,
            fitType: "cover",
          });
        }
        let wall = JSON.parse(result.wallpaper);
        if (wall === undefined || wall === null) return;
        if (wall.type === "photo") {
          setWallpaper({
            type: "photo",
            photo:
              serverRoot +
              `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
          });
        } else if (wall.type === "video") {
          setWallpaper({
            type: "video",
            video:
              serverRoot +
              `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
          });
        } else if (wall.type === "color") {
          setWallpaper(wall);
        }
      })
      .catch((error) => console.log("error", error));*/
  };

  useEffect(() => {
    roomId = props.room_id;
    setRoomId(roomId);
    setInTheGame(true);
    setTimeout(() => {
      loadData(() => {
        loadFiles();
        setLoaded(true);
        syncWallpaper();
      });
    }, 0);
  }, [props.room_id]);

  const [files, setFiles] = React.useState([]);

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
  });

  useEffect(() => {
    if (!loading && pickingFile) {
      pickingFile = false;
      let dataUrl = filesContent[0].content;
      if (dataUrl === undefined) return;
      fetch(dataUrl)
        .then((d) => d.blob())
        .then((file) => {
          let data = new FormData();
          data.append("file", file);
          let request = new XMLHttpRequest();

          let ext = filesContent[0].name.includes(".")
            ? filesContent[0].name.substr(filesContent[0].name.indexOf(".") + 1)
            : "";
          let fileType =
            ext === "png" ||
            ext === "jpg" ||
            ext === "jpeg" ||
            ext === "gif" ||
            ext === "webp" ||
            ext === "svg"
              ? "photo"
              : ext === "wav" ||
                ext === "mpeg" ||
                ext === "aac" ||
                ext === "mp3"
              ? "audio"
              : ext === "webm" ||
                ext === "mkv" ||
                ext === "flv" ||
                ext === "mp4" ||
                ext === "3gp"
              ? "video"
              : "document";

          let f = {
            progress: 0,
            name: file.name,
            size: file.size,
            local: true,
            src: dataUrl,
            fileType: fileType,
          };

          request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
              loadFiles();
            }
          };

          request.open(
            "POST",
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${roomId}&extension=${ext}`
          );

          files.push(f);
          setFiles(files);
          forceUpdate();
          request.upload.addEventListener("progress", function (e) {
            let percent_completed = (e.loaded * 100) / e.total;
            f.progress = percent_completed;
            if (percent_completed === 100) {
              f.local = false;
            }
            forceUpdate();
          });
          if (FileReader && files && files.length) {
            let fr = new FileReader();
            fr.readAsDataURL(file);
          }
          request.send(data);
        });
    }
  }, [loading]);

  let openDeck = () => {
    gotoPage("/app/deck", { room_id: props.room_id });
  };
  let openNotes = () => {
    gotoPage("/app/notes", { room_id: props.room_id });
  };
  let openPolls = () => {
    gotoPage("/app/poll", { room_id: props.room_id });
  };
  const handleChange = (event, newValue) => {
    setFileMode(newValue);
  };
  const handleChangeIndex = (index) => {
    setFileMode(index);
  };

  useEffect(() => {
    if (attachWebcamOnMessenger !== undefined) {
      window.removeEventListener("message", attachWebcamOnMessenger);
    }
    attachWebcamOnMessenger = (e) => {
      if (e.data.sender === "conf") {
        if (e.data.action === "attachWebcamOnMessenger") {
          setWebcamOn(true);
        } else if (e.data.action === "detachWebcamOnMessenger") {
          setWebcamOn(false);
        } else if (e.data.action === "notifyWebcamTurnedOn") {
          setWebcamOnSecond(true);
        } else if (e.data.action === "notifyWebcamTurnedOff") {
          setWebcamOnSecond(false);
        }
      }
    };
    window.addEventListener("message", attachWebcamOnMessenger);

    registerEvent("room-updated", (room) => {
      syncWallpaper();
    });

    let doRoomDoctor = () => {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          roomId: props.room_id,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/room/am_i_in_room", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          if (result.result === false) {
            let requestOptions2 = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                roomId: props.room_id,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/room/enter_room", requestOptions2)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.membership !== undefined) {
                  setMembership(result.membership);
                  forceUpdate();
                }
              })
              .catch((error) => console.log("error", error));
          }
        })
        .catch((error) => console.log("error", error));
    };

    let roomPersistanceDoctor = setInterval(() => {
      doRoomDoctor();
    }, 3500);

    console.log("planting destructor...");
    return () => {
      clearInterval(roomPersistanceDoctor);
      leaveRoom(() => {});
    };
  }, []);

  if (!loaded || isObjectEmpty(membership)) {
    return <div />;
  }

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
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      <div
        id="searchScrollView"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          overflow: "auto",
        }}
      >
        <div style={{ width: "100%", height: 72 + 16 }} />
        <BotsBox
          openMenu={() => setMenuOpen(true)}
          openDeck={openDeck}
          openNotes={openNotes}
          openPolls={openPolls}
          setMenuOpen={setMenuOpen}
          membership={membership}
          roomId={props.room_id}
          style={{ display: "block" }}
        />
        <div style={{ width: "100%", height: 72 + 16 }} />
      </div>

      <AppBar
        position={"fixed"}
        style={{
          background: colors.primaryMedium,
          borderRadius: 0,
          width: "100%",
          height: searchBarFixed ? 56 : 80 + 40,
          backdropFilter: "blur(20px)",
          position: "fixed",
          transition: "height .25s",
        }}
      >
        <SpaceSearchbar
          fixed={searchBarFixed}
          onMenuClicked={() => setMenuOpen(true)}
        />

        <Tabs
          variant={"scrollable"}
          value={0}
          onChange={props.handleChange}
          classes={{
            indicator: classes.indicator,
          }}
          style={{
            marginTop: 8,
            direction: "ltr",
            opacity: searchBarFixed ? 0 : 1,
            transition: "opacity .25s",
          }}
        >
          <Tab
            classes={{ root: classes.tab }}
            label="میز اسناد x"
            style={{ marginLeft: 32, color: colors.text }}
          />
          <Tab classes={{ root: classes.tab }} style={{color: colors.text}} label="میز کنفرانس فردا" />
          <Tab classes={{ root: classes.tab }} style={{color: colors.text}} label="میز تست نرم افزار" />
          <Tab classes={{ root: classes.tab }} style={{color: colors.text}} label="میز بازی شطرنج 2" />
          <Tab classes={{ root: classes.tab }} style={{color: colors.text}} label="میز کنفرانس هفته ی بعد" />
        </Tabs>
      </AppBar>

      <SpaceBottombar
        fixed={searchBarFixed}
        setCurrentRoomNav={(index) => {
          if (index === 3) {
            openToolbox();
          } else {
            setSelectedNav(index);
          }
        }}
      />

      <SwipeableDrawer
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        anchor={"right"}
        PaperProps={{
          style: {
            background: colors.primaryLight,
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
              background: colors.primaryLight
            }}
          >
            <Avatar
              onClick={() => setMenuMode(0)}
              style={{
                width: 64,
                height: 64,
                background: colors.field,
                position: "absolute",
                right: 8,
                top: 16,
                padding: 8,
              }}
            >
              <PeopleAltOutlinedIcon style={{ fill: colors.text }} />
            </Avatar>
            <Avatar
              onClick={() => setMenuMode(1)}
              style={{
                width: 64,
                height: 64,
                background: colors.field,
                position: "absolute",
                right: 8,
                top: 16 + 64 + 16,
                padding: 8,
              }}
            >
              <SmartToyOutlinedIcon style={{ fill: colors.text }} />
            </Avatar>
            <Avatar
              onClick={() => {
                setMenuOpen(false);
                window.location.href = "/app/room?room_id=1";
              }}
              style={{
                width: 64,
                height: 64,
                background: colors.field,
                position: "absolute",
                right: 8,
                bottom: 16 + 64 + 16 + 64 + 16,
                padding: 8,
              }}
            >
              <HomeOutlinedIcon style={{ fill: colors.text }} />
            </Avatar>
            <Avatar
              onClick={() => {
                setMenuOpen(false);
                gotoPage("/app/roomstree", { room_id: props.room_id });
              }}
              style={{
                width: 64,
                height: 64,
                background: colors.field,
                position: "absolute",
                right: 8,
                bottom: 16 + 64 + 16,
                padding: 8,
              }}
            >
              <BedroomBabyOutlinedIcon style={{ fill: colors.text }} />
            </Avatar>
            <div
              onClick={() => {
                setMenuOpen(false);
                gotoPage("/app/settings", { room_id: props.room_id });
              }}
              style={{
                borderRadius: 32,
                width: 64,
                height: 64,
                background: colors.field,
                position: "absolute",
                right: 8,
                bottom: 16,
                padding: 8,
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <SettingsOutlinedIcon
                  style={{
                    fill: colors.text,
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ width: 280, height: "100%" }}>
            {menuMode === 0 ? (
              <UsersBox membership={membership} roomId={props.room_id} />
            ) : menuMode === 1 ? (
              <MachinesBox membership={membership} roomId={props.room_id} />
            ) : null}
          </div>
        </div>
      </SwipeableDrawer>

      {authenticationValid ? null : <Authentication />}
      {selectedNav === 2 ? (
        <Chat
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          room_id={props.room_id}
        />
      ) : null}
      {selectedNav === 0 ? (
        <MessengerPage
          tab_index={"0"}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 1 ? (
        <Store
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 4 ? (
        <MainSettings
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
    </div>
  );
}
