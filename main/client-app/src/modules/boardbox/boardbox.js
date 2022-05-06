import { AppBar, Dialog, IconButton, Slide, Toolbar } from "@material-ui/core";
import { ArrowForward, Close } from "@material-ui/icons";
import { colors } from "../../util/settings";
import React from "react";
import { pathConfig } from "../..";
import "./style.css";
import { Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export let BoardBox = (props) => {
  const [open, setOpen] = React.useState(true);
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: 'blur(10px)'
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
      <AppBar style={{backgroundColor: colors.primaryMedium, direction: 'rtl', height: 64}}>
        <Toolbar style={{paddingTop: 4}}>
      <IconButton
        onClick={() => {
          setOpen(false);
          setTimeout(() => {
            props.onClose();
          }, 250);
        }}
      >
        <ArrowForward style={{ fill: colors.oposText }} />
      </IconButton>
      <Typography style={{textAlign: 'right', justifyContent: 'right', alignItems: 'right', color: colors.oposText}}>
        وایت بورد
      </Typography>
        </Toolbar>
      </AppBar>
      <div
        id={props.id}
        style={{
          backgroundColor: "transparent",
          background: "transparent",
          height: "calc(100% - 56px)",
          marginTop: 64,
          width: "100%",
          position: "relative",
          zIndex: 99999,
        }}
      >
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <div className="maincontentdiv">
            {props.membership !== undefined && props.membership !== null ? (
              <iframe
                allowTransparency={true}
                name="board-frame"
                src={pathConfig.whiteBoard + `/boards/${props.roomId}`}
                frameborder="0"
                style={{
                  border: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              ></iframe>
            ) : null}
            {props.membership !== undefined &&
            props.membership !== null &&
            props.membership.canUseWhiteboard ? null : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
