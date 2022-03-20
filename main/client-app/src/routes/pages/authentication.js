import { Fab, makeStyles, Typography } from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import React, { useEffect } from "react";
import { pathConfig, setWallpaper } from "../..";
import { db, setCurrentRoomId } from "../../App";
import WhiteColorTextField from "../../components/WhiteColorTextField";
import CloudIcon from "../../images/logo.png";
import {
  colors,
  setHomeRoomId,
  setHomeSpaceId,
  setMe,
  setToken,
} from "../../util/settings";
import { serverRoot, setConfig } from "../../util/Utils";
import Wallpaper from "../../images/login-wallpaper.jpg";
import { Dialog, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      background: "rgba(255, 255, 255, 0.5)",
    },
  },
}));

let registeredUsername = "";
let registeredPassword = "";

export default function Authentication(props) {
  let [boxShow, setBoxShow] = React.useState(false);
  let [register, setRegister] = React.useState(false);
  let [opacity, setOpacity] = React.useState(0.25);
  let classes = useStyles();
  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
      setBoxShow(true);
    }, 1000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (
        registeredUsername !== undefined &&
        registeredUsername !== null &&
        registeredUsername !== ""
      ) {
        let loginUsername = document.getElementById("loginUsername");
        loginUsername.value = registeredUsername;
      }
      if (
        registeredPassword !== undefined &&
        registeredPassword !== null &&
        registeredPassword !== ""
      ) {
        let loginPassword = document.getElementById("loginPassword");
        loginPassword.value = registeredPassword;
      }
    }, 0);
  }, [register]);
  return (
    <Dialog
      fullScreen
      open={true}
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        background: "transparent",
        backdropFilter: "blur(10px)",
        opacity: opacity,
        transition: 'opacity .5s'
      }}
      PaperProps={{
        style: {
          overflow: "auto",
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          background: "transparent",
        },
      }}
    >
      {register ? (
        <div
          style={{
            borderRadius: 32,
            height: "auto",
            paddingLeft: 32,
            paddingRight: 32,
            paddingtop: 16,
            paddingBottom: 16,
            background: "rgba(30, 37, 41, 0.5)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            transition: "top .5s",
            position: "absolute",
            top: boxShow ? "50%" : "150%",
            width: "100%",
            maxWidth: 340,
            transform: "translate(-50%, -50%)",
            left: "50%",
          }}
        >
          <div style={{ width: "100%", height: "auto" }}>
            <img
              src={CloudIcon}
              style={{
                width: 100,
                height: 100,
                fill: "#fff",
                transition: "top 1s",
                marginTop: -56,
              }}
            />
            <Typography
              variant={"h5"}
              style={{
                fontWeight: "bold",
                width: "100%",
                textAlign: "center",
                color: "#fff",
                marginTop: 24,
                transition: "top 1s",
              }}
            >
              به جامعه خوش آمدید
            </Typography>
          </div>
          <TextField
            className={classes.root}
            id="registerUsername"
            label="نام کاربری"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <TextField
            className={classes.root}
            type="password"
            id="registerPassword"
            label="رمز عبور"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <TextField
            className={classes.root}
            type="password"
            id="registerConfirmPass"
            label="تکرار رمز عبور"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <TextField
            className={classes.root}
            id="registerFirstName"
            label="نام"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <TextField
            className={classes.root}
            id="registerLastName"
            label="نام خانوادگی"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <div style={{ width: "auto", marginTop: 48 }}>
            <Fab
              color={"primary"}
              variant="extended"
              style={{ marginLeft: 24 }}
              onClick={() => {
                if (
                  document.getElementById("registerPassword").value !==
                  document.getElementById("registerConfirmPass").value
                ) {
                  alert("passwords does not match");
                  return;
                }
                let requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: document.getElementById("registerUsername").value,
                    password: document.getElementById("registerPassword").value,
                    firstName:
                      document.getElementById("registerFirstName").value,
                    lastName: document.getElementById("registerLastName").value,
                  }),
                  redirect: "follow",
                };
                fetch(serverRoot + "/auth/register", requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(JSON.stringify(result));
                    if (result.status === "success") {
                      registeredUsername =
                        document.getElementById("registerUsername").value;
                      registeredPassword =
                        document.getElementById("registerPassword").value;
                      document.getElementById("registerUsername").value = "";
                      document.getElementById("registerPassword").value = "";
                      document.getElementById("registerConfirmPass").value = "";
                      document.getElementById("registerFirstName").value = "";
                      document.getElementById("registerLastName").value = "";
                      setRegister(false);
                    } else {
                      alert(result.message);
                    }
                  })
                  .catch((error) => console.log("error", error));
              }}
            >
              <VpnKeyIcon sx={{ mr: 1 }} />
              <div style={{ marginRight: 8 }}>ثبت نام</div>
            </Fab>
            <Fab
              color={"primary"}
              variant="extended"
              onClick={() => setRegister(false)}
            >
              <ListAltIcon sx={{ mr: 1 }} />
              <div style={{ marginRight: 8 }}>برو به لاگین</div>
            </Fab>
          </div>
        </div>
      ) : (
        <div
          style={{
            borderRadius: 32,
            width: "100%",
            maxWidth: 340,
            textAlign: "center",
            paddingLeft: 32,
            paddingRight: 32,
            paddingtop: 32,
            paddingBottom: 32,
            background: "rgba(30, 37, 41, 0.5)",
            backdropFilter: "blur(10px)",
            justifyContent: "center",
            alignItems: "center",
            transition: "top .5s",
            position: "absolute",
            left: "50%",
            top: boxShow ? "50%" : "150%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div style={{ width: "100%", height: "auto" }}>
            <img
              src={CloudIcon}
              style={{
                width: 100,
                height: 100,
                fill: "#fff",
                transition: "top 1s",
                marginTop: -56,
              }}
            />
            <Typography
              variant={"h5"}
              style={{
                fontWeight: "bold",
                width: "100%",
                textAlign: "center",
                color: "#fff",
                marginTop: 24,
                transition: "top 1s",
              }}
            >
              به جامعه خوش آمدید
            </Typography>
          </div>
          <TextField
            className={classes.root}
            id="loginUsername"
            label="نام کاربری"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <TextField
            className={classes.root}
            type="password"
            id="loginPassword"
            label="رمز عبور"
            variant="filled"
            style={{ marginTop: 24, width: "100%", color: "#fff" }}
            InputProps={{
              style: {
                color: '#fff'
              }
            }}
          />
          <div style={{ width: "auto", marginTop: 48 }}>
            <Fab
              id={"loginBtn"}
              color={"primary"}
              variant="extended"
              style={{ marginLeft: 24 }}
              onClick={() => {
                let requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: document.getElementById("loginUsername").value,
                    password: document.getElementById("loginPassword").value,
                  }),
                  redirect: "follow",
                };
                fetch(serverRoot + "/auth/login", requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(JSON.stringify(result));
                    if (result.status === "success") {
                      localStorage.clear();
                      db.allDocs()
                        .then(function (result) {
                          return Promise.all(
                            result.rows.map(function (row) {
                              return db.remove(row.id, row.value.rev);
                            })
                          );
                        })
                        .then(function () {})
                        .catch(function (err) {});
                      setMe(result.user);
                      setToken(result.session.token);
                      setHomeSpaceId(result.space.id);
                      setHomeRoomId(result.room.id);
                      setCurrentRoomId(result.room.id);
                      localStorage.setItem("token", result.session.token);
                      localStorage.setItem("homeSpaceId", result.space.id);
                      localStorage.setItem("homeRoomId", result.room.id);
                      localStorage.setItem(
                        "username",
                        document.getElementById("loginUsername").value
                      );
                      localStorage.setItem(
                        "password",
                        document.getElementById("loginPassword").value
                      );
                      document.getElementById("loginUsername").value = "";
                      document.getElementById("loginPassword").value = "";
                      setConfig(result.account);
                      setBoxShow(false);
                      window.location.href = pathConfig.mainFrontend;
                    } else {
                      alert(result.message);
                    }
                  })
                  .catch((error) => console.log("error", error));
              }}
            >
              <VpnKeyIcon />
              <div style={{ marginRight: 8 }}>لاگین</div>
            </Fab>
            <Fab
              color={"primary"}
              variant="extended"
              onClick={() => setRegister(true)}
            >
              <ListAltIcon />
              <div style={{ marginRight: 8 }}>برو به ثبت نام</div>
            </Fab>
          </div>
        </div>
      )}
      <div style={{ width: "100%", height: 72 }} />
    </Dialog>
  );
}
