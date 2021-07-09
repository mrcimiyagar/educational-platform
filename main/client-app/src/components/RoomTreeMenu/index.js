import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import {RoomTreeBox} from '../RoomTreeBox';
import store, { switchRoomTreeMenu } from '../../redux/main';
import { useForceUpdate } from '../../util/Utils';
import { propTypes } from 'react-polls';

export let forceUpdateRoomTreeMenu = undefined

export default function RoomTreeMenu(props) {

  forceUpdateRoomTreeMenu = useForceUpdate()

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    store.dispatch(switchRoomTreeMenu(open))
    forceUpdateRoomTreeMenu()
  };

  return (
    <div>
      <Drawer anchor={'right'} style={{height: '100vh'}} open={store.getState().global.roomTreeMode} onClose={toggleDrawer(false)}>
        <div
          style={{width: 500, height: '100vh'}}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <RoomTreeBox membership={props.membership} roomId={props.roomId} room={props.room}/>
        </div>
      </Drawer>
    </div>
  );
}
