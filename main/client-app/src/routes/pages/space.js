import { Dialog, Paper, Typography } from "@mui/material";
import SpaceSearchbar from "../../components/SpaceSearchbar";
import SpaceBottombar from "../../components/SpaceBottombar";
import Authentication from "./authentication";
import { authenticationValid, inTheGame, openInnerNotif } from "../../App";
import {
  AppBar,
  Avatar,
  SwipeableDrawer,
  makeStyles,
  Tab,
  Tabs,
  Slide,
  Fab,
} from "@material-ui/core";
import React, { Suspense, useEffect } from "react";
import { setWallpaper } from "../..";
import {
  gotoPage,
  isDesktop,
  isTablet,
  setInTheGame,
  setRoomId,
} from "../../App";
import { BoardBox } from "../../modules/boardbox/boardbox";
import BotsBox, { openToolbox, toggleEditMode } from "../../modules/botsbox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { UsersBox } from "../../modules/usersbox/usersbox";
import store, { changeConferenceMode } from "../../redux/main";
import { colors, me, setToken, token } from "../../util/settings";
import {
  leaveRoom,
  registerEvent,
  room,
  serverRoot,
  setRoom,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import DesktopWallpaper2 from "../../images/desktop-wallpaper.jpg";
import { MachinesBox } from "../../modules/machinesbox/machinesbox";
import Chat from "./chat";
import MessengerPage from "./messenger";
import MainSettings from "./mainsettings";
import BedroomBabyOutlinedIcon from "@mui/icons-material/BedroomBabyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SettingsPage from "./settings";
import { RoomTreeBox } from "../../components/RoomTreeBox";
import CreateRoom from "./createRoom";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import { FileBox } from "../../modules/filebox/filebox";
import SpacesGrid from "../../components/SpacesGrid";
import StoreBot from "./storeBot";
import StoreFam from "../../components/StoreFam";
import CreateBotCategoryPage from "./createBotCategory";
import Workshop from "./workshop";
import { Edit } from "@material-ui/icons";
import AudioPlayer from "./audioPlayer";
import VideoPlayer from "./videoPlayer";
import { ConfBox } from "../../modules/confbox";
import { PollBox } from "../../modules/pollbox/pollbox";
import NotePage from "./notes";
import Deck from "./deck";
import InvitationsList from "./invitationsList";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchEngine from "./searchEngine";
import Profile from "./profile";
import SpacesList from "./spacesList";
import CustomImageBox from "../../components/CustomImageBox";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import "./space.css";
import { borderRadius } from "@mui/system";

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

export let membership = undefined;
export let setMembership = () => {};

let attachWebcamOnMessenger = undefined;

let oldSt = 0;

let roomPersistanceDoctor;

let TriggerInTheGame = () => {
  setInTheGame(true);
  return null;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

let openedAudio = undefined;
export let openAudioPlayer = () => {};
let openedVideo = undefined;
export let openVideoPlayer = () => {};

export default function Space(props) {
  const [searchBarFixed, setSearchBarFixed] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState(undefined);
  const [thisRoom, setThisRoom] = React.useState(undefined);
  const [wallpaperLoaded, setWallpaperLoaded] = React.useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(false);
  const [selectedModuleWorkerId, setSelectedModuleWorkerId] =
    React.useState(undefined);
  openAudioPlayer = (moduleWorkerId, fileId, src, rId) => {
    openedAudio = { moduleWorkerId, src, fileId, roomId: rId };
    setShowAudioPlayer(true);
  };
  openVideoPlayer = (moduleWorkerId, fileId, rId) => {
    openedVideo = { moduleWorkerId, fileId, roomId: rId };
    setShowVideoPlayer(true);
  };
  const attachScrollCallback = () => {
    const searchScrollView = document.getElementById(
      "botsContainerOuter" + props.room_id
    );
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

  const useStyles = makeStyles({
    root: {
      width: "100%",
      position: "fixed",
      bottom: 0,
      backgroundColor: colors.primaryMedium,
    },
    indicator: {
      backgroundColor: colors.oposText,
    },
    tab: {
      color: colors.oposText,
    },
  });

  document.documentElement.style.overflow = "auto";

  let forceUpdate = useForceUpdate();

  const classes = useStyles();

  [membership, setMembership] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuMode, setMenuMode] = React.useState(0);
  let [webcamOn, setWebcamOn] = React.useState(false);
  let [webcamOnSecond, setWebcamOnSecond] = React.useState(false);
  const [selectedBotId, setSelectedBotId] = React.useState(undefined);
  const [selectedRoomId, setSelectedRoomId] = React.useState(undefined);
  const [showGlobe, setShowGlobe] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(undefined);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showSpacesList, setShowSpacesList] = React.useState(false);
  const [roomWallpaper, setRoomWallpaper] = React.useState(null);

  let enterRoom = (callback) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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

    let enterRoomPromise = window.originalFetch(
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
        setThisRoom(result.room);
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
            localStorage.setItem("token", r.auth.token);
            window.location.reload();
          }
        } else {
          enterRoom(callback);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const reconnection = () => {
    try {
      if (socket === undefined || socket === null) {
        setTimeout(reconnection, 5000);
      } else {
        socket.io.removeAllListeners("reconnect");
        socket.io.on("reconnect", () => {
          loadData();
        });
      }
    } catch (ex) {
      setTimeout(reconnection, 5000);
    }
  };

  reconnection();

  let syncWallpaper = () => {
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
        } else {
          let wall = JSON.parse(result.wallpaper);
          if (wall === undefined || wall === null) return;
          if (wall.type === "photo") {
            setRoomWallpaper({
              type: "photo",
              photo:
                serverRoot +
                `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
            });
          } else if (wall.type === "video") {
            setRoomWallpaper({
              type: "video",
              video:
                serverRoot +
                `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
            });
          } else if (wall.type === "color") {
            setRoomWallpaper(wall);
          }
        }
        setTimeout(() => {
          setWallpaperLoaded(true);
        }, 1000);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    setTimeout(() => {
      loadData(() => {
        setLoaded(true);
        syncWallpaper();
      });
    }, 0);
  }, [props.room_id]);

  useEffect(() => {
    setSelectedNav(props.selected_nav);
  }, [props.selected_nav]);

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

    console.log("planting destructor...");

    return () => {
      leaveRoom(() => {});
    };
  }, []);

  useEffect(() => {
    if (roomPersistanceDoctor !== undefined)
      clearInterval(roomPersistanceDoctor);
    let doRoomDoctor = () => {
      if (selectedNav === 2 || selectedNav === 0) return;
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

    roomPersistanceDoctor = setInterval(() => {
      doRoomDoctor();
    }, 3500);
    console.log("planting destructor 2...");
    return () => {
      clearInterval(roomPersistanceDoctor);
    };
  }, [selectedNav]);

  useEffect(() => {
    setSelectedNav(props.module_worker_id);
  }, [props.module_worker_id]);

  const [open, setOpen] = React.useState(true);
  const [allBots, setAllBots] = React.useState([]);

  useEffect(() => {
    if (props.room_id === 1) {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        redirect: "follow",
      };
      fetch(serverRoot + "/bot/get_bots", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          if (result.bots !== undefined) {
            result.bots.unshift({}, {});
            setAllBots(result.bots);
          }
        })
        .catch((error) => console.log("error", error));
    }
  }, []);

  if (!loaded || isObjectEmpty(membership)) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {!wallpaperLoaded ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Paper
              style={{
                width: 144,
                height: 144,
                borderRadius: 32,
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: colors.field,
                backdropFilter: colors.blur,
              }}
            >
              <div
                style={{ widthL: "100%", height: "100%", position: "relative" }}
              >
                <div
                  style={{
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Hypnosis
                    color={colors.icon}
                    width="96px"
                    height="96px"
                    duration="0.5s"
                  />
                </div>
              </div>
            </Paper>
          </div>
        ) : null}
      </div>
    );
  }

  const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 1)`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        direction: "rtl",
        position: "relative",
        display: props.show ? "block" : "none",
      }}
    >
      {roomWallpaper === undefined ||
      roomWallpaper === null ? null : roomWallpaper.type === "photo" ? (
        <CustomImageBox
          src={roomWallpaper.photo}
          style={{
            position: "fixed",
            left: 0,
            top: 120,
            width: "100%",
            height: "calc(100% - 112px)",
            objectFit:
              roomWallpaper.fitType === undefined
                ? "cover"
                : roomWallpaper.fitType,
          }}
        />
      ) : roomWallpaper.type === "video" ? (
        <video
          loop
          autoPlay
          src={roomWallpaper.video}
          style={{
            position: "fixed",
            left: 0,
            top: 120,
            width: "100%",
            height: "calc(100% - 112px)",
            objectFit: "cover",
          }}
        />
      ) : roomWallpaper.type === "color" ? (
        <div
          style={{
            backgroundColor: roomWallpaper.color,
            position: "fixed",
            left: 0,
            top: 120,
            width: "100%",
            height: "calc(100% - 112px)",
          }}
        />
      ) : null}
      {props.room_id === 1 ? null : (
        <div
          id="searchScrollView"
          style={{
            width: "100%",
            height: "calc(100% - 112px)",
            position: "fixed",
            left: 0,
            top: 120,
            overflow: "auto",
          }}
        >
          <BotsBox
            id={props.room_id}
            openMenu={() => setMenuOpen(true)}
            setMenuOpen={setMenuOpen}
            membership={membership}
            roomId={props.room_id}
            style={{ display: "block" }}
            onModuleSelected={(modName, mwId) => {
              setSelectedModuleWorkerId(mwId);
              if (modName === "whiteboard") {
                setSelectedNav(7);
              } else if (modName === "taskboard") {
                setSelectedNav(8);
              } else if (modName === "filestorage") {
                setSelectedNav(9);
              } else if (modName === "videochat") {
                setSelectedNav(14);
              } else if (modName === "polling") {
                setSelectedNav(15);
              } else if (modName === "notes") {
                setSelectedNav(16);
              } else if (modName === "deck") {
                setSelectedNav(17);
              }
            }}
          />
          <div style={{ width: "100%", height: 72 + 16 }} />
        </div>
      )}
      ;
      {props.room_id === 1 ? (
        <BubbleUI
          style={{
            width: "100%",
            height: "100%",
            direction: "ltr",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
          }}
          options={{
            size: 180,
            minSize: 30,
            gutter: 2,
            provideProps: true,
            numCols: 3,
            fringeWidth: 100,
            yRadius: 250,
            xRadius: 150,
            cornerRadius: 50,
            showGuides: false,
            compact: true,
            gravitation: 5,
          }}
          className="myBubbleUI"
        >
          {allBots
            .map((bot) => {
              if (bot.id === undefined) {
                return (
                  <div
                    className="child"
                    style={{
                      width: 144,
                      height: 300,
                      position: 'relative'
                    }}
                    key={bot.id}
                  >
                    
                  </div>
                );
              }
              return (
                <div
                  className="child"
                  style={{
                    width: 144,
                    height: 144,
                    backgroundColor: getRandomColor(),
                    position: 'relative'
                  }}
                  key={bot.id}
                >
                  <Avatar
                    style={{ width: 96, height: 96, positionP: 'fixed', left: '50%', top: 8, transform: 'translateX(-50%)' }}
                    src={
                      serverRoot +
                      `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
                    }
                  />
                  <Typography style={{color: colors.oposTex, marginTop: 8}}>
                    {bot.title}
                  </Typography>
                </div>
              );
            })
            .filter((el) => el !== null)}
        </BubbleUI>
      ) : null}
      {props.room_id === 1 ? (
        <StoreFam onCategoryCreationSelected={() => setSelectedNav(12)} />
      ) : null}
      <SpaceSearchbar
        fixed={searchBarFixed}
        onSpacesClicked={() => {
          setSelectedNav(10);
        }}
        onMenuClicked={() => {
          if (props.backable === true) {
            setOpen(false);
            setTimeout(() => {
              props.onClose();
            }, 250);
          } else {
            setMenuOpen(true);
          }
        }}
      />
      <SpaceBottombar
        fixed={searchBarFixed}
        setCurrentRoomNav={(index) => {
          if (index === 3) {
            openToolbox();
          } else if (index === 1) {
            setSelectedNav(18);
          } else {
            setSelectedNav(index);
          }
        }}
      />
      <Fab
        onClick={() => toggleEditMode()}
        style={{
          backgroundColor: colors.accent,
          position: "fixed",
          left: 16,
          bottom: 16 + 56 + 16 + 16,
        }}
      >
        <Edit />
      </Fab>
      <SwipeableDrawer
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        anchor={"right"}
        PaperProps={{
          style: {
            background: colors.field,
            backdropFilter: colors.blur,
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
              background: colors.backSide,
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
                setMenuMode(2);
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
                setInTheGame(false);
                setTimeout(() => {
                  setSelectedNav(5);
                }, 250);
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
            ) : menuMode === 2 ? (
              thisRoom !== undefined ? (
                <RoomTreeBox
                  membership={membership}
                  openEditRoom={(selectedRoomId) => {
                    setSelectedRoomId(selectedRoomId);
                    setMenuOpen(false);
                    setTimeout(() => {
                      setSelectedNav(6);
                    }, 250);
                  }}
                  room={thisRoom}
                  addRoomClicked={() => {
                    setSelectedRoomId(undefined);
                    setMenuOpen(false);
                    setTimeout(() => {
                      setSelectedNav(6);
                    }, 250);
                  }}
                  onRoomSelected={(id) => {}}
                />
              ) : null
            ) : null}
          </div>
        </div>
      </SwipeableDrawer>
      {authenticationValid ? null : <Authentication />}
      {selectedNav === 0 ? (
        <MessengerPage
          tab_index={"0"}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 2 ? (
        <Chat
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          room_id={props.room_id}
        />
      ) : null}
      {selectedNav === 4 ? (
        <MainSettings
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          onDeveloperModeClicked={() => {
            setSelectedNav(13);
          }}
        />
      ) : null}
      {selectedNav === 5 ? (
        <SettingsPage
          room_id={props.room_id}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 6 ? (
        thisRoom !== undefined ? (
          <CreateRoom
            spaceId={thisRoom.spaceId}
            editingRoomId={selectedRoomId}
            onClose={() => {
              setSelectedNav(undefined);
              setInTheGame(true);
            }}
          />
        ) : null
      ) : null}
      {selectedNav === 7 ? (
        <BoardBox
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          membership={membership}
          roomId={selectedModuleWorkerId}
        />
      ) : null}
      {selectedNav === 8 ? (
        <TaskBox
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          roomId={selectedModuleWorkerId}
        />
      ) : null}
      {selectedNav === 9 ? (
        <FileBox
          moduleWorkerId={selectedModuleWorkerId}
          roomId={props.room_id}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 14 ? (
        <ConfBox
          webcamOn={webcamOn}
          currentRoomNav={2}
          moduleWorkerId={selectedModuleWorkerId}
          roomId={props.room_id}
          membership={membership}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 15 ? (
        <PollBox
          roomId={props.room_id}
          moduleWorkerId={selectedModuleWorkerId}
          membership={membership}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 16 ? (
        <NotePage
          room_id={selectedModuleWorkerId}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 17 ? (
        <Deck
          room_id={props.room_id}
          moduleWorkerId={selectedModuleWorkerId}
          membership={membership}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 10 ? (
        <SpacesGrid
          showGlobe={() => setShowGlobe(true)}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 11 ? (
        selectedBotId !== undefined ? (
          <StoreBot
            bot_id={selectedBotId}
            onClose={() => {
              setSelectedNav(undefined);
              setInTheGame(true);
            }}
          />
        ) : null
      ) : null}
      {selectedNav === 12 ? (
        <CreateBotCategoryPage
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {selectedNav === 13 ? (
        <Workshop
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {showGlobe ? (
        <SearchEngine
          onClose={() => setShowGlobe(false)}
          onUserSelected={(id) => {
            setSelectedUserId(id);
            setShowProfile(true);
          }}
        />
      ) : null}
      {showProfile && selectedUserId !== undefined ? (
        <Profile
          onClose={() => {
            setShowProfile(false);
            setSelectedUserId(undefined);
          }}
          user_id={selectedUserId}
          onAddToRoomSelected={() => {
            setShowSpacesList(true);
            setShowProfile(false);
          }}
        />
      ) : null}
      {selectedNav === 18 ? (
        <InvitationsList
          roomId={props.room_id}
          userId={me.id}
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
        />
      ) : null}
      {showSpacesList && selectedUserId !== undefined ? (
        <SpacesList
          onClose={() => {
            setShowSpacesList(false);
            setSelectedUserId(undefined);
          }}
          user_id={selectedUserId}
        />
      ) : null}
      {showAudioPlayer && openedAudio !== undefined ? (
        <AudioPlayer
          roomId={openedAudio.roomId}
          src={openedAudio.src}
          fileId={openedAudio.fileId}
          moduleWorkerId={openedAudio.moduleWorkerId}
          onClose={() => {
            setShowAudioPlayer(false);
          }}
        />
      ) : null}
      {showVideoPlayer && openedVideo !== undefined ? (
        <VideoPlayer
          roomId={openedVideo.roomId}
          src={openedVideo.src}
          fileId={openedVideo.fileId}
          moduleWorkerId={openedVideo.moduleWorkerId}
          onClose={() => {
            setShowVideoPlayer(false);
          }}
        />
      ) : null}
      {!wallpaperLoaded ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Paper
            style={{
              width: 144,
              height: 144,
              borderRadius: 32,
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: colors.field,
              backdropFilter: colors.blur,
            }}
          >
            <div
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <div
                style={{
                  position: "fixed",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Hypnosis
                  color={colors.icon}
                  width="96px"
                  height="96px"
                  duration="0.5s"
                />
              </div>
            </div>
          </Paper>
        </div>
      ) : null}
      <TriggerInTheGame />
    </div>
  );
}
