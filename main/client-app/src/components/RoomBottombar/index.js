import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DescriptionIcon from '@material-ui/icons/Description';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import VideocamIcon from '@material-ui/icons/Videocam';
import React, { useEffect } from 'react';
import { inTheGame, isDesktop, isInRoom } from '../../App';
import { isConfConnected } from '../../modules/confbox';
import { colors } from '../../util/settings';
import { useForceUpdate } from '../../util/Utils';

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

export default function RoomBottombar(props) {
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
  }, [])

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => {
        props.setCurrentRoomNav(newValue);
        blinkRoomBottomBar();
      }}
      showLabels
      className={classes.root}
      style={{width: isDesktop() ? 450 : '100%', height: 72, transform: isDesktop() ? 'rotate(90deg)' : undefined, zIndex: 2489, position: 'fixed', bottom: (inTheGame && shown) ? isDesktop() ? '50%' : 16 : '-50%', left: isDesktop() ? -160 : undefined, borderRadius: isDesktop() ? 32 : 0, transition: 'bottom .5s', backgroundColor: colors.primaryMedium, backdropFilter: 'blur(10px)'}}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="میز کار" icon={<DesktopMacIcon />} />
      <BottomNavigationAction value={1} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="وایت بورد" icon={<BorderColorIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="کنفرانس" icon={<VideocamIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="برنامه ریزی" icon={<AssignmentTurnedInIcon />} />
      <BottomNavigationAction value={4} classes={classesAction} style={{transform: isDesktop() ? 'rotate(-90deg)' : undefined}} label="فایل ها" icon={<DescriptionIcon />} />
    </BottomNavigation>
  );
}
