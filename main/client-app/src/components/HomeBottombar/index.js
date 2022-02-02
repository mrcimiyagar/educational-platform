import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { gotoPage, isDesktop, setInTheGame } from '../../App';
import store, { setCurrentMessengerNav } from '../../redux/main';
import { colors } from '../../util/settings';
import { useForceUpdate } from '../../util/Utils';
import { updateHome } from '../HomeMain';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import Chat from '@material-ui/icons/Chat';

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
    color: '#eee',
    '&$selected': {
      color: '#fff',
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
});

export default function HomeBottombar(props) {
  let forceUpdate = useForceUpdate();
  const classes = useStyles();
  const classesAction = useStylesAction();

  let [value, setValue] = React.useState(props.tabIndex);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
        setInTheGame(false);
        setTimeout(() => {
          store.dispatch(setCurrentMessengerNav(newValue));
          const urlSearchParams = new URLSearchParams(window.location.search)
          let entries = Object.fromEntries(urlSearchParams.entries())
          entries.tab_index = newValue;
          gotoPage('/app/home', entries);
          updateHome();
          forceUpdate();
          setInTheGame(true);
        }, 1000);
      }}
      showLabels
      className={classes.root}
      style={{
        zIndex: 2,
        bottom: props.inTheGame ? 0 : -80,
        transition: 'bottom .5s',
        backgroundColor: colors.primaryMedium,
        width: isDesktop() ? 400 : '100%',
        transform: isDesktop() ? 'rotate(90deg)' : undefined,
        position: 'fixed',
        left: isDesktop() ? (-274 + 32 + 100) : undefined,
        top: isDesktop() ? 'calc(50% - 56px)' : undefined,
        borderRadius: isDesktop() ? 32 : undefined,
        backdropFilter: 'blur(10px)'
      }}
    >
      <BottomNavigationAction value={0} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="گفتگو ها" icon={<Chat />}/>
      <BottomNavigationAction value={4} classes={classesAction} style={{
        transform: isDesktop() ? 'rotate(-90deg)' : undefined
      }} label="میز کار" icon={<DesktopMacIcon />} />
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
