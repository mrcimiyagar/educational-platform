import { AppBar, Fab, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowForward, Search } from '@material-ui/icons';
import Add from '@material-ui/icons/Add';
import React, { useEffect } from 'react';
import { isDesktop, isTablet, popPage, registerDialogOpen } from "../../App";
import { reloadUsersList, RoomTreeBox } from '../../components/RoomTreeBox';
import { colors, token } from '../../util/settings';
import { isMobile, serverRoot } from '../../util/Utils';
import { membership } from './room';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#ddd'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontFamily: 'mainFont'
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    }
}));

export default function RoomsTree(props) {

  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    registerDialogOpen(setOpen)
    const [room, setRoom] = React.useState({});
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250)
    };
    useEffect(() => {
        let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              roomId: props.room_id
            }),
            redirect: 'follow'
        };
        fetch(serverRoot + "/room/get_room", requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(JSON.stringify(result))
                setRoom(result.room)
              })
    }, [])
    document.documentElement.style.overflow = 'hidden'
    if (isDesktop() || isTablet()) {
        return (
            <Dialog
                onTouchStart={(e) => {e.stopPropagation();}}
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: 'none',
                        backdropFilter: 'blur(10px)',
                        width: 600,
                        height: 800,
                        borderRadius: 32,
                        overflow: 'hidden'
                    },
                }}
                fullScreen={isMobile()} open={open} onClose={handleClose} TransitionComponent={Transition}
            >
                <AppBar position={'fixed'} style={{position: 'fixed', width: '100%', height: 64, backgroundColor: colors.primaryMedium}}>
                    <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>نقشه</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{width: "100%", height: "100%"}}>
                    <div style={{width: '100%', position: 'absolute', left: 0, top: 64, height: '100%', overflowY: 'auto'}}>
                        <RoomTreeBox membership={membership} room={room}/>
                    </div>
                </div>
                <Fab color={'secondary'} style={{position: 'fixed', right: 16, bottom: 24}}
            onClick={() => {
              let roomTitle = prompt('نام روم را وارد نمایید')
              if (roomTitle === null || roomTitle === '') {
                return;
              }
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'token': token
                },
                body: JSON.stringify({
                  title: roomTitle,
                  details: '',
                  spaceId: room.spaceId,
                  chatType: 'group'
                }),
                redirect: 'follow'
              };
              fetch(serverRoot + "/room/create_room", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    console.log(JSON.stringify(result));
                    if (result.status === 'success') {
                      reloadUsersList();
                      let requestOptions2 = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          token: token,
                        },
                        body: JSON.stringify({
                          roomId: room.id,
                        }),
                        redirect: 'follow',
                      }
                      setTimeout(() => {
                        fetch(
                          serverRoot + '/room/enter_room',
                          requestOptions2,
                        );
                      }, 5000);
                    }
                  })
                  .catch(error => console.log('error', error));
            }}>
              <Add/>
          </Fab>
            </Dialog>
        );
    }
    else {
        return (
          <Dialog
              onTouchStart={(e) => {e.stopPropagation();}}
              PaperProps={{
                  style: {
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      boxShadow: 'none',
                      backdropFilter: 'blur(10px)',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden'
                  },
              }}
              fullScreen={isMobile()} open={open} onClose={handleClose} TransitionComponent={Transition}
          >
                <AppBar position={'fixed'} style={{position: 'fixed', width: '100%', height: 64, backgroundColor: colors.primaryMedium}}>
                    <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>نقشه</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{width: "100%", height: "100%"}}>
                     
                    <div style={{width: '100%', position: 'absolute', left: 0, top: 64, height: '100%', overflowY: 'auto'}}>
                        <RoomTreeBox membership={membership} room={room}/>
                    </div>
                </div> 
                <Fab color={'secondary'} style={{position: 'fixed', right: 16, bottom: 24}}
            onClick={() => {
              let roomTitle = prompt('نام روم را وارد نمایید')
              if (roomTitle === null || roomTitle === '') {
                return;
              }
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'token': token
                },
                body: JSON.stringify({
                  title: roomTitle,
                  details: '',
                  spaceId: room.spaceId,
                  chatType: 'group'
                }),
                redirect: 'follow'
              };
              fetch(serverRoot + "/room/create_room", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    console.log(JSON.stringify(result));
                    if (result.status === 'success') {
                      reloadUsersList();
                      let requestOptions2 = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          token: token,
                        },
                        body: JSON.stringify({
                          roomId: room.id,
                        }),
                        redirect: 'follow',
                      }
                      setTimeout(() => {
                        fetch(
                          serverRoot + '/room/enter_room',
                          requestOptions2,
                        );
                      }, 5000);
                    }
                  })
                  .catch(error => console.log('error', error));
            }}>
              <Add/>
          </Fab>
            </Dialog>
        );
    }
}
