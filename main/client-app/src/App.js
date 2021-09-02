import { ThemeProvider } from '@material-ui/core'
import React, { useEffect } from "react"
import './App.css'
import { notifyUrlChanged } from "./components/SearchEngineFam"
import AudioPlayer from "./routes/pages/audioPlayer"
import Auth4 from "./routes/pages/auth4"
import Chat from "./routes/pages/chat"
import CreateRoom from "./routes/pages/createRoom"
import DeckPage from "./routes/pages/deck"
import MessengerPage from "./routes/pages/messenger"
import NotePage from "./routes/pages/notes"
import P2pCall from './routes/pages/p2pCall'
import PhotoViewer from "./routes/pages/photoViewer"
import PollPage from "./routes/pages/polls"
import Profile from './routes/pages/profile'
import RoomPage from "./routes/pages/room"
import RoomsTree from "./routes/pages/roomsTree"
import SearchEngine from "./routes/pages/searchEngine"
import SearchEngineResults from './routes/pages/searchEngineResults'
import Store from "./routes/pages/store"
import StoreAds from "./routes/pages/storeAds"
import StoreBot from "./routes/pages/storeBot"
import VideoPlayer from './routes/pages/videoPlayer'
import SettingsPage from './routes/pages/settings'
import StartupSound from './sounds/startup.mp3'
import { setMe, setToken, theme, token } from "./util/settings"
import { ConnectToIo, serverRoot, useForceUpdate } from "./util/Utils"
import SettingsRoomBackPhoto from './components/RoomBackgroundPhoto'

export let histPage = null, setHp = null;

export let sizeMode;
let setSizeMode;
let currentStaticPage = ''
export let isDesktop = () => {
  return sizeMode === 'desktop'
}
export let isTablet = () => {
  return sizeMode === 'tablet'
}
export let isMobile = () => {
  return sizeMode === 'mobile'
}
export let isInRoom = () => {
  return histPage === '/app/room'
}
let initBackupCode = Math.random()
let backups = {initBackupCode: <MessengerPage/>}
let series = [{path: '/app/messenger', backup: initBackupCode}];
let paramsSeries = [{}];
let forceUpdate = undefined

export let gotoPage = (p, params) => {
  series.push({path: p, backup: undefined})
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
  series.push({path: p, backup: undefined})
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
    setHp(series[series.length - 1].path)

    let params = paramsSeries[paramsSeries.length - 1]
    let query = ''
    for (let key in params) {
      query += key + '=' + params[key] + '&'
    }
    if (query.length > 0) {
      query = query.substr(0, query.length - 1)
    }

    window.history.pushState('', '', series[series.length - 1].path + (query.length > 0 ? '?' : '') + query);
    if (notifyUrlChanged !== undefined) notifyUrlChanged()
  }
}

let DesktopDetector = () => {
  [sizeMode, setSizeMode] = React.useState(window.innerWidth > 1400 ? 'desktop' : window.innerWidth > 900 ? 'tablet' : 'mobile')
  window.onresize = () => {
    setSizeMode(window.innerWidth > 1400 ? 'desktop' : window.innerWidth > 900 ? 'tablet' : 'mobile')
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
  '/app/audioplayer': AudioPlayer,
  '/app/p2pCall': P2pCall,
  '/app/settings': SettingsPage,
  '/app/settingsroombackphoto': SettingsRoomBackPhoto,
  '/app/videoplayer': VideoPlayer
}
let pages = {
  '/app/store': Store,
  '/app/messenger': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchengine': SearchEngine,
  '/app/auth': Auth4,
}

let setDialogOpen = null
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen
}

export let animatePageChange = undefined

let P = undefined
let D = undefined
let pQuery = undefined
let dQuery = undefined
let seriesTop = undefined
let seriesDown = undefined

