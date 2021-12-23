import { Fab, makeStyles, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import React, { useEffect } from "react";
import { pathConfig, setWallpaper } from '../..';
import { db, gotoPage, isDesktop, isInRoom } from '../../App';
import Jumper from '../../components/SearchEngineFam';
import WhiteColorTextField from '../../components/WhiteColorTextField';
import Wallpaper from '../../images/chat-wallpaper.jpg';
import CloudIcon from '../../images/logo.png';
import {
  setHomeRoomId,
  setHomeSpaceId,
  setMe,
  setToken
} from '../../util/settings';
import {
  serverRoot, setConfig
} from '../../util/Utils';
import WorkshopWallpaper from '../../images/workshop-wallpaper.jpg';

function Workshop(props) {
  useEffect(() => {
    setWallpaper({type: 'photo', photo: WorkshopWallpaper});
  }, []);
  return (
    <div style={{overflow: 'auto', width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1000}}>
      <iframe name="coder-frame" src={pathConfig.codeServer}
          frameborder="0" style={{border: 0, backgroundColor: 'transparent', background: 'transparent',
          width: '50%', height: '100%', position: 'absolute', left: 0, 
          top: 0, bottom: 0, left: 0}}>
        </iframe>
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: isDesktop() ? -52 : 0
        }}
      >
        <Jumper />
      </div>
      <Fab color={'secondary'} onClick={() => gotoPage('/app/createbot')} style={{position: 'fixed', left: 24, bottom: 24}}>
        <Add/>
      </Fab>
    </div>
  )
}

export default Workshop;
