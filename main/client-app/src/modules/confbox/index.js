import {
  AppBar,
  createTheme,
  Dialog,
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
import Core from '../../components/Core';

export let updateConfBox = () => {};
export let isConfConnected = false;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export function ConfBox(props) {
  const [open, setOpen] = React.useState(true);
  let forceUpdate = useForceUpdate();
  updateConfBox = forceUpdate;
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      props.onClose();
    }, 250);
  };
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
    height = "calc(100% - 144px)";
    right = 0;
    top = 0;
    marginTop = 80;
    position = "fixed";
  }

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: colors.backSide,
          backdropFilter: "blur(10px)",
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
      id={props.id}
      style={{
        right: props.currentRoomNav !== 2 ? 0 : undefined,
        top: props.currentRoomNav !== 2 ? 0 : undefined,
        width: props.currentRoomNav !== 2 ? 450 : "100%",
        height: isDesktop() ? "100%" : "calc(100% - 128px)",
        position: props.currentRoomNav !== 2 ? "fixed" : "relative",
        direction: "ltr"
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
            direction: 'rtl'
          }}
        >
        <IconButton
          onClick={() => {
            handleClose();
          }}
        >
          <ArrowForward style={{ fill: colors.icon }} />
        </IconButton>
          <Typography
            variant={"h6"}
            style={{ color: colors.text, flex: 1, textAlign: 'right' }}
          >
            سالن کنفرانس
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{
          right: right,
          top: top,
          position: position,
          width: width,
          height: height,
          marginTop: marginTop,
          marginBottom: 16
      }}>
        <Core videoAccess={props.membership.canActInVideo} roomId={props.moduleWorkerId} />
      </div>
    </div>
    </Dialog>
  );
}
