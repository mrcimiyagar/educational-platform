import { createTheme, ThemeProvider } from '@material-ui/core';
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
import './App.css';
import { notifyUrlChanged } from './components/SearchEngineFam';
import AudioPlayer from './routes/pages/audioPlayer';
import Authentication from './routes/pages/authentication';
import Chat, {
  addMessageToList,
  replaceMessageInTheList,
} from './routes/pages/chat';
import CreateRoom from './routes/pages/createRoom';
import DeckPage from './routes/pages/deck';
import MessengerPage from './routes/pages/messenger';
import NotePage from './routes/pages/notes';
import PhotoViewer from './routes/pages/photoViewer';
import PollPage from './routes/pages/polls';
import Profile from './routes/pages/profile';
import RoomPage from './routes/pages/room';
import RoomsTree from './routes/pages/roomsTree';
import SearchEngine from './routes/pages/searchEngine';
import SearchEngineResults from './routes/pages/searchEngineResults';
import Store from './routes/pages/store';
import StoreAds from './routes/pages/storeAds';
import StoreBot from './routes/pages/storeBot';
import VideoPlayer from './routes/pages/videoPlayer';
import SettingsPage from './routes/pages/settings';
import HomePage from './routes/pages/home';
import StartupSound from './sounds/startup.mp3';
import {
  ColorBase,
  colors,
  initTheme,
  me,
  setColors,
  setHomeRoomId,
  setHomeSpaceId,
  setMe,
  setToken,
  theme,
  token,
} from './util/settings';
import {
  ConnectToIo,
  leaveRoom,
  serverRoot,
  socket,
  useForceUpdate,
  validateToken,
} from './util/Utils';
import { ifServerOnline, pathConfig, setDisplay2, setWallpaper } from '.';
import {
  addMessageToList2,
  replaceMessageInTheList2,
} from './components/ChatEmbeddedInMessenger';
import {
  addMessageToList3,
  replaceMessageInTheList3,
} from './components/ChatEmbedded';
import { addNewChat, setLastMessage, updateChat } from './components/HomeMain';
import DesktopWallpaper from './images/roomWallpaper.png';
import GenerateLink from './routes/pages/generateLink';
import GenerateInvitation from './routes/pages/invitationsList';
import ConfigGuestAccount from './routes/pages/configGuestAccount';
import SpacesListPage from './routes/pages/spacesList';
import Sidebar from './containers/Sidebar';
const PouchDB = require('pouchdb').default

export let histPage = undefined
let setHistPage = undefined
export let routeTrigger = undefined
let setRouteTrigger = undefined
let popTrigger = undefined,
  setPopTrigger = undefined

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
  const urlSearchParams = new URLSearchParams(window.location.search)
  let entries = Object.fromEntries(urlSearchParams.entries())
  let counter = series.length - 1
  while (counter >= 0) {
    if (series[counter] in pages) {
      if (series[counter] === '/app/room' || (series[counter] === '/app/home' && entries.tab_index === '4')) {
        return true
      } else {
        return false
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
      if (series[counter] === '/app/home') {
        return true
      } else {
        return false
      }
    }
    counter--
  }
  return false
}
let series = []
let paramsSeries = []
let forceUpdate = undefined

export let popPage
export let gotoPage
export let gotoPageWithDelay

