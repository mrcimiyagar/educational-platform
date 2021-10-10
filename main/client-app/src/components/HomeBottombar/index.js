import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { isDesktop } from '../../App';
import store, { setCurrentMessengerNav } from '../../redux/main';
import { colors } from '../../util/settings';
import { useForceUpdate } from '../../util/Utils';
import { updateHome } from '../HomeMain';

const useStyles = makeStyles({
  root: {
    height: 72,
    position: 'fixed',
    bottom: 0,
  },
});

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: '#666',
    '&$selected': {
      color: '#333',
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
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(15px)',
        width: isDesktop() ? 400 : '100%',
        transform: isDesktop() ? 'rotate(90deg)' : undefined,
        position: isDesktop() ? 'fixed' : undefined,
        left: isDesktop() ? (-274 + 32 + 100) : undefined,
        top: isDesktop() ? 'calc(50% - 56px)' : undefined,
        borderRadius: isDesktop() ? 32 : undefined
      }}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="گفتگو ها" icon={<HomeIcon />}/>
      <BottomNavigationAction value={1} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="فضا ها" icon={<AccountBalanceIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="اعلانات" icon={<NotificationsIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="تنظیمات" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}
