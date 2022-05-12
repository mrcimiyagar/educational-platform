import {
  AppBar,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { Add, ArrowForward, Done, Search } from "@material-ui/icons";
import React, { useEffect } from "react";
import {
  isDesktop,
  isMobile,
  isTablet,
  popPage,
  setBottomSheetContent,
  setBSO,
  setOnBsClosed,
} from "../../App";
import { colors, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BotInfoPage(props) {

  const forceUpdate = useForceUpdate();

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
    fetch(serverRoot + "/bot/get_bot_info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.botSecret !== undefined) {
          props.setBotSecret(result.botSecret);
          props.forceUpdate();
          forceUpdate();
        }
      });
  }, []);

  const handleClose = () => {
    setBSO(false);
    setTimeout(() => {
      setBottomSheetContent(null);
      props.onClose();
    }, 250);
  };

  useEffect(() => {
    setOnBsClosed(handleClose);
    setBottomSheetContent(
      <div style={{ width: "100%", height: 450, direction: "rtl" }}>
        <Fab
          style={{
            zIndex: 99999,
            position: "absolute",
            left: "calc(50% - 150px)",
            transform: "translate(-50%, 47px)",
            backgroundColor: colors.accent,
          }}
          onClick={handleClose}
        >
          <Done />
        </Fab>
        <Paper
          style={{
            borderRadius: "24px 24px 0 0",
            width: "100%",
            height: "calc(100% - 75px)",
            position: "absolute",
            top: 100,
            left: 0,
            background: colors.primaryMedium,
            backdropFilter: colors.blur,
          }}
        >
          <div
            style={{
              direction: "rtl",
              padding: 24,
              width: "100%",
              height: "100%",
            }}
          >
            <br />
            <Typography
              id={"botTitle"}
              style={{
                color: colors.accent,
                textAlign: "right",
                justifyContent: "right",
                alignItems: "right",
                width: "calc(100% - 48px)",
                marginTop: 24,
                marginLeft: 24,
                marginRight: 24,
                fontSize: 14
              }}
            >
              آی دی بات : <Typography style={{color: colors.text, fontSize: 10}} onClick={() => {navigator.clipboard.writeText(props.botSecret.botId); alert('کپی شد')}}><b>{props.botSecret.botId}</b></Typography>
            </Typography>
            <br />
            <br />
            <Typography
              id={"botUsername"}
              style={{
                color: colors.accent,
                textAlign: "right",
                justifyContent: "right",
                alignItems: "right",
                width: "calc(100% - 48px)",
                marginTop: 24,
                marginLeft: 24,
                marginRight: 24,
                fontSize: 14
              }}
            >
              توکن بات : <Typography style={{color: colors.text, fontSize: 10}} onClick={() => {navigator.clipboard.writeText(props.botSecret.token); alert('کپی شد')}}><b>{props.botSecret.token}</b></Typography>
            </Typography>
          </div>
        </Paper>
      </div>
    );
    setBSO(true);
  }, []);
  return null;
}
