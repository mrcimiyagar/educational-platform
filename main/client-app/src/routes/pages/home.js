import {
  AppBar,
  Avatar,
  createTheme,
  Drawer,
  Fab,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import Settings from '@material-ui/icons/Settings'
import React, { useEffect } from 'react'
import { pathConfig, setWallpaper } from '../..'
import {
  cacheMembership,
  cacheRoom,
  fetchMembership,
  fetchRoom,
  gotoPage,
  isDesktop,
  isInRoom,
  isMobile,
  isOnline,
  isTablet,
  setRoomId,
} from '../../App'
import ChatEmbedded from '../../components/ChatEmbedded'
import HomeIcon from '../../images/home.png'
import PeopleIcon from '../../images/people.png'
import BotIcon from '../../images/robot.png'
import RoomIcon from '../../images/room.png'
import BotsBox from '../../modules/botsbox'
import { UsersBox } from '../../modules/usersbox/usersbox'
import { colors, setToken, theme, token } from '../../util/settings'
import {
  ConnectToIo,
  leaveRoom,
  registerEvent,
  serverRoot,
  setRoom,
  socket,
  unregisterEvent,
  useForceUpdate,
} from '../../util/Utils'
import DesktopWallpaper2 from '../../images/desktop-wallpaper.jpg';
import {homeRoomId} from '../../util/settings';

let accessChangeCallback = undefined
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback
}
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback
}
export let reloadConf = undefined

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: '#ddd',
    '&$selected': {
      color: '#fff',
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
})

export let membership = undefined
let setMembership = undefined

