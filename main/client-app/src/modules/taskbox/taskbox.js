import React from "react";
import { pathConfig } from "../../index";
import { colors, me } from "../../util/settings";
import "./style.css";
import Dialog from "@material-ui/core/Dialog";
import { AppBar, IconButton, Slide, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward, Close } from "@material-ui/icons";

let TRANSLATION_TABLE = {
  "Add another lane": "افزودن لیست",
  "Click to add card": "افزودن کارت",
  "Delete lane": "پاک نمودن لیست",
  "Lane actions": "عملیات لیست",
  button: {
    "Add lane": "افزودن",
    "Add card": "افزودن",
    Cancel: "لغو",
  },
  placeholder: {
    title: "عنوان",
    description: "توضیحات",
    label: "برچسب",
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export let TaskBox = (props) => {
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
          backdropFilter: colors.blur
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
        تسک بورد
      </Typography>
        </Toolbar>
      </AppBar>
      <div
        id={props.id}
        style={{
          height: "calc(100% - 56px)",
          width: '100%',
          marginTop: 64,
          position: "relative",
          zIndex: 99999,
        }}
      >
        <iframe
          allowTransparency={true}
          onLoad={() =>
            window.frames["task-board-frame"].postMessage(
              {
                sender: "main",
                action: "init",
                username: me.username,
                password: me.username,
              },
              pathConfig.taskBoard
            )
          }
          id={"task-board-frame"}
          name="task-board-frame"
          src={pathConfig.taskBoard + "/login"}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
        ></iframe>
      </div>
    </Dialog>
  );
};
