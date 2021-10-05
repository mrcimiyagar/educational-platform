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
import { pink } from '@material-ui/core/colors'
import { Chat, Search } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import AudiotrackIcon from '@material-ui/icons/Audiotrack'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import Menu from '@material-ui/icons/Menu'
import NotesIcon from '@material-ui/icons/Notes'
import PhotoIcon from '@material-ui/icons/Photo'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PollIcon from '@material-ui/icons/Poll'
import Settings from '@material-ui/icons/Settings'
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
import React, { useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useFilePicker } from 'use-file-picker'
import { pathConfig, setWallpaper } from '../..'
import {
  gotoPage,
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
  setRoomId,
} from '../../App'
import ChatEmbedded from '../../components/ChatEmbedded'
import FilesGrid from '../../components/FilesGrid/FilesGrid'
import RoomBottombar from '../../components/RoomBottombar'
import Jumper from '../../components/SearchEngineFam'
import HomeIcon from '../../images/home.png'
import PeopleIcon from '../../images/people.png'
import BotIcon from '../../images/robot.png'
import RoomIcon from '../../images/room.png'
import { BoardBox } from '../../modules/boardbox/boardbox'
import BotsBox from '../../modules/botsbox'
import { ConfBox } from '../../modules/confbox'
import { TaskBox } from '../../modules/taskbox/taskbox'
import { UsersBox } from '../../modules/usersbox/usersbox'
import store, { changeConferenceMode } from '../../redux/main'
import { colors, setToken, theme, token } from '../../util/settings'
import {
  ConnectToIo,
  leaveRoom,
  serverRoot,
  setRoom,
  socket,
  useForceUpdate,
} from '../../util/Utils'
import DesktopWallpaper2 from '../../images/desktop-wallpaper.jpg'

let accessChangeCallback = undefined
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback
}
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback
}
export let reloadConf = undefined

const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        {
          id: 'Card1',
          title: 'Write Blog',
          description: 'Can AI make memes',
          label: '30 mins',
          draggable: false,
        },
        {
          id: 'Card2',
          title: 'Pay Rent',
          description: 'Transfer via NEFT',
          label: '5 mins',
          metadata: { sha: 'be312a1' },
        },
      ],
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '0/0',
      cards: [],
    },
  ],
}

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
  if (props.token !== undefined) {
    localStorage.setItem('token', props.token)
    gotoPage()
    window.location.href = pathConfig.mainFrontend + '/app/room?room_id=' + props.room_id
  }
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

  const [jumperOpen, setJumperOpen] = React.useState(true)
  ;[membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [currentRoomNav, setCurrentRoomNav] = React.useState(Number(props.tab_index))
  const [fileMode, setFileMode] = React.useState(0)
  const [menuMode, setMenuMode] = React.useState(0)
  const [opacity, setOpacity] = React.useState(1)

  let roomId = props.room_id
  setRoomId(roomId)

  let loadData = (callback) => {
    leaveRoom(() => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
        redirect: 'follow',
      }
      fetch(serverRoot + '/room/get_room', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result))
          setRoom(result.room)
          setToken(localStorage.getItem('token'))

          ConnectToIo(token, () => {})

          socket.off('membership-updated')
          socket.on('membership-updated', (mem) => {})
          socket.off('view-updated')
          socket.on('view-updated', (v) => {})
          let requestOptions2 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              roomId: roomId,
            }),
            redirect: 'follow',
          }
          fetch(serverRoot + '/room/enter_room', requestOptions2)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result))
              setMembership(result.membership)
              forceUpdate()

              callback()
            })
            .catch((error) => console.log('error', error))

          window.scrollTo(0, 0)

          store.dispatch(changeConferenceMode(true))
        })
        .catch((error) => console.log('error', error))
    })
  }

  let loadFiles = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: roomId,
        fileMode:
          fileMode === 0
            ? 'photo'
            : fileMode === 1
            ? 'audio'
            : fileMode === 'video'
            ? 2
            : 3,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/file/get_files', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        result.files.forEach((fi) => {
          fi.progress = 100
        })
        setFiles(result.files)
      })
      .catch((error) => console.log('error', error))
  }

  useEffect(() => {
    loadData(() => {
      loadFiles()
      setLoaded(true)
    })
  }, [])

  let openDeck = () => {
    gotoPage('/app/deck', { room_id: props.room_id })
  }
  let openNotes = () => {
    gotoPage('/app/notes', { room_id: props.room_id })
  }
  let openPolls = () => {
    gotoPage('/app/poll', { room_id: props.room_id })
  }

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
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
              `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
          })
        } else if (wall.type === 'video') {
          setWallpaper({
            type: 'video',
            video:
              serverRoot +
              `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
          })
        } else if (wall.type === 'color') {
          setWallpaper(wall)
        }
      })
      .catch((error) => console.log('error', error))
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
          <ChatEmbedded roomId={props.room_id} />
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
            roomId={props.room_id}
            style={{ display: currentRoomNav === 0 ? 'block' : 'none' }}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            right: isInRoom() ? 450 + 32 : 16,
            bottom: 0,
            transform: 'translateY(+48px)',
            zIndex: 99999,
          }}
        >
          <Jumper open={jumperOpen} setOpen={setJumperOpen} />
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
                  gotoPage('/app/roomstree', { room_id: props.room_id })
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
                  gotoPage('/app/settings')
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
                <UsersBox membership={membership} roomId={props.room_id} />
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
            roomId={props.room_id}
            style={{ display: currentRoomNav === 0 ? 'block' : 'none' }}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            right: isDesktop() ? (isInRoom() ? 450 + 16 : 16) : 16,
            bottom: 4,
            zIndex: 2500,
          }}
        >
          <Jumper open={jumperOpen} setOpen={setJumperOpen} />
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
                  gotoPage('/app/roomstree', { room_id: props.room_id })
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
                  gotoPage('/app/settings', { room_id: props.room_id })
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
                <UsersBox membership={membership} roomId={props.room_id} />
              ) : null}
            </div>
          </div>
        </Drawer>
      </div>
    )
  }
}
