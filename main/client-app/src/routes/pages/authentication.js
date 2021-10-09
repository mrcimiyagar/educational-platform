import { Fab, makeStyles, TextField, Typography } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import React, { useEffect } from "react";
import { pathConfig } from '../..';
import { gotoPage } from "../../App";
import CloudIcon from '../../images/logo.png';
import { setHomeRoomId, setHomeSpaceId, setMe, setToken } from "../../util/settings";
import { ConnectToIo, serverRoot, setConfig } from "../../util/Utils";
import Wallpaper from '../../images/roomWallpaper.png'
import WhiteColorTextField from '../../components/WhiteColorTextField';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      background: "rgba(255, 255, 255, 0.5)"
    }
  }
}));

function Authentication(props) {
  let [logoTop, setLogoTop] = React.useState(400)
  let [opacity, setOpacity] = React.useState(0)
  let [register, setRegister] = React.useState(false)
  let classes = useStyles()
  useEffect(() => {
    setTimeout(() => {
      setLogoTop(100);
      setOpacity(1)
    }, 2000)
  }, [])
  return (
    <div style={{height: '100%', overflow: 'auto', width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000}}>
      <img src={Wallpaper} style={{position: 'fixed', width: '100%', height: '100%', objectFit: 'cover'}}/>
      {register ? 
        <div style={{borderRadius: 32, height: 'auto', paddingLeft: 32, paddingRight: 32, paddingtop: 16, paddingBottom: 16, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', textAlign: 'center', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <img src={CloudIcon} style={{width: 300, height: 300, fill: '#fff', transition: 'top 1s', marginTop: -56}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#000', marginTop: -56, transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <WhiteColorTextField className={classes.root} id="registerUsername" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <WhiteColorTextField className={classes.root} id="registerPassword" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <WhiteColorTextField className={classes.root} id="registerConfirmPass" label="تکرار رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <WhiteColorTextField className={classes.root} id="registerFirstName" label="نام" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <WhiteColorTextField className={classes.root} id="registerLastName" label="نام خانوادگی" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab color={'primary'} variant="extended" style={{marginLeft: 24}} onClick={() => {
              if (document.getElementById('registerPassword').value !== document.getElementById('registerConfirmPass').value) {
                alert('passwords does not match')
                return
              }
              let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: document.getElementById('registerUsername').value,
                    password: document.getElementById('registerPassword').value,
                    firstName: document.getElementById('registerFirstName').value,
                    lastName: document.getElementById('registerLastName').value
                }),
                redirect: 'follow'
            };
            fetch(serverRoot + "/auth/register", requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(JSON.stringify(result));
                if (result.status === 'success') {
                  document.getElementById('registerUsername').value = ''
                  document.getElementById('registerPassword').value = ''
                  document.getElementById('registerConfirmPass').value = ''
                  document.getElementById('registerFirstName').value = ''
                  document.getElementById('registerLastName').value = ''
                  setRegister(false)
                }
                else {
                  alert(result.message)
                }
              })
              .catch(error => console.log('error', error));
            }}>
              <VpnKeyIcon sx={{ mr: 1 }}/>
              <div style={{marginRight: 8}}>ثبت نام</div>
            </Fab>
            <Fab color={'primary'} variant="extended" onClick={() => setRegister(false)}>
              <ListAltIcon sx={{ mr: 1 }}/>
              <div style={{marginRight: 8}}>برو به لاگین</div>
            </Fab>
          </div>
        </div> :
        <div style={{borderRadius: 32, textAlign: 'center', paddingLeft: 32, paddingRight: 32, paddingtop: 32, paddingBottom: 32, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <img src={CloudIcon} style={{width: 300, height: 300, fill: '#fff', transition: 'top 1s', marginTop: -56}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#000', marginTop: -56, transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <WhiteColorTextField className={classes.root} id="loginUsername" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <WhiteColorTextField className={classes.root} id="loginPassword" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab color={'primary'} variant="extended" style={{marginLeft: 24}} onClick={() => {
              let requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: document.getElementById('loginUsername').value,
                    password: document.getElementById('loginPassword').value,
                }),
                redirect: 'follow'
            };
              fetch(serverRoot + "/auth/login", requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(JSON.stringify(result));
                if (result.status === 'success') {
                  setMe(result.user);
                  setToken(result.session.token);
                  setHomeSpaceId(result.space.id);
                  setHomeRoomId(result.room.id);
                  localStorage.setItem('token', result.session.token);
                  localStorage.setItem('homeSpaceId', result.space.id);
                  localStorage.setItem('homeRoomId', result.room.id);
                  ConnectToIo(localStorage.getItem('token'), () => {
                    socket.off('message-added')
                    socket.on('message-added', ({ msgCopy }) => {
                      if (me.id !== msgCopy.authorId) {
                        addMessageToList(msgCopy)
                        addMessageToList2(msgCopy)
                        addMessageToList3(msgCopy)
                        setLastMessage(msgCopy)
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
                          });
                      }
                    })
                    socket.off('chat-created')
                    socket.on('chat-created', ({ room }) => {
                      addNewChat(room)
                    })
                    socket.off('message-seen')
                    socket.on('message-seen', ({ messages }) => {
                      messages.forEach(msg => replaceMessageInTheList(msg));
                      messages.forEach(msg => replaceMessageInTheList2(msg));
                      messages.forEach(msg => replaceMessageInTheList3(msg));
                    })
                  })
                  document.getElementById('loginUsername').value = '';
                  document.getElementById('loginPassword').value = '';
                  setConfig(result.account);
                  setOpacity(0)
                  setTimeout(() => {
                    gotoPage('/app/home', {});
                  }, 1000)
                }
                else {
                  alert(result.message)
                }
              })
              .catch(error => console.log('error', error));
            }}>
              <VpnKeyIcon/>
              <div style={{marginRight: 8}}>لاگین</div>
            </Fab>
            <Fab color={'primary'} variant="extended" onClick={() => setRegister(true)}>
              <ListAltIcon/>
              <div style={{marginRight: 8}}>برو به ثبت نام</div>
            </Fab>
          </div>
        </div>
      }
      <div style={{width: '100%', height: 72}}/>
    </div>
  )
}

export default Authentication;