import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DescriptionIcon from '@material-ui/icons/Description';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import VideocamIcon from '@material-ui/icons/Videocam';
import React, { useEffect } from 'react';
import { pathConfig } from '../..';
import { gotoPage, histPage, inTheGame, isDesktop, isInRoom, popPage, series } from '../../App';
import { isConfConnected } from '../../modules/confbox';
import { colors } from '../../util/settings';
import { useForceUpdate } from '../../util/Utils';
import { RichBottomBar } from '../RichComponents';
import { StylesProvider } from '@material-ui/core';
import { AccountBalance, Explore, Home, Store } from '@material-ui/icons';
import SmartToy from '@mui/icons-material/SmartToy';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
});

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
});

export let updateRoomBottomBar = () => {}
export let blinkRoomBottomBar = () => {}
export let closeRoomBottomBar = () => {}
export let openRoomBottomBar = () => {}

export default function RocketDock(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();

  updateRoomBottomBar = useForceUpdate()
  blinkRoomBottomBar = () => {
    setShown(false);
    setTimeout(() => setShown(true), 500);
  };
  closeRoomBottomBar = () => {
    setShown(false);
  };
  openRoomBottomBar = () => {
    setShown(true);
  };

  let [shown, setShown] = React.useState(false)

  useEffect(() => {
    setShown(true);
    window.addEventListener('message', (e) => {
      if (e.data.sender === 'conf') {
        if (e.data.action === 'hideBottomBar') {
          closeRoomBottomBar();
        }
        else if (e.data.action === 'showBottomBar') {
          openRoomBottomBar();
        }
      }
    });
  }, []);

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => {
        if (newValue === 0) {
          if (series[series.length - 2] === '/app/room') {
            if (!window.confirm('این انتقال موجب خروج از این فضا میگردد.')) {
              return;
            }
          }
          popPage();
          gotoPage('/app/home', {tab_index: 0});
        }
        else if (newValue === 1) {
          if (series[series.length - 2] === '/app/room') {
            if (!window.confirm('این انتقال موجب خروج از این فضا میگردد.')) {
              return;
            }
          }
          popPage();
          gotoPage('/app/store');
        }
        else if (newValue === 2) {
          if (series[series.length - 2] === '/app/room') {
            if (!window.confirm('این انتقال موجب خروج از این فضا میگردد.')) {
              return;
            }
          }
          popPage();
          gotoPage('/app/searchengine');
        }
        else if (newValue === 3) {
          if (series[series.length - 2] === '/app/room') {
            if (!window.confirm('این انتقال موجب خروج از این فضا میگردد.')) {
              return;
            }
          }
          popPage();
          gotoPage('/app/workshop');
        }
        else if (newValue === 4) {
          popPage();
          gotoPage('/app/createroom');
        }
      }}
      showLabels
      className={classes.root}
      style={{
        backgroundColor: colors.primaryMedium,
        backdropFilter: 'blur(10px)',
        width: isDesktop() ? 450 : '100%', height: 72, transform: isDesktop() ? 'rotate(90deg)' : undefined, zIndex: 2501, position: 'fixed', bottom: (inTheGame && shown) ? isDesktop() ? '50%' : 0 : '-50%', left: isDesktop() ? -160 : undefined, borderRadius: isDesktop() ? 32 : 0, transition: 'bottom .5s'}}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="خانه" icon={<Home />} />
      <BottomNavigationAction value={1} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="فروشگاه" icon={<Store />} />
      <BottomNavigationAction value={2} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="گردش" icon={<Explore />} />
      <BottomNavigationAction value={3} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="کارگاه" icon={<SmartToy />} />
      <BottomNavigationAction value={4} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="ساخت فضا" icon={<AccountBalance />} />
    </BottomNavigation>
  );
}
