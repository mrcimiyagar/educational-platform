import { Fab, makeStyles, TextField, Typography } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import React, { useEffect } from "react";
import { pathConfig } from '../..';
import { gotoPage } from "../../App";
import CloudIcon from '../../images/logo.png';
import { setMe, setToken } from "../../util/settings";
import { ConnectToIo, serverRoot, setConfig } from "../../util/Utils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFilledInput-root": {
      background: "rgba(255, 255, 255, 0.5)"
    }
  }
}));

function Auth4(props) {
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
    <div style={{width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(10px)'}}>
      
      {register ? 
        <div style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <img src={CloudIcon} style={{width: 300, height: 300, fill: '#fff', transition: 'top 1s', marginTop: -56}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#fff', marginTop: -56, transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <TextField className={classes.root} id="registerUsername" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="registerPassword" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <TextField className={classes.root} id="registerConfirmPass" label="تکرار رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="registerFirstName" label="نام" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <TextField className={classes.root} id="registerLastName" label="نام خانوادگی" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab style={{marginLeft: 24}} onClick={() => {
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
              <VpnKeyIcon/>
            </Fab>
            <Fab onClick={() => setRegister(false)}>
              <ListAltIcon/>
            </Fab>
          </div>
        </div> :
        <div style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <img src={CloudIcon} style={{width: 300, height: 300, fill: '#fff', transition: 'top 1s', marginTop: -56}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#fff', marginTop: -56, transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <TextField className={classes.root} id="loginUsername" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="loginPassword" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab style={{marginLeft: 24}} onClick={() => {
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
                  localStorage.setItem('token', result.session.token);
                  ConnectToIo();
                  document.getElementById('loginUsername').value = '';
                  document.getElementById('loginPassword').value = '';
                  setConfig(result.account);
                  setOpacity(0)
                  setTimeout(() => {
                    window.location.href = pathConfig.mainFrontend + '/app/messenger'
                  }, 1000)
                }
                else {
                  alert(result.message)
                }
              })
              .catch(error => console.log('error', error));
            }}>
              <VpnKeyIcon/>
            </Fab>
            <Fab onClick={() => setRegister(true)}>
              <ListAltIcon/>
            </Fab>
          </div>
        </div>
      }
    </div>
  )
}

export default Auth4;