let loadPage = () => {

    if (series[0] !== undefined && series[0].path in dialogs) {
      backups[initBackupCode] = <MessengerPage/>
      series.unshift({path: '/app/messenger', backup: initBackupCode})
      paramsSeries.unshift({})
    }

    seriesTop = series[series.length - 1]
    let seriesParamsTop = paramsSeries[paramsSeries.length - 1]
    seriesDown = series[series.length - 2]
    let seriesParamsDown = paramsSeries[paramsSeries.length - 2]
    
    let counter = series.length - 3

    while (seriesDown !== undefined && !(seriesDown.path in pages)) {
      seriesDown = series[counter]
      seriesParamsDown = paramsSeries[counter]
      counter--
    }

    if (seriesTop.path in pages || seriesTop.path === seriesDown.path) {
      seriesDown = undefined
    }

    if (seriesTop === undefined && seriesDown === undefined) {
      P = pages['/app/messenger']
      pQuery = {}
      P = <P {...pQuery}/>
      let backupCode = "id" + Math.random().toString(16).slice(2)
      backups[backupCode] = P
      series = [{path: '/app/messenger', backup: backupCode}]
      paramsSeries = [pQuery]
    }
    else if (seriesTop !== undefined && seriesDown === undefined) {
      if (seriesTop.backup !== undefined) {
        D = backups[seriesTop.backup]
      }
      else {
        if (seriesTop.path in pages) {
          D = pages[seriesTop.path]
        }
        else if (seriesTop.path in dialogs) {
          D = dialogs[seriesTop]
        }
        dQuery = seriesParamsTop
        D = <D {...dQuery}/>
        let backupCode = "id" + Math.random().toString(16).slice(2)
        backups[backupCode] = D
        seriesTop.backup = backupCode
      }
    }
    else if (seriesTop !== undefined && seriesDown !== undefined) {
      if (seriesDown.backup !== undefined) {
        P = backups[seriesDown.backup]
        alert('using backup...')
      }
      else {
        alert('reloading...')
        if (seriesDown.path in pages) {
          P = pages[seriesDown.path]
        }
        else if (seriesDown.path in dialogs) {
          P = dialogs[seriesDown.path]
        }
        dQuery = seriesParamsDown
        P = <P navigator={navigator} {...dQuery}/>
        let backupCode = "id" + Math.random().toString(16).slice(2)
        backups[backupCode] = P
        seriesDown.backup = backupCode
      }

      if (seriesTop.backup !== undefined) {
        D = backups[seriesTop.backup]
      }
      else {
        if (seriesTop.path in pages) {
          D = pages[seriesTop.path]
        }
        else if (seriesTop.path in dialogs) {
          D = dialogs[seriesTop.path]
        }
        dQuery = seriesParamsTop
        D = <D navigator={navigator} {...dQuery}/>
        let backupCode = "id" + Math.random().toString(16).slice(2)
        backups[backupCode] = D
        seriesTop.backup = backupCode
      }
    }
}

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

  [histPage, setHp] = React.useState(window.location.pathname)

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

    series = [{path: window.location.pathname, backup: undefined}]
    paramsSeries = [params]

    animatePageChange()
  }, [])

  loadPage()
  
  window.onpopstate = function(event) {
      if (setDialogOpen !== null) {
        setDialogOpen(false)
      }
      setTimeout(popPage, 250);
  }

  useEffect(() => {
    let audio = new Audio(StartupSound)
    audio.play()
  }, [])

  if (series.length < 2) {
    P = undefined
  }

  if (seriesDown !== undefined && seriesTop !== undefined && seriesTop.path === seriesDown.path) {
    P = undefined
  }

  if ((seriesDown !== undefined && seriesDown.path in pages) && (seriesTop !== undefined && seriesTop.path in pages)) {
    seriesDown = undefined
    P = undefined
  }

  alert(JSON.stringify(series))

  return (
    <div style={{width: window.innerWidth + 'px', minHeight: '100vh', height: '100vh', maxHeight: '100vh', direction: 'rtl'}}>
      <DesktopDetector/>
      <div style={{width: '100%', height: '100%', opacity: opacity, transition: 'opacity .125s', direction: 'rtl'}}>
        <ThemeProvider theme={theme}>
          {P !== undefined ? [P] : null}
          {D !== undefined ? [D] : null}
        </ThemeProvider>
      </div>
    </div>
  );
}
