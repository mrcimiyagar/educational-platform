import React, {Component, Fragment} from "react";
import ReactDOM from 'react-dom';
import {useTheme, useMediaQuery, ThemeProvider, colors, createTheme} from '@material-ui/core';
import './App.css';
import { theme } from "./util/settings";
import { Provider } from 'react-redux';
import store from './redux/main';
import MessengerPage from "./routes/pages/messenger";
import SearchEngine from "./routes/pages/searchEngine";
import RoomWallpaper from './images/roomWallpaper.png'
import RoomPage from "./routes/pages/room";
import Chat from "./routes/pages/chat";

let histPage, setHp;
export let drawerOpen = null, setDrawerOpen = null;
export let currNav = null, setCurrentNav = null;

export let isDesktop;
let series = ['/app/messenger'];

export let gotoPage = (p) => {
  series.push(p)
  setHp(p)
}

export let popPage = () => {
  series.pop()
  setHp(series[series.length - 1])
}

let DesktopDetector = (props) => {
  const theme = useTheme();
  isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  return <div/>;
}

export let roomId;
export function setRoomId(ri) {
  if (ri === undefined) return;
  roomId = ri;
}

let dialogs = {
  '/app/chat': Chat,
}
let pages = {
  '/app/messenger': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchEngine': SearchEngine
}

function MainApp(props) {

  document.documentElement.style.overflow = 'auto'

    const url = new URL(window.location.href)
    roomId = url.searchParams.get('room_id');

    [histPage, setHp] = React.useState('/app/messenger');
[currNav, setCurrentNav] = React.useState(0);
let P = undefined;
let D = undefined;
if (dialogs[histPage] !== undefined) {
    D = dialogs[histPage];
    P = pages[series[series.length - 2]];
    if (P === undefined) {
        P = pages[series[series.length - 3]]
    }
}
else {
    P = pages[histPage];
}

if (roomId === null) {
  return (
    <div style={{width: window.innerWidth + 'px', height: '100vh', direction: 'rtl'}}>
      <img src={RoomWallpaper} style={{position: 'fixed', width: '100%', height: '100%', objectFit: 'cover'}}/>
      <ThemeProvider theme={theme}>
          {P !== undefined ? <P /> : null}
          {D !== undefined ? <D open={true}/> : null}
      </ThemeProvider>
    </div>
);
}
else {
  return (
    <div style={{width: window.innerWidth + 'px', height: '100vh', direction: 'rtl'}}>
      <img src={RoomWallpaper} style={{position: 'fixed', width: '100%', height: '100%', objectFit: 'cover'}}/>
      <ThemeProvider theme={theme}>
          {P !== undefined ? <P roomId={roomId}/> : null}
          {D !== undefined ? <D open={true}/> : null}
      </ThemeProvider>
    </div>
);
}
}

export default ReactDOM.render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  document.getElementById("root")
);
