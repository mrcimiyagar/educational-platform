import React, { useEffect } from "react";
import {Fab, makeStyles, TextField, Typography} from '@material-ui/core'
import CloudIcon from '@material-ui/icons/Cloud'
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ListAltIcon from '@material-ui/icons/ListAlt';

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
  useEffect(() => setTimeout(() => {setLogoTop(100); setOpacity(1)}, 2000), [])
  return (
    <div style={{width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(10px)'}}>
      
      {register ? 
        <div style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <CloudIcon style={{width: 300, height: 200, fill: '#fff', transition: 'top 1s'}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#fff', transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <TextField className={classes.root} id="username" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="password" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <TextField className={classes.root} id="confirmPass" label="تکرار رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="firstName" label="نام" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <TextField className={classes.root} id="lastName" label="نام خانوادگی" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab style={{marginLeft: 24}}>
              <VpnKeyIcon/>
            </Fab>
            <Fab onClick={() => setRegister(false)}>
              <ListAltIcon/>
            </Fab>
          </div>
        </div> :
        <div style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', opacity: opacity, transition: 'opacity 1s', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{width: '100%', height: 'auto'}}>
            <CloudIcon style={{width: 300, height: 200, fill: '#fff', transition: 'top 1s'}}/>
            <Typography variant={'h5'} style={{fontWeight: 'bold', width: '100%', textAlign: 'center', color: '#fff', transition: 'top 1s'}}>به ابر آسمان خوش آمدید</Typography>
          </div>
          <TextField className={classes.root} id="username" label="نام کاربری" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff'}} />
          <TextField className={classes.root} id="password" label="رمز عبور" variant="filled" style={{marginTop: 24, width: '100%', color: '#fff' }} />
          <div style={{width: 'auto', marginTop: 48}}>
            <Fab style={{marginLeft: 24}}>
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