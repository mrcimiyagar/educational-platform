import "chartjs-plugin-datalabels";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import HomeAppbar from "../../components/HomeMain";
import './messenger.css';

export let reloadRoomsList = undefined;

function MessengerPage(props) {
  
  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

  document.documentElement.style.overflow = 'auto';

  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
      <HomeAppbar selectedChatId={props.room_id} selectedUserId={props.user_id} tabIndex={props.tab_index}/>
    </div>
  );
}
export default MessengerPage;
