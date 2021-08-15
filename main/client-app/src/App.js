import React, {Component, Fragment, useEffect} from "react";
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
import Store from "./routes/pages/store";

let histPage = null, setHp = null;
export let drawerOpen = null, setDrawerOpen = null;

export let isDesktop;
let series = ['/app/messenger'];
let paramsSeries = [{}];

export let gotoPage = (p, params) => {
  series.push(p)
  paramsSeries.push(params)
  setHp(p)

  let query = ''
  for (let key in params) {
    query += key + '=' + params[key] + '&'
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1)
  }

  window.history.pushState('', '', p + '?' + query);
}

export let popPage = () => {
  if (series.length > 1) {
    series.pop()
    paramsSeries.pop()
    setHp(series[series.length - 1])
    let params = paramsSeries[paramsSeries.length - 1]

    

    window.history.pushState('', '', series[series.length - 1]);
  }
}

let DesktopDetector = (props) => {
  const theme = useTheme();
  isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  return <div/>;
}

export let roomId = 0;
export let setRoomId = (ri) => {
  if (ri === undefined || ri === null) return;
  roomId = ri;
}

let dialogs = {
  '/app/chat': Chat
}
let pages = {
  '/app/store': Store,
  '/app/messenger': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchEngine': SearchEngine
}

let setDialogOpen = null
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen
}

function MainApp(props) {

  [histPage, setHp] = React.useState(window.location.pathname)

  window.onpopstate = function(event) {
    if (event){
      if (setDialogOpen !== null) {
        setDialogOpen(false)
      }
      setTimeout(popPage, 250);
    }
  }

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

  let query = window.location.search
  let params = {}
  if (query !== undefined && query !== null) {
    if (query.length > 1) {
      query = query.substr(1)
    }
    let querySep = query.split('&')
    querySep.forEach(part => {
      let keyValue = part.split('=')
      params[keyValue[0]] = keyValue[1]
    })
  }
 
  return (
    <div style={{width: window.innerWidth + 'px', height: '100vh', direction: 'rtl'}}>
      <img src={RoomWallpaper} style={{marginRight: -16, position: 'fixed', width: 'calc(100% + 16px)', height: '100%', objectFit: 'cover'}}/>
      <ThemeProvider theme={theme}>
        {P !== undefined ? <P {...params}/> : null}
        {D !== undefined ? <D open={true}/> : null}
      </ThemeProvider>
    </div>
  );
}

export default ReactDOM.render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  document.getElementById("root")
);
