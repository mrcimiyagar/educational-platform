import { Dialog, Slide } from "@mui/material";
import "chartjs-plugin-datalabels";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import { setInTheGame } from "../../App";
import HomeAppbar from "../../components/HomeMain";
import Chat from "./chat";
import "./messenger.css";

export let reloadRoomsList = undefined;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function MessengerPage(props) {
  document.documentElement.style.overflow = "auto";

  const [open, setOpen] = React.useState(true);
  const [selectedChatId, setSelectedChatId] = React.useState(undefined);

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
    <div style={{ width: "100%", height: "100%" }}>
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
          zIndex: 2501,
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <HomeAppbar
          onClose={handleClose}
          selectedUserId={props.user_id}
          tabIndex={props.tab_index}
          setSelectedChatId={setSelectedChatId}
          selectedChatId={selectedChatId}
        />
      </Dialog>
      {selectedChatId !== undefined ? (
        <Chat
          onClose={() => {
            setSelectedChatId(undefined);
            setInTheGame(true);
          }}
          room_id={selectedChatId}
        />
      ) : null}
    </div>
  );
}
export default MessengerPage;