export default function HomePage(props) {

  const useStyles = makeStyles({
    root: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      backgroundColor: '#2196f3',
    },
    indicator: {
      backgroundColor: 'white',
    },
    tab: {
      minWidth: isDesktop() || isTablet() ? 100 : undefined,
      maxWidth: isDesktop() || isTablet() ? 100 : undefined,
      width: isDesktop() || isTablet() ? 100 : undefined,
    },
  })

  document.documentElement.style.overflow = 'auto'

  let forceUpdate = useForceUpdate()

  const classes = useStyles()
  const classesAction = useStylesAction()

  ;[membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [menuMode, setMenuMode] = React.useState(0)
  const [opacity, setOpacity] = React.useState(1)

  setRoomId(homeRoomId)

  let loadData = (callback) => {

    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: homeRoomId,
      }),
      redirect: 'follow',
    }
    let getRoomPromise = fetch(serverRoot + '/room/get_room', requestOptions);
    getRoomPromise.then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setRoom(result.room)
        cacheRoom(result.room);
        setToken(localStorage.getItem('token'))

        if (isOnline) ConnectToIo(token, () => {})

        unregisterEvent('membership-updated')
        registerEvent('membership-updated', (mem) => {})
        unregisterEvent('view-updated')
        registerEvent('view-updated', (v) => {})
      })
      .catch((error) => console.log('error', error));
    
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: homeRoomId,
      }),
      redirect: 'follow',
    }
    let enterRoomPromise = fetch(serverRoot + '/room/enter_room', requestOptions2);

    enterRoomPromise.then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setMembership(result.membership)
        cacheMembership(result.membership);
        forceUpdate()

        callback()
      })
      .catch((error) => console.log('error', error))
    
      Promise.all([getRoomPromise, enterRoomPromise]).then(() => callback());
  }
  
  socket.io.removeAllListeners('reconnect')
  socket.io.on('reconnect', () => {
    loadData();
  })

  useEffect(() => {
    loadData(() => {
      setLoaded(true)
    })
  }, [])

  let openDeck = () => {
    gotoPage('/app/deck', { room_id: homeRoomId })
  }
  let openNotes = () => {
    gotoPage('/app/notes', { room_id: homeRoomId })
  }
  let openPolls = () => {
    gotoPage('/app/poll', { room_id: homeRoomId })
  }

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: homeRoomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room_wallpaper', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.wallpaper === null) {
          setWallpaper({
            type: 'photo',
            photo: DesktopWallpaper2
          })
        }
        let wall = JSON.parse(result.wallpaper)
        if (wall.type === 'photo') {
          setWallpaper({
            type: 'photo',
            photo:
              serverRoot +
              `/file/download_file?token=${token}&roomId=${homeRoomId}&fileId=${wall.photoId}`,
          })
        } else if (wall.type === 'video') {
          setWallpaper({
            type: 'video',
            video:
              serverRoot +
              `/file/download_file?token=${token}&roomId=${homeRoomId}&fileId=${wall.photoId}`,
          })
        } else if (wall.type === 'color') {
          setWallpaper(wall)
        }
      })
      .catch((error) => console.log('error', error))
      
      return () => {
        leaveRoom(() => {});
      }
  }, [])

  if (!loaded) {
    return <div />
  }
  if (isDesktop()) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
        }}
      >
        <div
          style={{
            width: 450,
            height: '100%',
            position: 'fixed',
            right: 0,
            top: 0,
          }}
        >
          <ChatEmbedded roomId={homeRoomId} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: isDesktop() ? 450 : 0,
            top: 0,
            bottom: 0,
            opacity: opacity,
            transition: 'opacity .250s',
          }}
        >
          <BotsBox
            openMenu={() => setMenuOpen(true)}
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            membership={membership}
            roomId={homeRoomId}
            style={{ display: 'block' }}
          />
        </div>
        <Drawer
          onClose={() => setMenuOpen(false)}
          open={menuOpen}
          anchor={'right'}
        >
          <div
            style={{
              width: 360,
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              direction: 'rtl',
            }}
          >
            <div style={{ width: 80, height: '100%', backgroundColor: '#eee' }}>
              <Avatar
                onClick={() => setMenuMode(0)}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  top: 16,
                  padding: 8,
                }}
                src={PeopleIcon}
              />
              <Avatar
                onClick={() => setMenuMode(1)}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  top: 16 + 64 + 16,
                  padding: 8,
                }}
                src={BotIcon}
              />
              <Avatar
                onClick={() => {
                  setMenuOpen(false)
                  window.location.href = '/app/room?room_id=1'
                }}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16 + 64 + 16 + 64 + 16,
                  padding: 8,
                }}
                src={HomeIcon}
              />
              <Avatar
                onClick={() => {
                  setMenuOpen(false)
                  gotoPage('/app/roomstree', { room_id: homeRoomId })
                }}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16 + 64 + 16,
                  padding: 8,
                }}
                src={RoomIcon}
              />
              <div
                onClick={() => {
                  setMenuOpen(false)
                  gotoPage('/app/settings', { room_id: homeRoomId })
                }}
                style={{
                  borderRadius: 32,
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16,
                  padding: 8,
                }}
              >
                <Settings style={{ fill: '#666', width: 48, height: 48 }} />
              </div>
            </div>
            <div style={{ width: 280, height: '100%' }}>
              {menuMode === 0 ? (
                <UsersBox membership={membership} roomId={homeRoomId} />
              ) : null}
            </div>
          </div>
        </Drawer>
      </div>
    )
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: opacity,
            transition: 'opacity .250s',
          }}
        >
          <BotsBox
            openMenu={() => setMenuOpen(true)}
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            membership={membership}
            roomId={homeRoomId}
            style={{ display: 'block' }}
          />
        </div>
        <Drawer
          onClose={() => setMenuOpen(false)}
          open={menuOpen}
          anchor={'right'}
        >
          <div
            style={{
              width: 360,
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              direction: 'rtl',
            }}
          >
            <div style={{ width: 80, height: '100%', backgroundColor: '#eee' }}>
              <Avatar
                onClick={() => setMenuMode(0)}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  top: 16,
                  padding: 8,
                }}
                src={PeopleIcon}
              />
              <Avatar
                onClick={() => setMenuMode(1)}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  top: 16 + 64 + 16,
                  padding: 8,
                }}
                src={BotIcon}
              />
              <Avatar
                onClick={() => {
                  setMenuOpen(false)
                  window.location.href = '/app/room?room_id=1'
                }}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16 + 64 + 16 + 64 + 16,
                  padding: 8,
                }}
                src={HomeIcon}
              />
              <Avatar
                onClick={() => {
                  setMenuOpen(false)
                  gotoPage('/app/roomstree', { room_id: homeRoomId })
                }}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16 + 64 + 16,
                  padding: 8,
                }}
                src={RoomIcon}
              />
              <div
                onClick={() => {
                  setMenuOpen(false)
                  gotoPage('/app/settings', { room_id: homeRoomId })
                }}
                style={{
                  borderRadius: 32,
                  width: 64,
                  height: 64,
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: 8,
                  bottom: 16,
                  padding: 8,
                }}
              >
                <Settings style={{ fill: '#666', width: 48, height: 48 }} />
              </div>
            </div>
            <div style={{ width: 280, height: '100%' }}>
              {menuMode === 0 ? (
                <UsersBox membership={membership} roomId={homeRoomId} />
              ) : null}
            </div>
          </div>
        </Drawer>
      </div>
    )
  }
}
