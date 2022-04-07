import { Dialog, Paper } from "@mui/material";
import SpaceSearchbar from "../../components/SpaceSearchbar";
import SpaceBottombar from "../../components/SpaceBottombar";
import Authentication from "./authentication";
import { authenticationValid, inTheGame } from "../../App";
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
import React, { useEffect } from "react";
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
import { colors, setToken, token } from "../../util/settings";
import {
  leaveRoom,
  registerEvent,
  serverRoot,
  setRoom,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import DesktopWallpaper2 from "../../images/desktop-wallpaper.jpg";
import { MachinesBox } from "../../modules/machinesbox/machinesbox";
import Chat from "./chat";
import MessengerPage from "./messenger";
import MainSettings from "./mainsettings";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedroomBabyOutlinedIcon from "@mui/icons-material/BedroomBabyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SettingsPage from "./settings";
import { RoomTreeBox } from "../../components/RoomTreeBox";
import CreateRoom from "./createRoom";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import { FileBox } from "../../modules/filebox/filebox";
import { setCurrentRoomId, currentRoomId } from "../../App";
import SpacesGrid from "../../components/SpacesGrid";
import StoreBot from "./storeBot";
import StoreFam from "../../components/StoreFam";
import CreateBotCategoryPage from "./createBotCategory";
import Workshop from "./workshop";
import { Edit } from "@material-ui/icons";
import AudioPlayer from "./audioPlayer";

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
let roomId = undefined;

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

export default function Space(props) {
  const [searchBarFixed, setSearchBarFixed] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState(undefined);
  const [thisRoom, setThisRoom] = React.useState(undefined);
  const [wallpaperLoaded, setWallpaperLoaded] = React.useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
  openAudioPlayer = (roomId, fileId, src) => {
    openedAudio = {roomId, src, fileId};
    setShowAudioPlayer(true);
  };
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

  roomId = props.room_id;

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

  [membership, setMembership] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuMode, setMenuMode] = React.useState(0);
  let [webcamOn, setWebcamOn] = React.useState(false);
  let [webcamOnSecond, setWebcamOnSecond] = React.useState(false);
  const [selectedBotId, setSelectedBotId] = React.useState(undefined);

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
            localStorage.setItem('token', r.auth.token);
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
        }
        setTimeout(() => {
          setWallpaperLoaded(true);
        }, 1000);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    roomId = props.room_id;
    setRoomId(roomId);
    setTimeout(() => {
      loadData(() => {
        setLoaded(true);
        syncWallpaper();
      });
    }, 0);
  }, [props.room_id]);

  let openDeck = () => {
    gotoPage("/app/deck", { room_id: props.room_id });
  };
  let openNotes = () => {
    gotoPage("/app/notes", { room_id: props.room_id });
  };
  let openPolls = () => {
    gotoPage("/app/poll", { room_id: props.room_id });
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

  const [open, setOpen] = React.useState(true);

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
                backdropFilter: "blur(15px)",
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

  let ui = (
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
          onModuleSelected={(modName) => {
            if (modName === "whiteboard") {
              setSelectedNav(7);
            } else if (modName === "taskboard") {
              setSelectedNav(8);
            } else if (modName === "filestorage") {
              setSelectedNav(9);
            } else if (modName === "videochat") {
            }
          }}
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
          transform: inTheGame ? "translateY(0px)" : "translateY(-200px)",
          transition: "height .25s, transform .5s",
        }}
      >
        <SpaceSearchbar
          backable={props.backable}
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
          <Tab
            classes={{ root: classes.tab }}
            style={{ color: colors.text }}
            label="میز کنفرانس فردا"
          />
          <Tab
            classes={{ root: classes.tab }}
            style={{ color: colors.text }}
            label="میز تست نرم افزار"
          />
          <Tab
            classes={{ root: classes.tab }}
            style={{ color: colors.text }}
            label="میز بازی شطرنج 2"
          />
          <Tab
            classes={{ root: classes.tab }}
            style={{ color: colors.text }}
            label="میز کنفرانس هفته ی بعد"
          />
        </Tabs>
      </AppBar>

      <SpaceBottombar
        fixed={searchBarFixed}
        setCurrentRoomNav={(index) => {
          if (index === 3) {
            openToolbox();
          } else if (index === 1) {
            setInTheGame(false);
            setTimeout(() => {
              setCurrentRoomId(1);
            }, 500);
          } else {
            setSelectedNav(index);
          }
        }}
      />

      {currentRoomId === 1 ? (
        <StoreFam onCategoryCreationSelected={() => setSelectedNav(12)} />
      ) : null}

      <Fab onClick={() => toggleEditMode()} style={{backgroundColor: colors.accent, position: 'fixed', left: 16, bottom: 16 + 56 + 16 + 16}}>
        <Edit />
      </Fab>
      
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
              background: colors.primaryLight,
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
                  room={thisRoom}
                  addRoomClicked={() => {
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
          roomId={props.room_id}
        />
      ) : null}
      {selectedNav === 8 ? (
        <TaskBox
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          roomId={props.room_id}
        />
      ) : null}
      {selectedNav === 9 ? (
        <FileBox
          onClose={() => {
            setSelectedNav(undefined);
            setInTheGame(true);
          }}
          roomId={props.room_id}
        />
      ) : null}
      {selectedNav === 10 ? (
        <SpacesGrid
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
      {(showAudioPlayer && openedAudio !== undefined) ? (
        <AudioPlayer
          room_id={openedAudio.roomId}
          src={openedAudio.src}
          file_id={openedAudio.fileId}
          onClose={() => {
            setShowAudioPlayer(false);
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
              backdropFilter: "blur(15px)",
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

  if (props.backable === true) {
    return (
      <Dialog
        fullScreen
        hideBackdrop={true}
        open={open}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            height: "100%",
            background: "transparent",
            boxShadow: "none",
          },
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          background: "transparent",
          boxShadow: "none",
        }}
      >
        {ui}
      </Dialog>
    );
  } else {
    return ui;
  }
}
