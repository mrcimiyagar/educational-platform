import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import ExtensionIcon from '@material-ui/icons/Extension';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import React from 'react';
import store, { setCurrentStoreNav } from '../../redux/main';
import { updateStore } from '../../routes/pages/store';
import { useForceUpdate } from '../../util/Utils';

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

export default function HomeBottombar() {
  let forceUpdate = useForceUpdate()
  const classes = useStyles();
  const classesAction = useStylesAction();
  let [value, setValue] = React.useState(0)

  let currNav = store.getState().global.main.currentStoreNav

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
        store.dispatch(setCurrentStoreNav(newValue))
        updateStore()
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value={0} classes={classesAction} label="اپ بات ها" icon={<ExtensionIcon />}/>
      <BottomNavigationAction value={1} classes={classesAction} label="گیم بات ها" icon={<SportsEsportsIcon />} />
    </BottomNavigation>
  );
}
