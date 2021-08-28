import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DescriptionIcon from '@material-ui/icons/Description';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import VideocamIcon from '@material-ui/icons/Videocam';
import React, { useEffect } from 'react';
import { isDesktop } from '../../App';
import { isConfConnected } from '../../modules/confbox';
import { currentRoomNavBackup } from '../../routes/pages/room';
import { useForceUpdate } from '../../util/Utils';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#2196f3'
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

export let updateRoomBottomBar = undefined

export default function RoomBottombar(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();

  updateRoomBottomBar = useForceUpdate()

  let [bottom, setBottom] = React.useState(isDesktop === 'desktop' ? 16 : 0)

  useEffect(() => {
    setBottom(isDesktop === 'desktop' ? 16 : 0)
  }, [isDesktop])

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => {
        props.setCurrentRoomNav(newValue);
        props.setCurrentRoomNavBackup(newValue)
        setBottom(-80)
        setTimeout(() => setBottom(isDesktop === 'desktop' ? 16 : 0), 500)
      }}
      showLabels
      className={classes.root}
      style={{width: isDesktop === 'desktop' ? 450 : '100%', height: 72, transform: isDesktop === 'desktop' ? 'rotate(90deg)' : undefined, zIndex: 2499, position: 'absolute', bottom: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? (currentRoomNavBackup === 2 && isConfConnected) ? 'calc(50% + 112px)' : '50%' : bottom, left: isDesktop === 'desktop' ? -160 : undefined, borderRadius: isDesktop === 'desktop' ? 32 : 0, transition: 'bottom .5s', backgroundColor: 'rgba(21, 96, 233, 0.65)', backdropFilter: 'blur(10px)'}}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined}} label="میز کار" icon={<DesktopMacIcon />} />
      <BottomNavigationAction value={1} classes={classesAction} style={{transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined}} label="وایت بورد" icon={<BorderColorIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} style={{transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined}} label="کنفرانس" icon={<VideocamIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} style={{transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined}} label="برنامه ریزی" icon={<AssignmentTurnedInIcon />} />
      <BottomNavigationAction value={4} classes={classesAction} style={{transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined}} label="فایل ها" icon={<DescriptionIcon />} />
    </BottomNavigation>
  );
}
