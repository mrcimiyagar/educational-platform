import React, {Component, Fragment, useEffect, useState} from "react";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import {colors, me, setMe, setToken, token} from "../../util/settings";

import { BotsBox } from "../../modules/botsbox";
import { BoardBox } from "../../modules/boardbox/boardbox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { ConfBox } from "../../modules/confbox";
import { ConnectToIo, leaveRoom, roothPath, socket, useForceUpdate, validateToken, FetchMe, conferencePath, serverRoot, setRoomId, setRoom, room } from "../../util/Utils";

import {isDesktop, gotoPage, setCurrentNav, popPage} from '../../App';
import store, { changeConferenceMode, PeopleChatModes, setCurrentRoom } from "../../redux/main";
import RoomBottombar from '../../components/RoomBottombar'
import { AppBar, Avatar, Button, createTheme, Drawer, Fab, IconButton, makeStyles, Tab, Tabs, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import FilesGrid from "../../components/FilesGrid/FilesGrid";
import AddIcon from "@material-ui/icons/Add";
import { ArrowForward, Chat, Search } from "@material-ui/icons";
import { pink } from "@material-ui/core/colors";
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import FilesBottombar from '../../components/FilesBottombar'
import PhotoIcon from '@material-ui/icons/Photo';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import NotesIcon from '@material-ui/icons/Notes';
import SwipeableViews from "react-swipeable-views";
import PollIcon from '@material-ui/icons/Poll';
import Menu from "@material-ui/icons/Menu";
import BotIcon from '../../images/robot.png';
import PeopleIcon from '../../images/people.png';
import RoomIcon from '../../images/room.png'
import HomeIcon from '../../images/home.png'
import Settings from "@material-ui/icons/Settings";
import { UsersBox } from "../../modules/usersbox/usersbox";
import RoomTreeMenu from "../../components/RoomTreeMenu";
import { RoomTreeBox } from "../../components/RoomTreeBox";

let accessChangeCallback = undefined;
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback;
};
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback;
};
export let reloadConf = undefined

const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
        {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '0/0',
      cards: []
    }
  ]
}

let currentRoomNavBackup = 0

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#2196f3'
  },
  indicator: {
    backgroundColor: 'white',
  },
});

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
});

export let membership = undefined
let setMembership = undefined;