//if (window.innerWidth > 900) {
  gotoPage = (p, params) => {
    
    setInTheGame(false);
    forceUpdate();

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
    
    setTimeout(() => {
      setInTheGame(true);
      forceUpdate();
    }, 250);
  }

  gotoPageWithDelay = (p, params) => {
    series.push(p)
    paramsSeries.push(params)
    setTimeout(() => {
      setInTheGame(true);
      forceUpdate();
      setHistPage(p)
      setRouteTrigger(!routeTrigger)
      setTimeout(() => {
        setInTheGame(true);
        forceUpdate();
      }, 250);
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

  popPage = () => {
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

      window.history.replaceState(
        '',
        '',
        series[series.length - 1] + (query.length > 0 ? '?' : '') + query,
      );
      setTimeout(() => {
        setInTheGame(true);
        forceUpdate();
      }, 250);
      if (notifyUrlChanged !== undefined) notifyUrlChanged()
    }
  }
/*} else {
  gotoPage = (p, params) => {
    series.push(p)
    paramsSeries.push(params)

    let query = ''
    for (let key in params) {
      query += key + '=' + params[key] + '&'
    }
    if (query.length > 0) {
      query = query.substr(0, query.length - 1)
    }

    if (isTablet() || isDesktop()) {
      setHistPage(p)
    } else if (isMobile()) {
      setHistPage(p + (query.length > 0 ? '?' : '') + query)
    }

    if (isTablet() || isDesktop()) {
      window.history.pushState(
        '',
        '',
        p + (query.length > 0 ? '?' : '') + query,
      )
    }

    if (notifyUrlChanged !== undefined) notifyUrlChanged()
    forceUpdate()
  }

  gotoPageWithDelay = (p, params) => {
    series.push(p)
    paramsSeries.push(params)

    if (isTablet() || isDesktop()) {
      setTimeout(() => {
        setHistPage(p)
        setRouteTrigger(!routeTrigger)
      }, 125)
    } else if (isMobile()) {
      setTimeout(() => {
        setHistPage(p + (query.length > 0 ? '?' : '') + query)
      }, 125)
    }

    if (isTablet() || isDesktop()) {
      window.history.pushState(
        '',
        '',
        p + (query.length > 0 ? '?' : '') + query,
      )
    }

    if (notifyUrlChanged !== undefined) notifyUrlChanged()
    forceUpdate()
  }

  popPage = () => {
    setPopTrigger(!popTrigger)
    if (series.length > 1) {
      series.pop()
      paramsSeries.pop()
      
      setHistPage(series[series.length - 1])

      if (isTablet() || isDesktop()) {

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
      }
    }
    setTimeout(() => {
      setInTheGame(true);
      forceUpdate();
    }, 250);
    
    if (notifyUrlChanged !== undefined) notifyUrlChanged()
  }
}*/

function HistController() {
  const history = useHistory()

  useEffect(() => {
    history.push(histPage)
  }, [histPage])

  useEffect(() => {
    history.goBack()
  }, [popTrigger])

  return <div />
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
    forceUpdate();
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
  '/app/generate_invite_link': GenerateLink,
  '/app/generate_invitation': GenerateInvitation,
  '/app/spaces_list': SpacesListPage
}
let pages = {
  '/app/store': Store,
  '/app/home': MessengerPage,
  '/app/room': RoomPage,
  '/app/searchengine': SearchEngine,
  '/app/auth': Authentication,
  '/app/use_invitation': ConfigGuestAccount
}

export let setDialogOpen = null
export let registerDialogOpen = (setOpen) => {
  setDialogOpen = setOpen
}

export let animatePageChange = undefined

PouchDB.plugin(require('pouchdb-upsert'))
PouchDB.plugin(require('pouchdb-quick-search'))
PouchDB.plugin(require('pouchdb-find').default)
export let db = new PouchDB('SkyDime')

export let cacheMessage = (msg) => {
  msg.type = 'message'
  db.putIfNotExists('message_' + msg.id, msg)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchMessagesOfRoom = async (roomId) => {
  let data = await db.find({
    selector: { roomId: { $eq: roomId }, type: { $eq: 'message' } },
  })
  data = data.docs
  data.forEach((message) => {
    message.time = Number(message.time)
  })
  function compare(a, b) {
    if (a.time < b.time) {
      return -1
    }
    if (a.time > b.time) {
      return 1
    }
    return 0
  }
  data.sort(compare)
  return data
}

export let cacheChat = (chat) => {
  chat.type = 'chat'
  db.putIfNotExists('chat_' + chat.id, chat)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchChats = async () => {
  let data = await db.find({
    selector: { type: { $eq: 'chat' } },
  })
  data = data.docs
  data.forEach((chat) => {
    if (chat.lastMessage === undefined) {
      chat.lastMessage = {time: 0};
    }
    chat.lastMessage.time = Number(chat.lastMessage.time)
  })
  function compare(a, b) {
    if (a.lastMessage.time < b.lastMessage.time) {
      return -1
    }
    if (a.lastMessage.time > b.lastMessage.time) {
      return 1
    }
    return 0
  }
  data.sort(compare)
  return data
}

export let cacheSpace = (space) => {
  space.type = 'space';
  db.putIfNotExists('space_' + space.id, space)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchSpaces = async () => {
  let data = await db.find({
    selector: { type: { $eq: 'space' } },
  })
  data = data.docs
  return data
}

export let cacheRoom = (room) => {
  room.type = 'room';
  db.putIfNotExists('room_' + room.id, room)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchRooms = async () => {
  let data = await db.find({
    selector: { type: { $eq: 'room' } },
  })
  data = data.docs
  return data
}

export let fetchRoom = async (roomId) => {
  let data = await db.find({
    selector: { type: { $eq: 'room' }, id: { $eq: roomId } },
  })
  data = data.docs
  if (data.length === 0) return {};
  else return data[0];
}

export let cacheMembership = (membership) => {
  membership.type = 'membership';
  db.putIfNotExists('membership_' + membership.id, membership)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchMemberships = async () => {
  let data = await db.find({
    selector: { type: { $eq: 'membership' } },
  })
  data = data.docs
  return data
}

export let fetchMembership = async (roomId) => {
  let data = await db.find({
    selector: { type: { $eq: 'membership' }, roomId: { $eq: roomId } },
  })
  data = data.docs
  if (data.length === 0) return {};
  else return data[0];
}

export let cacheMe = (me) => {
  me.type = 'me';
  db.putIfNotExists('me', me)
    .then(function (res) {})
    .catch(function (err) {})
}

export let fetchMe = async () => {
  let data = await db.find({
    selector: { type: { $eq: 'me' } },
  })
  data = data.docs
  if (data.length === 0) return {};
  else return data[0];
}

let InnerApp = (props) => {
  return (
    <main>
      <Switch>
        <Route path="/app/auth" component={Authentication}/>
        <Route path="/app/home" component={MessengerPage} />
        <Route path="/app/store" component={Store}/>
        <Route path="/app/room" component={RoomPage}/>
        <Route path="/app/searchengine" component={SearchEngine}/>
        <Route path="/app/chat" component={Chat}/>
        <Route path="/app/generate_invite_link" component={GenerateLink}/>
        <Route path="/app/generate_invitation" component={GenerateInvitation}/>
        <Route path="/app/use_invitation" component={ConfigGuestAccount} />        
        <Route path="/app/storebot" component={StoreBot} />
        <Route path="/app/storeads" component={StoreAds} />
        <Route path="/app/photoviewer" component={PhotoViewer} />
        <Route path="/app/poll" component={PollPage} />
        <Route path="/app/notes" component={NotePage} />
        <Route path="/app/deck" component={DeckPage} />
        <Route path="/app/searchengineresults" component={SearchEngineResults}/>
        <Route path="/app/userprofile" component={Profile} />
        <Route path="/app/createroom" component={CreateRoom} />
        <Route path="/app/roomstree" component={RoomsTree} />
        <Route path="/app/audioplayer" component={AudioPlayer} />
        <Route path="/app/settings" component={SettingsPage} />
        <Route path="/app/videoplayer" component={VideoPlayer} />
        <Route path="/app/spaces_list" component={SpacesListPage} />
      </Switch>
    </main>
  )
}

const rand = () => {
  return Math.random().toString(36).substr(2);
};

const randId = () => {
  return rand() + rand();
};

export let inTheGame, setInTheGame;
export let uploadingFiles, setUploadingFiles;
export let markFileAsUploading = (roomId, file) => {
  if (uploadingFiles[roomId] === undefined) uploadingFiles[roomId] = {};
  let id = randId();
  file.message.id = id;
  uploadingFiles[roomId][id] = file;
  return id;
}
export let markFileAsUploaded = (roomId, id) => {
  if (uploadingFiles[roomId] === undefined) uploadingFiles[roomId] = {};
  delete uploadingFiles[roomId][id];
}

let MainAppContainer;

export let isOnline = true;

//if (window.innerWidth > 900) {
  MainAppContainer = (props) => {
    
    window.onunload = () => leaveRoom(() => {});
    window.onbeforeunload = () => leaveRoom(() => {});

    console.warn = () => {};
    ;[inTheGame, setInTheGame] = React.useState(false);
    setToken(localStorage.getItem('token'));
    setHomeSpaceId(localStorage.getItem('homeSpaceId'));
    setHomeRoomId(localStorage.getItem('homeRoomId'));
    forceUpdate = useForceUpdate();
    let [hp, setHp] = React.useState();
    let [opacity, setOpacity] = React.useState(0);
    ;[routeTrigger, setRouteTrigger] = React.useState(false);
    ;[uploadingFiles, setUploadingFiles] = React.useState({});
    setHistPage = setHp;
    histPage = hp;
    animatePageChange = () => {
      setOpacity(0);
      setTimeout(() => {
        setOpacity(1);
      }, 250);
    }
    useEffect(() => {
      if (histPage === '/app/searchengine') {
        setWallpaper({ type: 'color', color: colors.accentDark });
      }
    }, [histPage]);
    window.onpopstate = function (event) {
      if (setDialogOpen !== null) {
        setDialogOpen(false);
      }
      setTimeout(popPage, 250);
    }
    let P = undefined;
    let D = undefined;
    let pQuery = undefined;
    let dQuery = undefined;
    if (series[series.length - 1] in pages) {
      P = pages[series[series.length - 1]];
      pQuery = paramsSeries[paramsSeries.length - 1];
    } else {
      if (series[series.length - 1] in dialogs) {
        D = dialogs[series[series.length - 1]];
        dQuery = paramsSeries[paramsSeries.length - 1];
        let counter = series.length - 2;
        while (counter >= 0) {
          if (series[counter] in pages) {
            P = pages[series[counter]];
            pQuery = paramsSeries[counter];
            break;
          }
          counter--;
        }
      }
    }
    useEffect(() => {
      setDisplay2('none');
    }, []);
    useEffect(() => {
    ifServerOnline(
      () => {
        isOnline = true;
        ConnectToIo(localStorage.getItem('token'), () => {
          socket.off('message-added');
          socket.on('message-added', ({ msgCopy }) => {
            if (me.id !== msgCopy.authorId) {
              addMessageToList(msgCopy);
              addMessageToList2(msgCopy);
              addMessageToList3(msgCopy);
              setLastMessage(msgCopy);
              let requestOptions3 = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  roomId: msgCopy.roomId,
                }),
                redirect: 'follow',
              };
              fetch(serverRoot + '/chat/get_chat', requestOptions3)
                .then((response) => response.json())
                .then((result) => {
                  updateChat(result.room);
                });
            }
          })
          socket.off('chat-created');
          socket.on('chat-created', ({ room }) => {
            addNewChat(room);
          })
          socket.off('message-seen');
          socket.on('message-seen', ({ messages }) => {
            messages.forEach((msg) => replaceMessageInTheList(msg));
            messages.forEach((msg) => replaceMessageInTheList2(msg));
            messages.forEach((msg) => replaceMessageInTheList3(msg));
          })
        });
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            redirect: 'follow',
          };
          fetch(serverRoot + '/auth/get_me', requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result));
              if (result.user !== undefined && result.user !== null) {
                setMe(result.user);
                cacheMe(result.user);
              }
              else {
                fetchMe().then(m => {
                  setMe(m);
                });
              }
            })
            .catch((error) => console.log('error', error));
    
          let query = window.location.search;
          let params = {};
          if (query !== undefined && query !== null) {
            if (query.length > 1) {
              query = query.substr(1);
            }
            let querySep = query.split('&');
            querySep.forEach((part) => {
              let keyValue = part.split('=');
              params[keyValue[0]] = keyValue[1];
            })
          }
    
          validateToken(token, (result) => {
            if (result) {
              animatePageChange();
              if (
                window.location.pathname === '/' ||
                window.location.pathname === ''
              ) {
                gotoPage('/app/home', {tab_index: 0});
              } else {
                gotoPage(window.location.pathname, params);
              }
            } else {
              animatePageChange();
              gotoPage('/app/auth', {});
            }
          })
          
          setTimeout(() => {
            setInTheGame(true)
          }, 1000)
    
          var audio = new Audio(StartupSound);
          audio.play();
      },
      () => {
        isOnline = false;
        fetchMe().then(m => {
          setMe(m);
          let query = window.location.search;
        let params = {};
        if (query !== undefined && query !== null) {
          if (query.length > 1) {
            query = query.substr(1);
          }
          let querySep = query.split('&');
          querySep.forEach((part) => {
            let keyValue = part.split('=');
            params[keyValue[0]] = keyValue[1];
          })
        }
          animatePageChange();
          if (
            window.location.pathname === '/' ||
            window.location.pathname === ''
          ) {
            gotoPage('/app/home', {tab_index: 0});
          } else {
            gotoPage(window.location.pathname, params);
          }
        });
      });
    }, []);

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
        <ColorBase/>
        <DesktopDetector/>
        <Sidebar/>
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
    );
  }
