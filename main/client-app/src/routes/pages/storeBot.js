import {
  Avatar,
  Box,
  Dialog,
  Fab,
  IconButton,
  Slide,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add, Message } from "@material-ui/icons";
import ArrowBack from "@material-ui/icons/ArrowBack";
import {
  default as ArrowForward,
  default as ArrowForwardIcon,
} from "@material-ui/icons/ArrowForward";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import Rating from "@material-ui/lab/Rating";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import "react-photo-view/dist/index.css";
import Carousel from "react-spring-3d-carousel";
import { gotoPage, isMobile, popPage, registerDialogOpen } from "../../App";
import StoreComments from "../../components/StoreComments";
import StoreSimiliar from "../../components/StoreSimiliar";
import StoreWidgets from "../../components/StoreWidgets";
import RoomWallpaper from "../../images/roomWallpaper.png";
import { colors, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import CreateCommentPage from "./createComment";
import SpacesListPage from "./spacesList";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    position: "relative",
    overflow: "auto",
    direction: "rtl",
  },
  imageList: {
    paddingTop: 96,
    width: "100%",
    height: "auto",
    marginLeft: -16,
    marginRight: -16,
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
  indicator: {
    backgroundColor: "white",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function StoreBot(props) {
  document.documentElement.style.overflow = "auto";

  let forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [bot, setBot] = React.useState({});
  const [screenshots, setScreenshots] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  const [added, setAdded] = React.useState(false);
  const [dest, setDest] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [showCreateComment, setShowCreateComment] = React.useState(false);
  const [createCommentRating, setCreateCommentRating] = React.useState(0);
  const [showSpacesList, setShowSpacesList] = React.useState(false);
  registerDialogOpen(setOpen);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };

  let checkAdded = () => {
    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        botId: props.bot_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/subscribe_exists", requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.exists !== undefined) {
          setAdded(result.exists);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        botId: props.bot_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_bot_by_id", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.bot !== undefined) {
          setBot(result.bot);
          setRating(result.rating);
          forceUpdate();
        }
      })
      .catch((error) => console.log("error", error));

    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        botId: props.bot_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_screenshots", requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.screenshots !== undefined) {
          setScreenshots(result.screenshots);
          forceUpdate();
        }
      })
      .catch((error) => console.log("error", error));

    checkAdded();
  }, []);

  let counter = 0;

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: colors.primaryMedium,
          boxShadow: "none",
          backdropFilter: colors.blur,
          width: isMobile() ? "100%" : 700,
          height: isMobile() ? "100%" : 800,
          borderRadius: isMobile() ? 0 : 24,
        },
      }}
      fullScreen={isMobile()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className={classes.root}>
        <Avatar
          style={{
            width: 150,
            height: 150,
            position: "absolute",
            maxWidth: 150,
            left: "50%",
            transform: "translateX(-50%)",
            top: 72,
          }}
          src={
            serverRoot +
            `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
          }
        />

        <div style={{ padding: 12, display: "flex", marginTop: 200 + 72 }}>
          <Typography variant={"h6"} style={{ color: colors.text }}>
            {bot.title}
          </Typography>
          <Rating
            name="read-only"
            value={rating}
            readOnly
            style={{
              paddingLeft: 16,
              paddingTop: 8,
              paddingRight: 16,
              borderRadius: "0 20px 20px 0",
              position: "absolute",
              left: 0,
              height: 40,
            }}
          />
        </div>

        <IconButton
          style={{
            width: 32,
            height: 32,
            margin: 16,
            position: "absolute",
            top: 0,
          }}
          onClick={() => handleClose()}
        >
          <ArrowForwardIcon style={{ fill: colors.icon }} />
        </IconButton>

        <Typography style={{ padding: 12, color: colors.text }}>
          {bot.description}
        </Typography>

        <div style={{ width: "100%", height: 200, position: "relative" }}>
          <Typography
            variant={"h6"}
            style={{ marginLeft: 16, marginRight: 16, color: colors.text }}
          >
            ?????? ????
          </Typography>
          <div
            style={{ width: "calc(100% - 64px)", height: "100%", margin: 32 }}
          >
            {screenshots.length > 0 ? (
              <Carousel
                slides={screenshots.map((ss) => ({
                  key: counter++,
                  content: (
                    <img
                      onClick={() => gotoPage("/app/photoviewer")}
                      style={{ width: 100 }}
                      src={
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${null}&fileId=${
                          ss.fileId
                        }`
                      }
                      alt=""
                    />
                  ),
                }))}
                goToSlide={dest}
              />
            ) : (
              <Typography
                style={{
                  fontSize: 18,
                  width: "100%",
                  height: 150,
                  lineHeight: 8,
                  color: colors.text,
                }}
              >
                ???????? ???????? ??????.
              </Typography>
            )}
          </div>
          {screenshots.length > 0 ? (
            <IconButton
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => {
                setDest(dest + 1);
              }}
            >
              <ArrowForward style={{ fill: colors.icon }} />
            </IconButton>
          ) : null}
          {screenshots.length > 0 ? (
            <IconButton
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => {
                setDest(dest - 1);
              }}
            >
              <ArrowBack style={{ fill: colors.icon }} />
            </IconButton>
          ) : null}
        </div>

        <StoreWidgets botId={props.bot_id} />

        <StoreComments botId={props.bot_id} />

        <StoreSimiliar botId={props.bot_id} />
      </div>
      <Fab
        style={{
          position: "fixed",
          bottom: 16,
          left: 16 + 56 + 16,
          backgroundColor: colors.accent2,
        }}
        onClick={() => {
          setShowCreateComment(true);
        }}
      >
        <Message style={{ fill: '#fff' }} />
      </Fab>
      <Fab
        style={{
          backgroundColor: added ? "#0f0" : colors.accent,
          position: "fixed",
          bottom: 16,
          left: 16,
        }}
        onClick={() => {
          let requestOptions2 = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
              botId: props.bot_id,
            }),
            redirect: "follow",
          };
          fetch(serverRoot + "/bot/subscribe", requestOptions2)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result));
              if (result.status === "success") {
                checkAdded();
              }
            })
            .catch((error) => console.log("error", error));
        }}
      >
        <LocalMallIcon />
      </Fab>
      <Fab
        style={{
          position: "fixed",
          bottom: 16 + 56 + 16,
          left: 16,
          backgroundColor: colors.accent2,
        }}
        onClick={() => {
          if (props.room_id !== undefined) {
            let requestOptions2 = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                botId: props.bot_id,
                roomId: props.room_id,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/bot/create_workership", requestOptions2)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.status === "success") {
                  alert("???????? ???? ???????????? ???? ?????? ?????????? ????.");
                }
              })
              .catch((error) => console.log("error", error));
          } else {
            setShowSpacesList(true);
          }
        }}
      >
        <Add style={{ fill: '#fff' }} />
      </Fab>
      {showCreateComment ? (
        <CreateCommentPage
          bot_id={props.bot_id}
          setCreateCommentRating={setCreateCommentRating}
          reateCommentRating={createCommentRating}
          onClose={() => {
            setShowCreateComment(false);
          }}
        />
      ) : null}
      {showSpacesList ? (
        <SpacesListPage
          bot_id={props.bot_id}
          can_inspect_rooms={true}
          onClose={() => {
            setShowSpacesList(false);
          }}
        />
      ) : null}
    </Dialog>
  );
}
