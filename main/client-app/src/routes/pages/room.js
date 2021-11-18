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
  isOnline,
  isTablet,
  setInTheGame,
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
import { colors, setToken, token } from '../../util/settings'
import {
  ConnectToIo,
  leaveRoom,
  serverRoot,
  setRoom,
  socket,
  switchRoom,
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

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: '#eee',
    '&$selected': {
      color: '#fff',
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
})

export let membership = undefined
let setMembership = undefined
let pickingFile = false

let attachWebcamOnMessenger = undefined;
let roomId = undefined;

export default function RoomPage(props) {

  const urlSearchParams = new URLSearchParams(window.location.search)
  props = Object.fromEntries(urlSearchParams.entries())

  const useStyles = makeStyles({
    root: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      backgroundColor: colors.primaryMedium,
    },
    indicator: {
      backgroundColor: '#fff',
    },
    tab: {
      color: '#fff',
      minWidth: isDesktop() || isTablet() ? 100 : undefined,
      maxWidth: isDesktop() || isTablet() ? 100 : undefined,
      width: isDesktop() || isTablet() ? 100 : undefined,
    },
  })

  document.documentElement.style.overflow = 'auto';

  let forceUpdate = useForceUpdate();

  const classes = useStyles();
  const classesAction = useStylesAction();

  const [jumperOpen, setJumperOpen] = React.useState(true);
  ;[membership, setMembership] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [currentRoomNav, setCurrentRoomNav] = React.useState(
    Number(props.tab_index),
  );
  const [fileMode, setFileMode] = React.useState(0);
  const [menuMode, setMenuMode] = React.useState(0);
  const [opacity, setOpacity] = React.useState(1);
  let [webcamOn, setWebcamOn] = React.useState(false);

  let loadData = (callback) => {

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
    let getRoomPromise = fetch(serverRoot + '/room/get_room', requestOptions);
    getRoomPromise.then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setRoom(result.room)
        setToken(localStorage.getItem('token'))
        if (isOnline) ConnectToIo(token, () => {})
        socket.off('membership-updated')
        socket.on('membership-updated', (mem) => {})
        socket.off('view-updated')
        socket.on('view-updated', (v) => {})
        window.scrollTo(0, 0)
        store.dispatch(changeConferenceMode(true))
      })
      .catch((error) => console.log('error', error));
    
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
    let enterRoomPromise = fetch(serverRoot + '/room/enter_room', requestOptions2);

    enterRoomPromise.then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setMembership(result.membership)
        forceUpdate();
      })
      .catch((error) => console.log('error', error))
    
      Promise.all([getRoomPromise, enterRoomPromise]).then(() => callback());
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

  setInTheGame(true)

  useEffect(() => {
    roomId = props.room_id
    setRoomId(roomId)
    loadData(() => {
      loadFiles()
      setLoaded(true)
    })
  }, [props.room_id])

  const [files, setFiles] = React.useState([])

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
  })

  useEffect(() => {
    if (!loading && pickingFile) {
      pickingFile = false
      let dataUrl = filesContent[0].content
      if (dataUrl === undefined) return
      fetch(dataUrl)
        .then((d) => d.blob())
        .then((file) => {
          let data = new FormData()
          data.append('file', file)
          let request = new XMLHttpRequest()

          let ext = filesContent[0].name.includes('.')
            ? filesContent[0].name.substr(filesContent[0].name.indexOf('.') + 1)
            : ''
          let fileType =
            ext === 'png' ||
            ext === 'jpg' ||
            ext === 'jpeg' ||
            ext === 'gif' ||
            ext === 'webp' ||
            ext === 'svg'
              ? 'photo'
              : ext === 'wav' ||
                ext === 'mpeg' ||
                ext === 'aac' ||
                ext === 'mp3'
              ? 'audio'
              : ext === 'webm' ||
                ext === 'mkv' ||
                ext === 'flv' ||
                ext === 'mp4' ||
                ext === '3gp'
              ? 'video'
              : 'document'

          let f = {
            progress: 0,
            name: file.name,
            size: file.size,
            local: true,
            src: dataUrl,
            fileType: fileType,
          }

          request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
              loadFiles()
            }
          }

          request.open(
            'POST',
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${roomId}&extension=${ext}`,
          )

          files.push(f)
          setFiles(files)
          forceUpdate()
          request.upload.addEventListener('progress', function (e) {
            let percent_completed = (e.loaded * 100) / e.total
            f.progress = percent_completed
            if (percent_completed === 100) {
              f.local = false
            }
            forceUpdate()
          })
          if (FileReader && files && files.length) {
            let fr = new FileReader()
            fr.readAsDataURL(file)
          }
          request.send(data)
        })
    }
  }, [loading])

  let openDeck = () => {
    gotoPage('/app/deck', { room_id: props.room_id })
  }
  let openNotes = () => {
    gotoPage('/app/notes', { room_id: props.room_id })
  }
  let openPolls = () => {
    gotoPage('/app/poll', { room_id: props.room_id })
  }
  const handleChange = (event, newValue) => {
    setFileMode(newValue)
  }
  const handleChangeIndex = (index) => {
    setFileMode(index)
  }

  useEffect(() => {
    if (attachWebcamOnMessenger !== undefined) {
      window.removeEventListener('message', attachWebcamOnMessenger);
    }
    attachWebcamOnMessenger = (e) => {
      if (e.data.sender === 'conf') {
        if (e.data.action === 'attachWebcamOnMessenger') {
          setWebcamOn(true);
        }
        else if (e.data.action === 'detachWebcamOnMessenger') {
          setWebcamOn(false);
        }
      }
    };
    window.addEventListener('message', attachWebcamOnMessenger);
  }, [])

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
            photo: DesktopWallpaper2,
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
    
      return () => {
        leaveRoom(() => {});
       };
  }, [])

  if (!loaded) {
    return <div />
  }

  let theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#FFC107',
      },
    },
  })

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
            top: webcamOn ? 300 : 0,
            zIndex: 2491
          }}
        >
          <ChatEmbedded roomId={props.room_id} webcamOn={webcamOn} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: (isDesktop() && currentRoomNav !== 2 && !webcamOn) ? 450 : 0,
            top: 0,
            bottom: 0,
            opacity: opacity,
            transition: 'opacity .250s',
          }}
        >
          <ConfBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            webcamOn={webcamOn}
            currentRoomNav={currentRoomNav}
            style={{ display: (currentRoomNav === 2 || webcamOn) ? 'block' : 'none' }}
            roomId={props.room_id}
          />
          <div style={{paddingRight: (webcamOn && currentRoomNav !== 2) ? 450 : 0,
            width: '100%',
            height: '100%'}}>
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
          <BoardBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            membership={membership}
            roomId={props.room_id}
            style={{ display: currentRoomNav === 1 ? 'block' : 'none' }}
          />
          <TaskBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            style={{ display: currentRoomNav === 3 ? 'block' : 'none' }}
            roomId={props.room_id}
          />
          <div
            style={{
              display: currentRoomNav === 4 ? 'block' : 'none',
              width: '100%',
              height: '100%',
              minHeight: '100vh',
            }}
          >
            <AppBar
              style={{
                width: isDesktop() ? 550 : '100%',
                height: 144,
                borderRadius: isDesktop() ? '0 0 24px 24px' : 0,
                backgroundColor: colors.primaryMedium,
                backdropFilter: 'blur(10px)',
                position: 'fixed',
                left: isDesktop() && isInRoom() ? 'calc(50% - 225px)' : '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Toolbar
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16,
                  }}
                >
                  <Search style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openDeck()
                  }}
                >
                  <ViewCarouselIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openNotes()
                  }}
                >
                  <NotesIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16 + 32 + 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openPolls()
                  }}
                >
                  <PollIcon style={{ fill: '#fff' }} />
                </IconButton>
                <Typography
                  variant={'h6'}
                  style={{ position: 'absolute', right: 16 + 32 + 16 }}
                >
                  فایل ها
                </Typography>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    right: 16,
                  }}
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu style={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
              <Tabs
                variant="fullWidth"
                value={fileMode}
                onChange={handleChange}
                classes={{
                  indicator: classes.indicator,
                }}
                style={{ marginTop: 8 }}
                centered
              >
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<PhotoIcon />}
                  label="عکس ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<AudiotrackIcon />}
                  label="صدا ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<PlayCircleFilledIcon />}
                  label="ویدئو ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<InsertDriveFileIcon />}
                  label="سند ها"
                />
              </Tabs>
            </AppBar>
            <div
              style={{
                height: 'calc(100% - 64px - 72px - 48px)',
                width: 'calc(100% - 112px)',
                marginTop: 64 + 48,
              }}
            >
              <SwipeableViews
                axis={'x-reverse'}
                index={fileMode}
                onChangeIndex={handleChangeIndex}
              >
                <div>
                  <FilesGrid
                    fileType={'photo'}
                    files={files.filter((f) => f.fileType === 'photo')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'audio'}
                    files={files.filter((f) => f.fileType === 'audio')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'video'}
                    files={files.filter((f) => f.fileType === 'video')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'document'}
                    files={files.filter((f) => f.fileType === 'document')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
              </SwipeableViews>
              <ThemeProvider theme={theme}>
                <Fab
                  color="secondary"
                  style={{
                    position: 'fixed',
                    bottom: isDesktop() && isInRoom() ? 48 : 72 + 16,
                    left: isDesktop() && isInRoom() ? 16 + 16 : 16,
                  }}
                  onClick={() => {
                    pickingFile = true
                    openFileSelector()
                  }}
                >
                  <AddIcon />
                </Fab>
                {isMobile() || isTablet() ? (
                  <Fab
                    color="primary"
                    style={{
                      position: 'fixed',
                      bottom: 72 + 16,
                      left: 16 + 56 + 16,
                    }}
                    onClick={() => {
                      gotoPage('/app/chat', { room_id: props.room_id })
                    }}
                  >
                    <Chat />
                  </Fab>
                ) : null}
              </ThemeProvider>
            </div>
          </div>
          </div>
        </div>
        <div
          style={{
            position: 'fixed',
            right: isInRoom() ? 450 + 32 : 16,
            bottom: isDesktop() ? -16 : 0,
            transform: 'translateY(+48px)',
            zIndex: 99999,
          }}
        >
          <Jumper open={jumperOpen} setOpen={setJumperOpen} />
        </div>
        <RoomBottombar
          setCurrentRoomNavBackup={(v) => {
            props.tab_index = v
          }}
          setCurrentRoomNav={(i) => {
            setOpacity(0)
            setTimeout(() => {
              setCurrentRoomNav(i)
              setTimeout(() => {
                setOpacity(1)
              }, 250)
            }, 250)
          }}
          currentRoomNav={currentRoomNav}
        />
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
          <ConfBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            webcamOn={webcamOn}
            currentRoomNav={currentRoomNav}
            style={{ display: currentRoomNav === 2 ? 'block' : 'none' }}
            roomId={props.room_id}
          />
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
          <BoardBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            membership={membership}
            roomId={props.room_id}
            userId={props.user_id}
            style={{ display: currentRoomNav === 1 ? 'block' : 'none' }}
          />
          <TaskBox
            openDeck={openDeck}
            openNotes={openNotes}
            openPolls={openPolls}
            setMenuOpen={setMenuOpen}
            style={{ display: currentRoomNav === 3 ? 'block' : 'none' }}
            roomId={props.room_id}
          />
          <div
            style={{
              display: currentRoomNav === 4 ? 'block' : 'none',
              width: '100%',
              height: '100%',
              minHeight: '100vh',
            }}
          >
            <AppBar
              style={{
                width: '100%',
                height: 72 + 72,
                backgroundColor: colors.primaryMedium,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Toolbar
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: isDesktop() && isInRoom() ? 0 : 8,
                }}
              >
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16,
                  }}
                >
                  <Search style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openDeck()
                  }}
                >
                  <ViewCarouselIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openNotes()
                  }}
                >
                  <NotesIcon style={{ fill: '#fff' }} />
                </IconButton>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 16 + 32 + 16 + 32 + 16 + 32 + 16,
                  }}
                  onClick={() => {
                    openPolls()
                  }}
                >
                  <PollIcon style={{ fill: '#fff' }} />
                </IconButton>
                <Typography
                  variant={'h6'}
                  style={{
                    position: 'absolute',
                    right: 16 + 32 + 16,
                    color: '#fff',
                  }}
                >
                  فایل ها
                </Typography>
                <IconButton
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    right: 16,
                  }}
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu style={{ fill: '#fff' }} />
                </IconButton>
              </Toolbar>
              <Tabs
                variant="fullWidth"
                value={fileMode}
                onChange={handleChange}
                classes={{
                  indicator: classes.indicator,
                }}
                style={{ marginTop: 8, color: '#fff' }}
              >
                <Tab
                  icon={<PhotoIcon style={{ fill: '#fff' }} />}
                  label="عکس ها"
                />
                <Tab
                  icon={<AudiotrackIcon style={{ fill: '#fff' }} />}
                  label="صدا ها"
                />
                <Tab
                  icon={<PlayCircleFilledIcon style={{ fill: '#fff' }} />}
                  label="ویدئو ها"
                />
                <Tab
                  icon={<InsertDriveFileIcon style={{ fill: '#fff' }} />}
                  label="سند ها"
                />
              </Tabs>
            </AppBar>
            <div
              style={{
                height: 'calc(100% - 64px - 72px - 48px)',
                marginTop: 64 + 48,
              }}
            >
              <SwipeableViews
                axis={'x-reverse'}
                index={fileMode}
                onChangeIndex={handleChangeIndex}
              >
                <div>
                  <FilesGrid
                    fileType={'photo'}
                    files={files.filter((f) => f.fileType === 'photo')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'audio'}
                    files={files.filter((f) => f.fileType === 'audio')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'video'}
                    files={files.filter((f) => f.fileType === 'video')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
                <div>
                  <FilesGrid
                    fileType={'document'}
                    files={files.filter((f) => f.fileType === 'document')}
                    setFiles={setFiles}
                    roomId={props.room_id}
                  />
                </div>
              </SwipeableViews>
              <Fab
                color="secondary"
                style={{ position: 'fixed', bottom: 72 + 16, left: 16 }}
                onClick={() => {
                  pickingFile = true
                  openFileSelector()
                }}
              >
                <AddIcon />
              </Fab>
              <Fab
                color="primary"
                style={{
                  position: 'fixed',
                  bottom: 72 + 16,
                  left: 16 + 56 + 16,
                }}
                onClick={() => {
                  gotoPage('/app/chat', { room_id: props.room_id })
                }}
              >
                <Chat />
              </Fab>
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'fixed',
            right: isDesktop() ? (isInRoom() ? 450 + 16 : 16) : 16,
            bottom: isDesktop() ? -16 : 0,
            zIndex: 2500,
          }}
        >
          <Jumper open={jumperOpen} setOpen={setJumperOpen} />
        </div>
        <RoomBottombar
          setCurrentRoomNavBackup={(v) => {
            props.tab_index = v;
            if (v === 2) {
              window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'intWebcam'}, pathConfig.confClient);
            }
            else {
              window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'extWebcam'}, pathConfig.confClient);
            }
          }}
          setCurrentRoomNav={(i) => {
            setOpacity(0)
            setTimeout(() => {
              setCurrentRoomNav(i)
              setTimeout(() => {
                setOpacity(1)
              }, 250)
            }, 250)
          }}
          currentRoomNav={currentRoomNav}
        />
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
