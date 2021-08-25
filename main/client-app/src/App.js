import React, {Component, Fragment, useEffect} from "react";
import ReactDOM from 'react-dom';
import {useTheme, useMediaQuery, ThemeProvider, colors, createTheme} from '@material-ui/core';
import './App.css';
import { setMe, setToken, theme, token } from "./util/settings";
import MessengerPage from "./routes/pages/messenger";
import SearchEngine from "./routes/pages/searchEngine";
import RoomWallpaper from './images/roomWallpaper.png'
import RoomPage from "./routes/pages/room";
import Chat from "./routes/pages/chat";
import Store from "./routes/pages/store";
import StoreBot from "./routes/pages/storeBot";
import StoreAds from "./routes/pages/storeAds";
import PhotoViewer from "./routes/pages/photoViewer";
import PollPage from "./routes/pages/polls";
import NotePage from "./routes/pages/notes";
import DeckPage from "./routes/pages/deck";
import StartupSound from './sounds/startup.mp3';
import Auth4 from "./routes/pages/auth4";
import SearchEngineResults from './routes/pages/searchEngineResults'
import Profile from './routes/pages/profile'
import VideoPlayer from './routes/pages/videoPlayer'
import { ConnectToIo, serverRoot, useForceUpdate } from "./util/Utils";
import CreateRoom from "./routes/pages/createRoom";
import { notifyUrlChanged } from "./components/SearchEngineFam";
import RoomsTree from "./routes/pages/roomsTree";
import AudioPlayer from "./routes/pages/audioPlayer";

let histPage = null, setHp = null;

export let isDesktop;
let setIsDesktop;
let series = ['/app/messenger'];
let paramsSeries = [{}];
let forceUpdate = undefined

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

  window.history.pushState('', '', p + (query.length > 0 ? '?' : '') + query);
  if (notifyUrlChanged !== undefined) notifyUrlChanged()
  forceUpdate()
}

export let gotoPageWithDelay = (p, params) => {
  series.push(p)
  paramsSeries.push(params)
  setTimeout(() => {
    setHp(p)
  }, 125);

  let query = ''
  for (let key in params) {
    query += key + '=' + params[key] + '&'
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1)
  }

  window.history.pushState('', '', p + (query.length > 0 ? '?' : '') + query);
  if (notifyUrlChanged !== undefined) notifyUrlChanged()
}

export let popPage = () => {

  if (series.length > 1) {
    series.pop()
    paramsSeries.pop()
    setHp(series[series.length - 1])

    let params = paramsSeries[paramsSeries.length - 1]
    let query = ''
    for (let key in params) {
      query += key + '=' + params[key] + '&'
    }
    if (query.length > 0) {
      query = query.substr(0, query.length - 1)
    }

    window.history.pushState('', '', series[series.length - 1] + (query.length > 0 ? '?' : '') + query);
    if (notifyUrlChanged !== undefined) notifyUrlChanged()
  }
}

let DesktopDetector = (props) => {
  const theme = useTheme();
  [isDesktop, setIsDesktop] = React.useState(window.innerWidth > 500)
  window.onresize = () => {
    setIsDesktop(window.innerWidth > 500)
  }
  return <div/>;
}

export let roomId = 0;
export let setRoomId = (ri) => {
  if (ri === undefined || ri === null) return;
  roomId = ri;
}

export let user = undefined;
export let setUser = (ri) => {
  user = ri;
}

export let query = '';
export let setQuery = (ri) => {
  query = ri;
}

let dialogs = {
  '/app/chat': Chat,
  '/app/storebot': StoreBot,
  '/app/storeads': StoreAds,
  '/app/photoviewer': PhotoViewer,
  '/app/poll': PollPage,
  '/app/notes': NotePage,
  '/app/deck': DeckPage,
  '/app/searchengineresults': SearchEngineResults,
  '/app/userprofile': Profile,
  '/app/createroom': CreateRoom,
  '/app/roomstree': RoomsTree,
  '/app/audioplayer': AudioPlayer
  
}
let pages = {
  '/app/store': Store,
  '/app/messenger': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchengine': SearchEngine,
  '/app/auth': Auth4,
  '/app/videoplayer': VideoPlayer
}

let setDialogOpen = null
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen
}

export let animatePageChange = undefined

let played = false

export default function MainApp(props) {

  setToken(localStorage.getItem('token'))
  ConnectToIo(localStorage.getItem('token'))

  forceUpdate = useForceUpdate()

  let [opacity, setOpacity] = React.useState(0)

  animatePageChange = () => {
    setOpacity(0)
    setTimeout(() => {
      setOpacity(1)
    }, 250)
  }

  useEffect(() => {

    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/auth/get_me", requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log(JSON.stringify(result));
          if (result.user !== undefined) {
            setMe(result.user)
          }
      })
      .catch(error => console.log('error', error));

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

    series = [window.location.pathname]
    paramsSeries = [params]

    animatePageChange()

  }, [])

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

  [histPage, setHp] = React.useState(window.location.pathname)

  window.onpopstate = function(event) {
      if (setDialogOpen !== null) {
        setDialogOpen(false)
      }
      setTimeout(popPage, 250);
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

  useEffect(() => {
    let audio = new Audio(StartupSound)
    audio.play()
  }, [])

  if (paramsSeries.length > 1) {
    params = paramsSeries[paramsSeries.length - 1]
  }

  return (
    <div style={{width: window.innerWidth + 'px', minHeight: '100vh', height: '100vh', maxHeight: '100vh', direction: 'rtl'}}>
      <DesktopDetector/>
      <div style={{width: '100%', height: '100%', opacity: opacity, transition: 'opacity .125s', direction: 'rtl'}}>
        <ThemeProvider theme={theme}>
          {P !== undefined ? <P {...params}/> : null}
          {D !== undefined ? <D {...params} open={true}/> : null}
        </ThemeProvider>
      </div>
    </div>
  );
}