export default function RoomPage(props) {

  let forceUpdate = useForceUpdate()

  const classes = useStyles();
  const classesAction = useStylesAction();

  [membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [currentRoomNav, setCurrentRoomNav] = React.useState(currentRoomNavBackup)
  const [fileMode, setFileMode] = React.useState(0)
  const [menuMode, setMenuMode] = React.useState(0)

  const search = props.location.search
  let roomId = new URLSearchParams(search).get('room_id')
  setRoomId(roomId)

  let loadData = (callback) => {
    leaveRoom(() => {
      let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            roomId: roomId
          }),
          redirect: 'follow'
      };
      fetch(serverRoot + "/room/get_room", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result))
              setRoom(result.room)
              setToken(localStorage.getItem('token'));
              
              ConnectToIo(token, () => {
                
              })

              socket.off('membership-updated')
                socket.on('membership-updated', mem => {
                  
                })
                socket.off('view-updated')
                socket.on('view-updated', v => {
                  
                })
                let requestOptions2 = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'token': token
                  },
                  body: JSON.stringify({
                    roomId: roomId
                  }),
                  redirect: 'follow'
                };
                fetch(serverRoot + "/room/enter_room", requestOptions2)
                    .then(response => response.json())
                    .then(result => {
                      console.log(JSON.stringify(result));
                      setMembership(result.membership)
                      forceUpdate()

                      callback()
                    })
                    .catch(error => console.log('error', error));
          
              window.scrollTo(0, 0);
              
              store.dispatch(changeConferenceMode(true));
            })
            .catch(error => console.log('error', error));

      });
  }

  let loadFiles = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
          roomId: roomId,
          fileMode: fileMode === 0 ? 'photo' : fileMode === 1 ? 'audio' : fileMode === 'video' ? 2 : 3
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/file/get_files", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              result.files.forEach(fi => {
                  fi.progress = 100;
              });
              setFiles(result.files);
          })
          .catch(error => console.log('error', error));
  }

  useEffect(() => {
    loadData(() => {
      loadFiles()
      setLoaded(true)
    })
  }, [])

  const [files, setFiles] = React.useState([]);
  let uploadBtn = React.useRef();

  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    let file = event.target.files[0];
    if (file === undefined) return
    let data = new FormData();
    data.append('file', file);
    let request = new XMLHttpRequest();
    request.open('POST', serverRoot + `/file/upload_file?token=${token}&roomId=${roomId}`);
    request.upload.addEventListener('progress', function(e) {
        let percent_completed = (e.loaded * 100 / e.total);
    });
    let f = {progress: 0, name: file.name, size: file.size, local: true};
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            f.src = fr.result;
        }
        fr.readAsDataURL(file);
    }
    request.send(data);
  }
  let openDeck = () => {
    gotoPage('/app/deck')
  }
  let openNotes = () => {
    gotoPage('/app/notes')
  }
  let openPolls = () => {
    gotoPage('/app/poll')
  }
  const handleChange = (event, newValue) => {
    setFileMode(newValue)
  };
  const handleChangeIndex = (index) => {
    setFileMode(index)
  };

  if (!loaded) {
    return (<div/>)
  }
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
      },
      secondary: pink
    },
  });
  return (
      <div style={{width: '100%', height: '100%', position: 'fixed', right: 0, top: 0, backgroundColor: colors.primaryDark}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#fff'}}>
        {
            currentRoomNav === 0 ?
              <BotsBox openDeck={openDeck} openNotes={openNotes} openPolls={openPolls} setMenuOpen={setMenuOpen} membership={membership} roomId={roomId} style={{display: 'block'}}/> :
              currentRoomNav === 2 ?
                <ConfBox openDeck={openDeck} openNotes={openNotes} openPolls={openPolls} setMenuOpen={setMenuOpen}/> :
                currentRoomNav === 1 ?
                  <BoardBox openDeck={openDeck} openNotes={openNotes} openPolls={openPolls} setMenuOpen={setMenuOpen} membership={membership} roomId={roomId} style={{display: 'block'}}/> :
                  currentRoomNav === 3 ?
                    <TaskBox openDeck={openDeck} openNotes={openNotes} openPolls={openPolls} setMenuOpen={setMenuOpen}/> :
                    currentRoomNav === 4 ?
                      <div
                        style={{backgroundColor: '#eee', width: '100%', height: '100%', minHeight: '100vh'}}>
                          <AppBar style={{width: '100%', height: 64 + 72, backgroundColor: '#2196f3'}}>
                            <Toolbar style={{width: '100%', justifyContent: 'center', textAlign: 'center'}}>
                              <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                              <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16}} onClick={() => {
                                openDeck()
                              }}><ViewCarouselIcon style={{fill: '#fff'}}/></IconButton>
                              <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16}} onClick={() => {
                                openNotes()
                              }}><NotesIcon style={{fill: '#fff'}}/></IconButton>
                              <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16 + 32 + 16 + 32 + 16}} onClick={() => {
                                openPolls()
                              }}><PollIcon style={{fill: '#fff'}}/></IconButton>
                              <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>فایل ها</Typography>
                              <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => setMenuOpen(true)}><Menu style={{fill: '#fff'}}/></IconButton>
                            </Toolbar>
                            <Tabs
                              variant="fullWidth"
                              value={fileMode}
                              onChange={handleChange}
                              classes={{
                                indicator: classes.indicator
                              }}
                              style={{marginTop: 8}}
                            >
                              <Tab icon={<PhotoIcon />} label="عکس ها" />
                              <Tab icon={<AudiotrackIcon />} label="صدا ها" />
                              <Tab icon={<PlayCircleFilledIcon />} label="ویدئو ها" />
                              <Tab icon={<InsertDriveFileIcon />} label="سند ها" />
                            </Tabs>
                          </AppBar>
                          <div style={{height: 'calc(100% - 64px - 72px - 48px)', marginTop: 64 + 48}}>
                            <input id="myInput"
                              type="file"
                              ref={(ref) => uploadBtn = ref}
                              style={{display: 'none'}}
                              onChange={onChangeFile}/>
                            <SwipeableViews
                              axis={'x-reverse'}
                              index={fileMode}
                              onChangeIndex={handleChangeIndex}
                            >
                              <div>
                                <FilesGrid files={files} setFiles={setFiles} roomId={roomId}/>
                              </div>
                              <div>
                                <FilesGrid files={files} setFiles={setFiles} roomId={roomId}/>
                              </div>
                              <div>
                                <FilesGrid files={files} setFiles={setFiles} roomId={roomId}/>
                              </div>
                              <div>
                                <FilesGrid files={files} setFiles={setFiles} roomId={roomId}/>
                              </div>
                            </SwipeableViews>
                            <ThemeProvider theme={theme}>
                              <Fab color="secondary" style={{position: 'fixed', bottom: 72 + 16, left: 16}} onClick={() => uploadBtn.click()}>
                                <AddIcon/>
                              </Fab>
                              <Fab color="primary" style={{position: 'fixed', bottom: 72 + 16, left: 16 + 56 + 16}} onClick={() => {
                                  gotoPage('/app/chat')
                                }}>
                                <Chat/>
                              </Fab>
                            </ThemeProvider>
                          </div>
                      </div> :
            null
        }
        </div>
        <RoomBottombar setCurrentRoomNavBackup={(v) => {currentRoomNavBackup = v}} setCurrentRoomNav={setCurrentRoomNav} currentRoomNav={currentRoomNav}/>
        <Drawer onClose={() => setMenuOpen(false)} open={menuOpen} anchor={'right'}>
          <div style={{width: 360, height: '100%', backgroundColor: '#fff', display: 'flex'}}>
            <div style={{width: 80, height: '100%', backgroundColor: '#eee'}}>
              <Avatar onClick={() => setMenuMode(0)} style={{width: 64, height: 64, backgroundColor: '#fff', position: 'absolute', right: 8, bottom: 16 + 64 + 16 + 64 + 16, padding: 8}} src={HomeIcon} onClick={() => gotoPage('/app/homespace')}/>
              <Avatar onClick={() => setMenuMode(1)} style={{width: 64, height: 64, backgroundColor: '#fff', position: 'absolute', right: 8, top: 16 + 64 + 16, padding: 8}} src={PeopleIcon}/>
              <Avatar onClick={() => setMenuMode(2)} style={{width: 64, height: 64, backgroundColor: '#fff', position: 'absolute', right: 8, top: 16,  padding: 8}} src={BotIcon}/>
              <Avatar onClick={() => setMenuMode(0)} style={{width: 64, height: 64, backgroundColor: '#fff', position: 'absolute', right: 8, bottom: 16 + 64 + 16, padding: 8}} src={RoomIcon} onClick={() => gotoPage('/app/roomstree')}/>
              <div onClick={() => setMenuMode(3)} style={{borderRadius: 32, width: 64, height: 64, backgroundColor: '#fff', position: 'absolute', right: 8, bottom: 16, padding: 8}}>
                <Settings style={{fill: '#666', width: 48, height: 48}}/>
              </div>
            </div>
            <div style={{width: 280, height: '100%'}}>
              {
                  menuMode === 1 ?
                    <UsersBox membership={membership}/> :
                    null
              }
            </div>
          </div>
        </Drawer>
      </div>
    )
}
