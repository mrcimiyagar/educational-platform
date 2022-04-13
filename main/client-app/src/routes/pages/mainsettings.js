import { Dialog, Slide } from "@material-ui/core";
import "chartjs-plugin-datalabels";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import { setInTheGame } from "../../App";
import MainSettingsPanel from "../../components/MainSettingsPanel";
import "./messenger.css";

export let reloadRoomsList = undefined;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function MainSettings(props) {
  document.documentElement.style.overflow = "auto";

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setInTheGame(false);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        props.onClose();
      }, 250);
    }, 500);
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <MainSettingsPanel onClose={handleClose} onDeveloperModeClicked={() => {
        handleClose();
        setTimeout(() => {
          props.onDeveloperModeClicked();
        }, 1000);
      }} />
    </Dialog>
  );
}
