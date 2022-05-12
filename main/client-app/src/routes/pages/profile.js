import {
  Avatar,
  Card,
  Dialog,
  Fab,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EditIcon from "@material-ui/icons/Edit";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect } from "react";
import {
  addTab,
  gotoPage,
  isDesktop,
  isMobile,
  isTablet,
  registerDialogOpen,
  setInTheGame,
} from "../../App";
import header from "../../images/profile-header.jpeg";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import "./profile.css";
import Wallpaper from '../../images/profile-background.webp';
import { Call, ChatBubble } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function Profile(props) {
  let [user, setUser] = React.useState({});

  document.documentElement.style.overflowY = "hidden";

  const [open, setOpen] = React.useState(false);
  registerDialogOpen(setOpen);

  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };

  useEffect(() => {
    setInTheGame(true);

    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        userId: props.user_id,
      }),
    };
    fetch(serverRoot + "/auth/get_user", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setUser(result.user);
        setOpen(true);
      });
  }, []);

  if (isDesktop() || isTablet()) {
    return (
      <Dialog
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        PaperProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: colors.blur,
            borderRadius: 24,
            boxShadow: "none",
            position: "fixed",
            zIndex: 99999,
          },
        }}
        open={open}
        TransitionComponent={Transition}
      >
        <div style={{ width: 500, height: 650, overflow: "hidden" }}>
          <div
            style={{
              zIndex: -1,
              position: "relative",
              width: "200%",
              height: "100%",
              transform: "rotate(12.5deg)",
              clipPath: "inset(10px 20px 30px 40px)",
              marginTop: -200,
              marginLeft: -200,
              marginRight: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={header}
              alt=""
              style={{
                marginTop: 200,
                width: "100%",
                height: "100%",
                transform: "rotate(-12.5deg)",
              }}
            />
          </div>

          <div
            style={{ width: "100%", position: "absolute", left: -32, top: 16 }}
          >
            <IconButton
              style={{
                width: 32,
                height: 32,
                position: "absolute",
                right: -16,
              }}
              onClick={handleClose}
            >
              <ArrowForwardIcon style={{ fill: "#fff" }} />
            </IconButton>
            <IconButton
              style={{
                width: 32,
                height: 32,
                position: "absolute",
                left: 48,
              }}
            >
              <SearchIcon style={{ fill: "#fff" }} />
            </IconButton>
            <IconButton
              style={{
                width: 32,
                height: 32,
                position: "absolute",
                left: 84,
              }}
              onClick={() => {
                props.onAddToRoomSelected();
              }}
            >
              <GroupAddIcon style={{ fill: "#fff" }} />
            </IconButton>
          </div>

          <div
            style={{
              color: "#fff",
              position: "absolute",
              right: 16,
              top: 64,
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "bolder",
              fontSize: 22,
              borderRadius: 16,
              background: "rgba(0, 0, 0, 0.25)",
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            {user.firstName + " " + user.lastName}
          </div>

          <div
            style={{
              width: "auto",
              height: 40,
              marginTop: -112,
              display: "flex",
              flexWrap: "wrap",
              direction: "rtl",
              position: "absolute",
              right: 16,
              top: 224,
            }}
          >
            <div
              style={{
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
            <div
              style={{
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ تگ
            </div>
            <div
              style={{
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
            <div
              style={{
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: 20,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              تگ تگ
            </div>
          </div>

          <Card
            style={{
              borderRadius: 56,
              backgroundColor: "#666",
              padding: 4,
              width: 112,
              height: 112,
              position: "absolute",
              right: 32,
              top: 388,
            }}
          >
            <Avatar
              style={{ width: "100%", height: "100%" }}
              src={
                serverRoot +
                `/file/download_user_avatar?token=${token}&userId=${user.id}`
              }
            />
          </Card>

          <Fab
            style={{
              marginLeft: 32,
              position: "absolute",
              top: 364,
              backgroundColor: colors.accent,
            }}
            onClick={() => {
              let requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  spaceId: null,
                  name: "",
                  participentId: props.user_id,
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/room/create_room", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result));
                  if (result.room !== undefined) {
                    gotoPage("/app/home", {
                      user_id: props.user_id,
                      room_id: result.room.id,
                      tab_index: 0,
                    });
                  }
                })
                .catch((error) => console.log("error", error));
            }}
          >
            <EditIcon />
          </Fab>
          <div
            style={{
              width: "100%",
              position: "absolute",
              top: 408,
              right: 250,
              display: "flex",
              direction: "rtl",
            }}
          >
            <div
              style={{
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: "#fff",
                  justifyContent: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                0
              </div>
              <div
                style={{
                  color: "#fff",
                  justifyContent: "center",
                  textAlign: "center",
                  fontWeight: "bolder",
                  fontSize: 16,
                }}
              >
                دوستان
              </div>
            </div>
            <div
              style={{
                marginRight: 12,
                color: "#fff",
                marginLeft: 12,
                justifyContent: "center",
                textAlign: "center",
                marginTop: 12,
                fontSize: 18,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <div
                style={{
                  color: "#fff",
                  justifyContent: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginTop: -4,
                }}
              >
                0
              </div>
              <div
                style={{
                  color: "#fff",
                  justifyContent: "center",
                  textAlign: "center",
                  fontWeight: "bolder",
                  fontSize: 16,
                }}
              >
                بات ها
              </div>
            </div>
          </div>
          <div
            style={{
              width: "calc(100% - 32px)",
              height: "auto",
              zIndex: 2,
              paddingLeft: 24,
              direction: "rtl",
              position: "absolute",
              top: 538,
              color: "#fff",
              alignText: "right",
            }}
          ></div>
        </div>
      </Dialog>
    );
  } else {
    return (
      <Dialog
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        PaperProps={{
          style: {
            backgroundColor: colors.backSide,
            boxShadow: "none",
          },
        }}
        fullScreen
        open={open}
        TransitionComponent={Transition}
        style={{
          backdropFilter: colors.blur,
          position: "fixed",
          zIndex: 99999,
        }}
      >
        <img alt={'profile-background'} src={Wallpaper} style={{position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        <Typography style={{color: colors.text, marginTop: 112 + 225 + 32, width: 'calc(100% - 64px)', marginLeft: 32, marginRight: 32, position: 'relative', zIndex: 2}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla gravida tortor vel tellus scelerisque, nec dapibus leo eleifend. Phasellus blandit risus non est dapibus, vel gravida nunc sollicitudin. Mauris auctor eros vel leo pharetra fringilla. Vestibulum nec dictum ante.
        </Typography>
        <Card
          style={{
            borderRadius: 56,
            padding: 4,
            width: 225,
            height: 225,
            position: "absolute",
            top: 112,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Avatar
            style={{ width: "100%", height: "100%" }}
            src={
              serverRoot +
              `/file/download_user_avatar?token=${token}&userId=${user.id}`
            }
          />
        </Card>
        <Toolbar style={{ width: "100%", position: "absolute", top: 8, direction: 'rtl' }}>
          <IconButton
            onClick={handleClose}
          >
            <ArrowForwardIcon style={{ fill: colors.icon }} />
          </IconButton>
          <div style={{flex: 1}} />
          <IconButton
            onClick={() => {
              props.onAddToRoomSelected();
            }}
          >
            <GroupAddIcon style={{ fill: colors.icon }} />
          </IconButton>
        </Toolbar>
        <Fab
          style={{ backgroundColor: colors.accent, position: "fixed", left: 32, bottom: 32, zIndex: 2 }}
          onClick={() => {
            let requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                spaceId: null,
                name: "",
                participentId: props.user_id,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/room/create_room", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.room !== undefined) {
                  addTab(result.room.id);
                }
              })
              .catch((error) => console.log("error", error));
          }}
        >
          <ChatBubble />
        </Fab>
        <Fab
          style={{ backgroundColor: colors.accent, position: "fixed", left: 32 + 56 + 16, bottom: 32, zIndex: 2 }}
          onClick={() => {
           
          }}
        >
          <Call />
        </Fab>
      </Dialog>
    );
  }
}