/*} else {
  MainAppContainer = (props) => {
    console.warn = () => {};
    ;[inTheGame, setInTheGame] = React.useState(false);

    setToken(localStorage.getItem('token'));
    setHomeSpaceId(localStorage.getItem('homeSpaceId'));
    setHomeRoomId(localStorage.getItem('homeRoomId'));
    ConnectToIo(localStorage.getItem('token'), () => {
      socket.off('message-added');
      socket.on('message-added', ({ msgCopy }) => {
        if (me.id !== msgCopy.authorId) {
          addMessageToList(msgCopy);
          addMessageToList2(msgCopy);
          addMessageToList3(msgCopy);
          setLastMessage(msgCopy);
          let requestOptions3 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              roomId: msgCopy.roomId,
            }),
            redirect: 'follow',
          }
          fetch(serverRoot + '/chat/get_chat', requestOptions3)
            .then((response) => response.json())
            .then((result) => {
              updateChat(result.room);
            })
        }
      })
      socket.off('chat-created');
      socket.on('chat-created', ({ room }) => {
        addNewChat(room);
      })
      socket.off('message-seen');
      socket.on('message-seen', ({ messages }) => {
        messages.forEach((msg) => replaceMessageInTheList(msg));
        messages.forEach((msg) => replaceMessageInTheList2(msg));
        messages.forEach((msg) => replaceMessageInTheList3(msg));
      })
    });

    forceUpdate = useForceUpdate();

    let [hp, setHp] = React.useState();
    setHistPage = setHp;
    histPage = hp;
    ;[routeTrigger, setRouteTrigger] = React.useState(false);
    ;[popTrigger, setPopTrigger] = React.useState(false);
    let [opacity, setOpacity] = React.useState(0);

    animatePageChange = () => {
      setOpacity(0);
      setTimeout(() => {
        setOpacity(1);
      }, 250)
    };

    useEffect(() => {
      setDisplay2('none');
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        redirect: 'follow',
      };
      fetch(serverRoot + '/auth/get_me', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          if (result.user !== undefined && result.user !== null) {
            setMe(result.user);
          }
        })
        .catch((error) => console.log('error', error));

      validateToken(token, (result) => {
        if (result) {
          animatePageChange();
          if (
            window.location.pathname === '/' ||
            window.location.pathname === ''
          ) {
            gotoPage('/app/home', {tab_index: 0});
          } else {
            const urlSearchParams = new URLSearchParams(window.location.search);
            let params = Object.fromEntries(urlSearchParams.entries());
            gotoPage(window.location.pathname, params);
          }
        } else {
          animatePageChange();
          gotoPage('/app/auth', {});
        }
      })
      
      setTimeout(() => {
        setInTheGame(true)
      }, 1000)

      var audio = new Audio(StartupSound);
      audio.play();
    }, [])

    return (
      <BrowserRouter>
        <div
          style={{
            width: window.innerWidth + 'px',
            minHeight: '100vh',
            height: '100vh',
            maxHeight: '100vh',
            direction: 'rtl',
          }}
        >
          <ColorBase/>
          <DesktopDetector />
          <Sidebar/>
          <HistController histPage={histPage} />
          <Switch>
            <Route path="/app">
              <InnerApp />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}*/

export default MainAppContainer;