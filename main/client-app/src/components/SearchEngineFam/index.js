import { Slide, Zoom } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ExploreIcon from '@material-ui/icons/Explore';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import NavigationIcon from '@material-ui/icons/Navigation';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import React from 'react';
import { animatePageChange, gotoPageWithDelay, isDesktop, isInMessenger, isInRoom, isTablet } from '../../App';
import { theme } from '../../util/settings';
import { isMobile, useForceUpdate } from '../../util/Utils';

export let notifyUrlChanged = undefined

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    position: 'fixed',
    flexGrow: 1
  }
}));

const actions = [
  { icon: <Home />, name: 'خانه' },
  { icon: <LocationCityIcon />, name: 'شهر' },
  { icon: <ExploreIcon />, name: 'گردش' },
  { icon: <StoreMallDirectoryIcon />, name: 'فروشگاه' },
  { icon: <AccountBalanceIcon />, name: '+روم' },

];

export default function Jumper(props) {
  const classes = useStyles();
  let forceUpdate = useForceUpdate()
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  notifyUrlChanged = () => {
    forceUpdate()
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}
      style={{
        bottom: window.location.pathname === '/app/searchengine' ? 0 :
                (isInMessenger() && isDesktop()) ? -12 :
                window.location.pathname === '/app/home' ? ((isMobile() || isTablet()) ? -16 : 40) :
                60
      }}>
      <ThemeProvider theme={theme}>
          <Slide direction="left" in={props.inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
      <SpeedDial
        ariaLabel=""
        color={'secondary'}
        hidden={hidden}
        icon={<NavigationIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              props.setOpen(false)
              animatePageChange()
              if (index === 0) {
                gotoPageWithDelay('/app/messenger')
              }
              else if (index === 1) {
                gotoPageWithDelay('/app/room', {room_id: 1})
              }
              else if (index === 2) {
                gotoPageWithDelay('/app/searchengine')
              }
              else if (index === 3) {
                gotoPageWithDelay('/app/store')
              }
              else if (index === 4) {
                gotoPageWithDelay('/app/createroom')
              }
            }}
          />
        ))}
      </SpeedDial>
      </Slide>
      </ThemeProvider>
    </div>
  );
}
