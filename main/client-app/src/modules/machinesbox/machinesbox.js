import {
  Avatar,
  Button,
  Fab,
  IconButton,
  ImageListItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Add, VideocamOff } from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import "chartjs-plugin-datalabels";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-sortable-tree/style.css";
import "react-table/react-table.css";
import { pathConfig } from "../..";
import { NotificationManager } from "../../components/ReactNotifications";
import { colors, token } from "../../util/settings";
import {
  registerEvent,
  room,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import "./style.css";
import {
  setPermissionState,
  togglePermissions,
} from "../../containers/Sidebar";
import { gotoPage, setBottomSheetContent, setBSO } from "../../App";
import ToolBoxIcon from "../../images/toolbox.png";
import { Card } from "reactstrap";

export let reloadUsersList = undefined;

let createNotification = (type, message, title) => {
  let cName = "";
  return () => {
    switch (type) {
      case "primary":
        NotificationManager.primary(
          "This is a notification!",
          "Primary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "secondary":
        NotificationManager.secondary(
          "This is a notification!",
          "Secondary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "info":
        NotificationManager.info("Info message", "", 3000, null, null, cName);
        break;
      case "success":
        NotificationManager.success(
          "Success message",
          "Title here",
          3000,
          null,
          null,
          cName
        );
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000,
          null,
          null,
          cName
        );
        break;
      case "error":
        NotificationManager.error(title, message, 3000, null, null, cName);
        break;
      default:
        NotificationManager.info("Info message");
        break;
    }
  };
};

export let usersRef = undefined;

export let MachinesBox = (props) => {
  let forceUpdate = useForceUpdate();
  let [currentHover, setCurrentHover] = React.useState(-1);
  let [video, setVideo] = React.useState({});
  let [audio, setAudio] = React.useState({});
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [bots, setBots] = React.useState([]);
  reloadUsersList = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/room/get_room_bots", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setUsers(result.bots);
      })
      .catch((error) => console.log("error", error));
  };

  let onlineDict = {};

  if (users !== undefined) {
    users.forEach((u) => {
      onlineDict[u.id] = true;
    });
  }

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100% - 32px)",
        marginTop: 32,
        position: "relative",
      }}
    >
      <div>
        <span
          style={{
            fontSize: 20,
            width: "calc(100% - 16px)",
            marginRight: 24,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <Typography variant={"body"} style={{ color: colors.text }}>
            بات ها ({users.length})
          </Typography>
        </span>
        <div style={{ height: "100%" }}>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div style={{ height: "auto", marginRight: 12, paddingTop: 24 }}>
              <div style={{ width: "100%", height: 16 }} />
              {users.map((user, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      direction: "rtl",
                      position: "relative",
                      width: "calc(100% - 16px)",
                      marginRight: 16,
                      display: "flex",
                    }}
                    onMouseEnter={() => setCurrentHover(index)}
                    onMouseLeave={() => setCurrentHover(-1)}
                  >
                    <Avatar
                      style={{ width: 24, height: 24 }}
                      alt={user.firstName + " " + user.lastName}
                      src={
                        serverRoot +
                        `/file/download_bot_avatar?token=${token}&botId=${user.id}`
                      }
                    />
                    <div style={{ marginRight: 16, marginTop: -2 }}>
                      <p
                        style={{
                          color: colors.text,
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {user.title}
                      </p>
                    </div>
                    {props.membership.canEditVideoSound &&
                    currentHover === index ? (
                      <div
                        style={{
                          marginTop: -12,
                          position: "absolute",
                          left: 0,
                          display: "flex",
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            window.frames["conf-video-frame"].postMessage(
                              {
                                sender: "main",
                                action: "switchVideoPermission",
                                targetId: user.id,
                                status: !video[user.id],
                              },
                              pathConfig.videoConfVideo
                            );
                            video[user.id] = !video[user.id];
                            setVideo(video);
                            forceUpdate();
                          }}
                        >
                          {video[user.id] ? (
                            <VideocamIcon style={{ fill: colors.text }} />
                          ) : (
                            <VideocamOff style={{ fill: colors.text }} />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            window.frames["conf-video-frame"].postMessage(
                              {
                                sender: "main",
                                action: "switchAudioPermission",
                                targetId: user.id,
                                status: !audio[user.id],
                              },
                              pathConfig.videoConfVideo
                            );
                            audio[user.id] = !audio[user.id];
                            setAudio(audio);
                            forceUpdate();
                          }}
                        >
                          {audio[user.id] ? (
                            <MicIcon style={{ fill: colors.text }} />
                          ) : (
                            <MicOffIcon style={{ fill: colors.text }} />
                          )}
                        </IconButton>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
      <Fab
        style={{
          position: "fixed",
          left: 48,
          bottom: 16,
          backgroundColor: colors.accent,
        }}
        onClick={() => {
          let requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            redirect: "follow",
          };
          fetch(serverRoot + "/bot/get_subscriptions", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result));
              if (result.status === "success") {
                setBots(result.bots);
                setBottomSheetContent(
                  <div
                    style={{
                      width: "100%",
                      height: 450,
                      direction: "rtl",
                      position: "relative",
                    }}
                  >
                    <Paper
                      style={{
                        borderRadius: "50%",
                        width: 112,
                        height: 112,
                        position: "fixed",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                      }}
                    >
                      <Avatar
                        style={{
                          width: "calc(100% - 32px)",
                          height: "calc(100% - 32px)",
                          backgroundColor: colors.field,
                          margin: 16,
                        }}
                        src={ToolBoxIcon}
                      />
                    </Paper>
                    <Paper
                      style={{
                        borderRadius: "24px 24px 0 0",
                        width: "100%",
                        height: "calc(100% - 56px)",
                        position: "absolute",
                        top: 56,
                        left: 0,
                        background: colors.backSide,
                        backdropFilter: colors.blur,
                        zIndex: 1,
                      }}
                    >
                      {bots.map((item) => {
                        return (
                          <ImageListItem
                            style={{
                              width: 84,
                              height: 112,
                              marginLeft: 12,
                              marginRight: 12,
                            }}
                            key={"store-bot-" + item.id}
                            cols={1}
                            onClick={() => {
                              let requestOptions2 = {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  token: token,
                                },
                                body: JSON.stringify({
                                  botId: item.id,
                                  roomId: props.roomId,
                                }),
                                redirect: "follow",
                              };
                              fetch(
                                serverRoot + "/bot/create_workership",
                                requestOptions2
                              )
                                .then((response) => response.json())
                                .then((result) => {
                                  console.log(JSON.stringify(result));
                                  if (result.status === "success") {
                                    alert("ربات با موفقیت به روم اضافه شد.");
                                  }
                                })
                                .catch((error) => console.log("error", error));
                            }}
                          >
                            <div
                              style={{
                                width: 84,
                                height: 84,
                                borderRadius: 16,
                                position: "relative",
                              }}
                            >
                              <img
                                src={
                                  "https://icon-library.com/images/bot-icon/bot-icon-5.jpg"
                                }
                                alt={item.title}
                                style={{
                                  opacity: 0.65,
                                  borderRadius: 16,
                                  marginTop: 16,
                                  width: 84,
                                  height: 84,
                                }}
                              />
                              <Card
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                                  borderRadius: 12,
                                  position: "absolute",
                                  top: 84,
                                  left: "calc(50% + 4px)",
                                  transform: "translateX(-50%)",
                                  width: "calc(100% - 32px)",
                                  height: 40,
                                  position: "absolute",
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                  }}
                                >
                                  {item.title}
                                </div>
                              </Card>
                            </div>
                          </ImageListItem>
                        );
                      })}
                    </Paper>
                  </div>
                );
                setBSO(true);
              }
            })
            .catch((error) => console.log("error", error));
        }}
      >
        <Add />
      </Fab>
    </div>
  );
};
