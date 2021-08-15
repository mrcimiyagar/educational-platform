import React, {Fragment, useEffect} from "react";
import {
  Card,
  CardBody
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import CircularProgressbar from "react-circular-progressbar";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import './messenger.css';

import {ConnectToIo, roothPath, validateToken, leaveRoom} from "../../util/Utils";
import {ColorBase, colors, setToken, token} from "../../util/settings";
import {toggleInvites, toggleRooms} from "../../containers/Sidebar";

import {isDesktop, gotoPage} from '../../App';
import HomeSearchbar from '../../components/HomeSearchbar'; 
import { Toolbar, AppBar } from "@material-ui/core";
import HomeAppbar from "../../components/HomeMain";

export let reloadRoomsList = undefined;

function MessengerPage(props) {

  setToken(localStorage.getItem('token'));
  
  document.documentElement.style.overflow = 'auto';

  ConnectToIo()
  
  return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
        <HomeAppbar/>
      </div>
  );
}
export default MessengerPage;
