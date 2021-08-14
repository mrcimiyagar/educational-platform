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

const useStyles = makeStyles({
  root: {
    width: '100%',
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

export default function HomeBottombar(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        props.setCurrentNav(newValue)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value={0} classes={classesAction} label="گفتگو ها" icon={<HomeIcon />}/>
      <BottomNavigationAction value={1} classes={classesAction} label="فضا ها" icon={<AccountBalanceIcon />} />
      <BottomNavigationAction value={2} classes={classesAction} label="اعلانات" icon={<NotificationsIcon />} />
      <BottomNavigationAction value={3} classes={classesAction} label="تنظیمات" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}
