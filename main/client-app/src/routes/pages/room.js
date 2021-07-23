import React, {Component, Fragment, useEffect, useState} from "react";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import {colors, me, setMe, setToken, token} from "../../util/settings";

import { BoardBox } from "../../modules/boardbox/boardbox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { ConfBox } from "../../modules/confbox";
import { ConnectToIo, leaveRoom, roothPath, socket, useForceUpdate, validateToken, FetchMe, conferencePath, serverRoot } from "../../util/Utils";

import {isDesktop, gotoPage, setCurrentNav, popPage} from '../../App';
import store, { changeConferenceMode, PeopleChatModes, setCurrentRoom } from "../../redux/main";
import RoomBottombar from '../../components/RoomBottombar'
import { AppBar, Button, createTheme, Fab, IconButton, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import FilesGrid from "../../components/FilesGrid/FilesGrid";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import { ArrowForward, Chat, Search } from "@material-ui/icons";
import { pink } from "@material-ui/core/colors";
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';

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

export default function RoomPage(props) {

  let forceUpdate = useForceUpdate()

  const [membership, setMembership] = React.useState({})
  const [loaded, setLoaded] = React.useState(false)
  const [currentRoomNav, setCurrentRoomNav] = React.useState(currentRoomNavBackup)

  const search = props.location.search
  let roomId = new URLSearchParams(search).get('room_id')

  let onSocketAuth = () => {
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
        })
        .catch(error => console.log('error', error));
  }

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
      
              setToken(localStorage.getItem('token'));
              validateToken(token, (result) => {
                  if (result) {
                    onSocketAuth()
                  }
                  else {
                    gotoPage('/app/register')
                  }
              })
              
              ConnectToIo(token, onSocketAuth)
          
              window.scrollTo(0, 0);
              
              store.dispatch(changeConferenceMode(true));

              callback()
            })
            .catch(error => console.log('error', error));

      });
  }

  useEffect(() => {
    loadData(() => {

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
      
      setLoaded(true)
    })
  }, [])

  const [files, setFiles] = React.useState([]);
  let uploadBtn = React.useRef();
  let [filesBoxOpen, setFilesBoxOpen] = React.useState(false);

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
    
  }

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
          currentRoomNav === 2 ? 
            <ConfBox openDeck={openDeck}/> :
            currentRoomNav === 1 ? 
              <BoardBox openDeck={openDeck} membership={membership} roomId={roomId} style={{display: 'block'}}/> :
              currentRoomNav === 3 ? 
                <TaskBox openDeck={openDeck}/> :
                currentRoomNav === 4 ?
                
                    <div
                      style={{backgroundColor: '#fff', width: '100%', height: '100%', minHeight: '100vh'}}>
                        <AppBar style={{width: '100%', height: 64, backgroundColor: '#2196f3'}}>
                          <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                            <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16 + 32 + 16}} onClick={() => {
                              openDeck()
                            }}><ViewCarouselIcon style={{fill: '#fff'}}/></IconButton>
                            <Typography variant={'h6'}>فایل ها</Typography>
                            <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => popPage()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                          </Toolbar>
                        </AppBar>
                        <div style={{height: 'calc(100% - 64px - 72px)', overflowY: 'auto', marginTop: 64}}>
                          <input id="myInput"
                            type="file"
                            ref={(ref) => uploadBtn = ref}
                            style={{display: 'none'}}
                            onChange={onChangeFile}/>
                          <PerfectScrollbar>
                            <FilesGrid files={files} setFiles={setFiles} roomId={roomId}/>
                          </PerfectScrollbar>
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
      </div>
    )
}
