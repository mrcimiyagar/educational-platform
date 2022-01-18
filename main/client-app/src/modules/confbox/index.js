import {
  AppBar,
  createTheme,
  Fab,
  IconButton,
  Slide,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  ArrowForward,
  Chat,
  Mic,
  MicOff,
  Notes,
  VideocamOff,
} from "@material-ui/icons";
import Menu from "@material-ui/icons/Menu";
import PollIcon from "@material-ui/icons/Poll";
import Search from "@material-ui/icons/Search";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import {
  gotoPage,
  inTheGame,
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
} from "../../App";
import store, { switchConf } from "../../redux/main";
import { colors, me } from "../../util/settings";
import {
  registerEvent,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import "./style.css";
import { pathConfig } from "../..";
import { membership } from "../../routes/pages/room";

export let updateConfBox = () => {};
export let isConfConnected = false;

export function ConfBox(props) {
  let forceUpdate = useForceUpdate();
  updateConfBox = forceUpdate;
  unregisterEvent("membership-updated");
  registerEvent("membership-updated", (mem) => {
    if (mem.canActInVideo) {
      window.frames["conf-video-frame"].postMessage(
        { sender: "main", action: "enableVideoAccess" },
        pathConfig.confClient
      );
    } else {
      window.frames["conf-video-frame"].postMessage(
        { sender: "main", action: "disableVideoAccess" },
        pathConfig.confClient
      );
    }
  });
  let top = undefined;
  let right = undefined;
  let position = undefined;
  let width = undefined;
  let height = undefined;
  let marginTop = undefined;

  if (isDesktop()) {
    if (props.currentRoomNav === 2) {
      if (props.webcamOn === true && props.webcamOnSecond === true) {
        width = "100%";
        height = "100%";
        right = 0;
        top = 0;
        marginTop = undefined;
        position = "fixed";
      } else if (props.webcamOn === false && props.webcamOnSecond === true) {
        width = "100%";
        height = "100%";
        right = 0;
        top = 0;
        marginTop = undefined;
        position = "fixed";
      } else if (props.webcamOn === false && props.webcamOnSecond === false) {
        width = "100%";
        height = "100%";
        right = 0;
        top = 0;
        marginTop = undefined;
        position = "fixed";
      }
    } else {
      if (props.webcamOn === true && props.webcamOnSecond === true) {
        width = 450;
        height = 300;
        right = 0;
        top = 0;
        marginTop = undefined;
        position = "fixed";
      } else if (props.webcamOn === false && props.webcamOnSecond === true) {
        width = 450 + 116;
        height = 300 + 80;
        right = -116;
        top = -80;
        marginTop = undefined;
        position = "fixed";
      } else if (props.webcamOn === false && props.webcamOnSecond === false) {
        width = 0;
        height = 0;
        right = 0;
        top = 0;
        marginTop = undefined;
        position = "fixed";
      }
    }
  } else {
    width = "100%";
    height = "calc(100% - 116px)";
    right = 0;
    top = 0;
    marginTop = 64;
    position = "fixed";
  }

  return (
    <div
      id={props.id}
      style={{
        right: props.currentRoomNav !== 2 ? 0 : undefined,
        top: props.currentRoomNav !== 2 ? 0 : undefined,
        width: props.currentRoomNav !== 2 ? 450 : "100%",
        height: isDesktop() ? "100%" : "calc(100% - 128px)",
        position: props.currentRoomNav !== 2 ? "fixed" : "relative",
        direction: "ltr",
        display: props.style.display,
      }}
    >
      <AppBar
        style={{
          width: isDesktop() ? 550 : "100%",
          height: 64,
          display: props.currentRoomNav !== 2 ? "none" : "block",
          borderRadius: isDesktop() ? "0 0 24px 24px" : 0,
          backgroundColor: colors.primaryMedium,
          backdropFilter: "blur(10px)",
          position: "fixed",
          left: isDesktop() && isInRoom() ? "calc(50% - 225px)" : "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Toolbar
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <IconButton
            style={{ width: 32, height: 32, position: "absolute", left: 16 }}
          >
            <Search style={{ fill: "#fff" }} />
          </IconButton>
          <IconButton
            style={{
              width: 32,
              height: 32,
              position: "absolute",
              left: 16 + 32 + 16,
            }}
            onClick={() => {
              props.openDeck();
            }}
          >
            <ViewCarousel style={{ fill: "#fff" }} />
          </IconButton>
          <IconButton
            style={{
              width: 32,
              height: 32,
              position: "absolute",
              left: 16 + 32 + 16 + 32 + 16,
            }}
            onClick={() => {
              props.openNotes();
            }}
          >
            <Notes style={{ fill: "#fff" }} />
          </IconButton>
          <IconButton
            style={{
              width: 32,
              height: 32,
              position: "absolute",
              left: 16 + 32 + 16 + 32 + 16 + 32 + 16,
            }}
            onClick={() => {
              props.openPolls();
            }}
          >
            <PollIcon style={{ fill: "#fff" }} />
          </IconButton>
          <Typography
            variant={"h6"}
            style={{ color: "#fff", position: "absolute", right: 16 + 32 + 16 }}
          >
            سالن کنفرانس
          </Typography>
          <IconButton
            style={{ width: 32, height: 32, position: "absolute", right: 16 }}
            onClick={() => {
              props.setMenuOpen(true);
            }}
          >
            <Menu style={{ fill: "#fff" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {isDesktop() && isInRoom() ? null : (
        <Slide direction="right" in={inTheGame} mountOnEnter>
          <Fab
            color={"secondary"}
            style={{
              position: "fixed",
              bottom: isInRoom() && (isMobile() || isTablet()) ? 72 + 12 : 12,
              right: 16 + 72,
              zIndex: 4,
            }}
            onClick={() =>
              gotoPage("/app/chat", {
                room_id: props.roomId,
                user_id: props.userId,
              })
            }
          >
            <Chat />
          </Fab>
        </Slide>
      )}

      <iframe
        scrolling="no"
        onLoad={() => {
          window.frames["conf-video-frame"].postMessage(
            {
              sender: "main",
              action: "init",
              videoAccess: membership.canActInVideo,
              me: me,
              roomId: props.roomId,
            },
            pathConfig.confClient
          );
        }}
        allowTransparency={true}
        id={"conf-video-frame"}
        name="conf-video-frame"
        src={pathConfig.confClient}
        allow={"microphone; camera; fullscreen; display-capture"}
        style={{
          right: right,
          top: top,
          position: position,
          width: width,
          height: height,
          marginTop: marginTop,
          marginBottom: 16,
        }}
        frameBorder="0"
      ></iframe>
    </div>
  );
}
