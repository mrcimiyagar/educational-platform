import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import store, { setCurrentMessengerNav } from '../../redux/main';
import { useForceUpdate } from '../../util/Utils';
import { updateHome } from '../HomeMain';
import { isDesktop } from '../../App';

const useStyles = makeStyles({
  root: {
    height: 72,
    position: 'fixed',
    bottom: 0,
    backgroundColor: 'rgba(21, 96, 233, 0.65)',
    backdropFilter: 'blur(10px)'
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

let valueBackup = 0

export default function HomeBottombar(props) {
  let forceUpdate = useForceUpdate()
  const classes = useStyles();
  const classesAction = useStylesAction();

  let currNav = store.getState().global.main.currentRoomNav
  let [value, setValue] = React.useState(valueBackup)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        store.dispatch(setCurrentMessengerNav(newValue))
        setValue(newValue)
        valueBackup = newValue
        updateHome()
        forceUpdate()
      }}
      showLabels
      className={classes.root}
      style={{
        width: isDesktop === 'desktop' ? 400 : '100%',
        transform: isDesktop === 'desktop' ? 'rotate(90deg)' : undefined,
        position: isDesktop === 'desktop' ? 'fixed' : undefined,
        left: isDesktop === 'desktop' ? (-274 + 16 + 100) : undefined,
        top: isDesktop === 'desktop' ? 'calc(50% - 56px)' : undefined,
        borderRadius: isDesktop === 'desktop' ? 32 : undefined
      }}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{
        transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined
      }} label="گفتگو ها" icon={<HomeIcon />}/>
      <BottomNavigationAction value={1} classes={classesAction} style={{
        transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined
      }} label="فضا ها" icon={<AccountBalanceIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} style={{
        transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined
      }} label="اعلانات" icon={<NotificationsIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} style={{
        transform: isDesktop === 'desktop' ? 'rotate(-90deg)' : undefined
      }} label="تنظیمات" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}
