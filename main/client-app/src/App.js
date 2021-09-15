import { ThemeProvider } from '@material-ui/core'
import React, { useEffect } from 'react'
import './App.css'
import { notifyUrlChanged } from './components/SearchEngineFam'
import AudioPlayer from './routes/pages/audioPlayer'
import Auth4 from './routes/pages/auth4'
import Chat, { addMessageToList, replaceMessageInTheList } from './routes/pages/chat'
import CreateRoom from './routes/pages/createRoom'
import DeckPage from './routes/pages/deck'
import MessengerPage from './routes/pages/messenger'
import NotePage from './routes/pages/notes'
import PhotoViewer from './routes/pages/photoViewer'
import PollPage from './routes/pages/polls'
import Profile from './routes/pages/profile'
import RoomPage from './routes/pages/room'
import RoomsTree from './routes/pages/roomsTree'
import SearchEngine from './routes/pages/searchEngine'
import SearchEngineResults from './routes/pages/searchEngineResults'
import Store from './routes/pages/store'
import StoreAds from './routes/pages/storeAds'
import StoreBot from './routes/pages/storeBot'
import VideoPlayer from './routes/pages/videoPlayer'
import SettingsPage from './routes/pages/settings'
import StartupSound from './sounds/startup.mp3'
import {
  ColorBase,
  colors,
  me,
  setMe,
  setToken,
  theme,
  token,
} from './util/settings'
import {
  ConnectToIo,
  serverRoot,
  socket,
  useForceUpdate,
  validateToken,
} from './util/Utils'
import { pathConfig, setWallpaper } from '.'
import { addMessageToList2 } from './components/ChatEmbeddedInMessenger'
import { addMessageToList3 } from './components/ChatEmbedded'
import { addNewChat, setLastMessage } from './components/HomeMain'

export let histPage = undefined
let setHistPage = undefined
export let routeTrigger = undefined
let setRouteTrigger = undefined

export let sizeMode
let setSizeMode
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
  let counter = series.length - 1
  while (counter >= 0) {
    if (series[counter] in pages) {
      if (series[counter] === '/app/room') {
        return true
      }
    }
    counter--
  }
  return false
}
export let isInMessenger = () => {
  let counter = series.length - 1
  while (counter >= 0) {
    if (series[counter] in pages) {
      if (series[counter] === '/app/messenger') {
        return true
      }
    }
    counter--
  }
  return false
}
let series = []
let paramsSeries = []
let forceUpdate = undefined

export let gotoPage = (p, params) => {
  series.push(p)
  paramsSeries.push(params)
  setHistPage(p)
  setRouteTrigger(!routeTrigger)

  let query = ''
  for (let key in params) {
    query += key + '=' + params[key] + '&'
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1)
  }

  window.history.pushState('', '', p + (query.length > 0 ? '?' : '') + query)
  if (notifyUrlChanged !== undefined) notifyUrlChanged()
  forceUpdate()
}

export let gotoPageWithDelay = (p, params) => {
  series.push(p)
  paramsSeries.push(params)
  setTimeout(() => {
    setHistPage(p)
    setRouteTrigger(!routeTrigger)
  }, 125)

  let query = ''
  for (let key in params) {
    query += key + '=' + params[key] + '&'
  }
  if (query.length > 0) {
    query = query.substr(0, query.length - 1)
  }

  window.history.pushState('', '', p + (query.length > 0 ? '?' : '') + query)
  if (notifyUrlChanged !== undefined) notifyUrlChanged()
}

export let popPage = () => {
  if (series.length > 1) {
    series.pop()
    paramsSeries.pop()
    setHistPage(series[series.length - 1])
    setRouteTrigger(!routeTrigger)

    let params = paramsSeries[paramsSeries.length - 1]
    let query = ''
    for (let key in params) {
      query += key + '=' + params[key] + '&'
    }
    if (query.length > 0) {
      query = query.substr(0, query.length - 1)
    }

    window.history.pushState(
      '',
      '',
      series[series.length - 1] + (query.length > 0 ? '?' : '') + query,
    )
    if (notifyUrlChanged !== undefined) notifyUrlChanged()
  }
}

let DesktopDetector = () => {
  ;[sizeMode, setSizeMode] = React.useState(
    window.innerWidth > 1400
      ? 'desktop'
      : window.innerWidth > 900
      ? 'tablet'
      : 'mobile',
  )
  window.onresize = () => {
    setSizeMode(
      window.innerWidth > 1400
        ? 'desktop'
        : window.innerWidth > 900
        ? 'tablet'
        : 'mobile',
    )
  }
  return <div />
}

