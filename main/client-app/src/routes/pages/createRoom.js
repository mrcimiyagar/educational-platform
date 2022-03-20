import { Fab, Paper, TextField, Toolbar, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Add from "@material-ui/icons/Add";
import ArrowForwardTwoTone from "@material-ui/icons/ArrowForwardTwoTone";
import React from "react";
import { gotoPage, isDesktop, popPage, registerDialogOpen } from "../../App";
import { colors, setToken, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import { pathConfig } from "../../index";
import {
  AppBar,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { reloadRoomsList } from "../../components/RoomTreeBox";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    width: "100%",
    position: "fixed",
    bottom: 0,
    zIndex: 1000,
    direction: "rtl",
  },
  textField: {
    "& .MuiFilledInput-root": {
      background: "rgba(255, 255, 255, 0.5)",
      borderRadius: 16,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontFamily: "mainFont",
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function CreateRoom(props) {
  setToken(localStorage.getItem("token"));

  let forceUpdate = useForceUpdate();
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };
  const [value, setValue] = React.useState('public');
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  
  let classes = useStyles();

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={
        isDesktop
          ? {
              style: {
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: isDesktop() ? 16 : 0,
              },
            }
          : {
              style: {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            }
      }
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{
        zIndex: 2501,
        backdropFilter: isDesktop() ? undefined : "blur(15px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: isDesktop() ? 450 : "100%",
          height: isDesktop() ? 300 : "100%",
          position: isDesktop() ? undefined : "fixed",
          top: isDesktop() ? undefined : 0,
          left: isDesktop() ? undefined : 0,
          direction: "rtl",
          overflow: "hidden",
        }}
      >
        <AppBar
          position={'fixed'}
          style={{
            width: isDesktop() ? 450 : undefined,
            paddingTop: 8,
            height: 64,
            backgroundColor: colors.primaryMedium,
            backdropFilter: "blur(10px)",
            borderRadius: 0,
          }}
        >
          <Toolbar style={{ marginTop: isDesktop() ? -8 : undefined }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleClose()}
            >
              <ArrowForwardTwoTone style={{ fill: "#fff" }} />
            </IconButton>
            <Typography
              variant="h6"
              style={{ color: "#fff", fontFamily: "mainFont", marginRight: 8 }}
            >
              ساخت روم
            </Typography>
          </Toolbar>
        </AppBar>
        <div
          style={{
            backgroundColor: colors.primaryDark,
            backdropFilter: "blur(10px)",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            marginTop: 56
          }}
        >
          <TextField
            className={classes.textField}
            id="roomCreationTitle"
            label="عنوان روم"
            variant="filled"
            style={{
              marginTop: isDesktop() ? 32 : 32,
              marginLeft: 32,
              marginRight: 32,
              width: "calc(100% - 64px)",
              color: "#fff",
            }}
          />
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">محدوده ی دسترسی</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="public"
              name="radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="عمومی"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="خصوصی"
              />
            </RadioGroup>
          </FormControl>
          <Fab
            color={"secondary"}
            style={{ marginRight: 32, marginTop: 24 }}
            variant="extended"
            onClick={() => {
              let requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  title: document.getElementById("roomCreationTitle").value,
                  chatType: "group",
                  spaceId: props.spaceId,
                  accessType: value
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/room/create_room", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result));
                  if (result.room !== undefined) {
                    reloadRoomsList()
                    handleClose();
                  }
                })
                .catch((error) => console.log("error", error));
            }}
          >
            <Add />
            ساخت روم
          </Fab>
        </div>
      </div>
    </Dialog>
  );
}
