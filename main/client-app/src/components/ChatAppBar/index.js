import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { StylesProvider } from "@material-ui/core";
import {
  ArrowForward,
  Attachment,
  RoomRounded,
  VideoCall,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import CallIcon from "@material-ui/icons/Call";
import MoreIcon from "@material-ui/icons/MoreVert";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Roofing } from "@mui/icons-material";
import React, { useEffect } from "react";
import {
  addTab,
  gotoPage,
  histPage,
  isDesktop,
  isMobile,
  isTablet,
  setInTheGame,
} from "../../App";
import { colors, token, me } from "../../util/settings";
import {
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
} from "../../util/Utils";
import HomeToolbar from "../HomeToolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    direction: "rtl",
  },
  menuButton: {
    marginRight: -16,
  },
  search: {
    position: "absolute",
    left: 0,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "auto",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function ChatAppBar(props) {
  const classes = useStyles();

  let [tl, setTl] = React.useState("");

  useEffect(() => {
    if (socket !== undefined) {
      unregisterEvent("uploading");
      unregisterEvent("uploading", () => {
        setTl("در حال آپلود...");
      });
      unregisterEvent("uploading_done");
      unregisterEvent("uploading_done", () => {
        setTl("");
      });
      unregisterEvent("chat-typing");
      registerEvent("chat-typing", (typingList) => {
        typingList = typingList.filter((u) => {
          if (u === undefined) return false;
          if (u === me.id) {
            return false;
          }
          return true;
        });
        if (typingList.length === 0) {
          setTl("");
        } else {
          setTl("در حال نوشتن...");
        }
      });
    }
  }, []);

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <AppBar
          position="fixed"
          style={{
            width: "100%",
            position: isDesktop() || isTablet() ? "fixed" : undefined,
            top: 0,
            left: 0,
            paddingTop: 8,
            height: 64,
            backgroundColor: colors.primaryMedium,
            backdropFilter: colors.blur,
          }}
        >
          <Toolbar
            style={{
              height: "100%",
              marginTop: isDesktop() || isTablet() ? -8 : 0,
            }}
          >
            <IconButton
                style={{ marginRight: -16 }}
                onClick={() => props.handleClose()}
              >
                <ArrowForward style={{ fill: colors.oposText }} />
              </IconButton>
            <Avatar
              style={{
                width: 28,
                height: 28,
                marginRight: isDesktop() || isTablet() ? 8 : -8,
              }}
              alt={
                props.user !== undefined && props.user !== null
                  ? props.user.firstName + " " + props.user.lastName
                  : props.room !== undefined && props.room !== null
                  ? props.room.title
                  : ""
              }
              src={
                props.user !== undefined && props.user !== null
                  ? serverRoot +
                    `/file/download_user_avatar?token=${token}&userId=${props.user.id}`
                  : props.room !== undefined && props.room !== null
                  ? serverRoot +
                    `/file/download_room_avatar?token=${token}&roomId=${props.room.id}`
                  : ""
              }
              onClick={() => {
                if (
                  (props.room !== undefined &&
                    props.room.chatType === "group") ||
                  (props.room !== undefined &&
                    props.room.chatType === "channel") ||
                  (props.room !== undefined && props.room.chatType === "bot")
                )
                  return;
                props.onUserAvatarClicked();
              }}
            />
            <Typography
              variant="h6"
              style={{
                fontFamily: "mainFont",
                marginRight: 8,
                color: colors.oposText,
              }}
            >
              {props.user !== undefined && props.user !== null
                ? props.user.firstName + " " + props.user.lastName
                : props.room !== undefined && props.room !== null
                ? props.room.title
                : ""}
            </Typography>
            <br />
            <Typography style={{ color: colors.oposText, marginRight: 16 }}>
              {tl.toString()}
            </Typography>
            <div className={classes.search}>
                <IconButton
                  onClick={() => {
                    props.handleCallClicked();
                  }}
                >
                  <VideoCall style={{ fill: colors.oposText }} />
                </IconButton>
              <IconButton
                onClick={() => {
                  addTab(props.room.id);
                }}
              >
                <Roofing style={{ fill: colors.oposText }} />
              </IconButton>
              <IconButton>
                <MoreIcon style={{ fill: colors.oposText }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </HomeToolbar>
    </div>
  );
}