export let roomId = 0
export let setRoomId = (ri) => {
  if (ri === undefined || ri === null) return
  roomId = ri
}

export let user = undefined
export let setUser = (ri) => {
  user = ri
}

export let query = ''
export let setQuery = (ri) => {
  query = ri
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
  '/app/settings': SettingsPage,
  '/app/videoplayer': VideoPlayer,
}
let pages = {
  '/app/store': Store,
  '/app/messenger': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchengine': SearchEngine,
  '/app/auth': Auth4,
}

export let setDialogOpen = null
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen
}

export let animatePageChange = undefined

export default function MainApp(props) {
  console.warn = () => {}
  setToken(localStorage.getItem('token'))
  ConnectToIo(localStorage.getItem('token'), () => {
    socket.off('message-added')
    socket.on('message-added', ({ msgCopy }) => {
      if (me.id !== msgCopy.authorId) {
        addMessageToList(msgCopy)
        addMessageToList2(msgCopy)
        addMessageToList3(msgCopy)
        setLastMessage(msgCopy)
      }
    })
    socket.off('chat-created')
    socket.on('chat-created', ({ room }) => {
      addNewChat(room)
    })
    socket.off('message-seen')
    socket.on('message-seen', ({ messages }) => {
      messages.forEach(msg => replaceMessageInTheList(msg));
    })
  })

  forceUpdate = useForceUpdate()

  let [hp, setHp] = React.useState()
  setHistPage = setHp
  histPage = hp
  ;[routeTrigger, setRouteTrigger] = React.useState(false)

  let [opacity, setOpacity] = React.useState(0)

  animatePageChange = () => {
    setOpacity(0)
    setTimeout(() => {
      setOpacity(1)
    }, 250)
  }

  useEffect(() => {
    if (histPage === '/app/messenger' || histPage === '/app/searchengine') {
      setWallpaper({ type: 'color', color: colors.accentDark })
    }
  }, [histPage])

  window.onpopstate = function (event) {
    if (setDialogOpen !== null) {
      setDialogOpen(false)
    }
    setTimeout(popPage, 250)
  }

  let P = undefined
  let D = undefined
  let pQuery = undefined
  let dQuery = undefined
  if (series[series.length - 1] in pages) {
    P = pages[series[series.length - 1]]
    pQuery = paramsSeries[paramsSeries.length - 1]
  } else {
    if (series[series.length - 1] in dialogs) {
      D = dialogs[series[series.length - 1]]
      dQuery = paramsSeries[paramsSeries.length - 1]
      let counter = series.length - 2
      while (counter >= 0) {
        if (series[counter] in pages) {
          P = pages[series[counter]]
          pQuery = paramsSeries[counter]
          break
        }
        counter--
      }
    }
  }

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      redirect: 'follow',
    }
    fetch(serverRoot + '/auth/get_me', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.user !== undefined && result.user !== null) {
          setMe(result.user)
        }
      })
      .catch((error) => console.log('error', error))

    let query = window.location.search
    let params = {}
    if (query !== undefined && query !== null) {
      if (query.length > 1) {
        query = query.substr(1)
      }
      let querySep = query.split('&')
      querySep.forEach((part) => {
        let keyValue = part.split('=')
        params[keyValue[0]] = keyValue[1]
      })
    }

    validateToken(token, (result) => {
      if (result) {
        animatePageChange()
        if (
          window.location.pathname === '/' ||
          window.location.pathname === ''
        ) {
          gotoPage('/app/messenger', {})
        } else {
          gotoPage(window.location.pathname, params)
        }
      } else {
        animatePageChange()
        gotoPage('/app/auth', {})
      }
    })

    var audio = new Audio(StartupSound);
    audio.play();
  }, [])

  return (
    <div
      style={{
        width: window.innerWidth + 'px',
        minHeight: '100vh',
        height: '100vh',
        maxHeight: '100vh',
        direction: 'rtl',
      }}
    >
      <ColorBase />
      <DesktopDetector />
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: opacity,
          transition: 'opacity .125s',
          direction: 'rtl',
        }}
      >
        <ThemeProvider theme={theme}>
          {P !== undefined ? <P {...pQuery} /> : null}
          {D !== undefined ? <D {...dQuery} open={true} /> : null}
        </ThemeProvider>
      </div>
    </div>
  )
}
