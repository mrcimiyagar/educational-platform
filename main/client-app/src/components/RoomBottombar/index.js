import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { isDesktop, setCurrentNav } from '../../App';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import VideocamIcon from '@material-ui/icons/Videocam';
import DescriptionIcon from '@material-ui/icons/Description';

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

export default function RoomBottombar(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();

  let [bottom, setBottom] = React.useState(isDesktop ? 16 : 0)

  useEffect(() => {
    setBottom(isDesktop ? 16 : 0)
  }, [isDesktop])

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => {
        props.setCurrentRoomNav(newValue);
        props.setCurrentRoomNavBackup(newValue)
        setBottom(-80)
        setTimeout(() => setBottom(isDesktop ? 16 : 0), 500)
      }}
      showLabels
      className={classes.root}
      style={{width: isDesktop ? 450 : '100%', height: 72, zIndex: 99999, position: 'absolute', bottom: bottom, left: isDesktop ? 'calc(50% - 225px)' : undefined, borderRadius: isDesktop ? 32 : 0, transition: 'bottom .5s', backgroundColor: 'rgba(21, 96, 233, 0.65)', backdropFilter: 'blur(10px)'}}
    >
      <BottomNavigationAction value={0} classes={classesAction} label="میز کار" icon={<DesktopMacIcon />} />
      <BottomNavigationAction value={1} classes={classesAction} label="وایت بورد" icon={<BorderColorIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} label="کنفرانس" icon={<VideocamIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} label="برنامه ریزی" icon={<AssignmentTurnedInIcon />} />
      <BottomNavigationAction value={4} classes={classesAction} label="فایل ها" icon={<DescriptionIcon />} />
    </BottomNavigation>
  );
}
