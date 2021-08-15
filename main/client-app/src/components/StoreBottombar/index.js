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
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import ExtensionIcon from '@material-ui/icons/Extension';
import store, { setCurrentStoreNav } from '../../redux/main';
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

export default function HomeBottombar() {
  let forceUpdate = useForceUpdate()
  const classes = useStyles();
  const classesAction = useStylesAction();

  let currNav = store.getState().global.main.currentStoreNav

  return (
    <BottomNavigation
      value={currNav}
      onChange={(event, newValue) => {
        store.dispatch(setCurrentStoreNav(newValue))
        forceUpdate()
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value={0} classes={classesAction} label="اپ بات ها" icon={<ExtensionIcon />}/>
      <BottomNavigationAction value={1} classes={classesAction} label="گیم بات ها" icon={<SportsEsportsIcon />} />
    </BottomNavigation>
  );
}
