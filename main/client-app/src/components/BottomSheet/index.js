
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function SideMenu(props) {
  const classes = useStyles();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    props.setDrawerOpen(open);
  };

  return (
        <SwipeableDrawer
            anchor={'bottom'}
            open={props.drawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            {props.children}
        </SwipeableDrawer>
  );
}
