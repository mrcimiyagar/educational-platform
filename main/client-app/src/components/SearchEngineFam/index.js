import React from 'react';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Home } from '@material-ui/icons';
import Chat from '@material-ui/icons/Chat';
import NavigationIcon from '@material-ui/icons/Navigation';
import { pink } from '@material-ui/core/colors';
import { animatePageChange, gotoPage, gotoPageWithDelay, isDesktop } from '../../App';
import { reloadBotsBox } from '../../modules/botsbox';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import ExploreIcon from '@material-ui/icons/Explore';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { useForceUpdate } from '../../util/Utils';

export let notifyUrlChanged = undefined

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    position: 'fixed',
    flexGrow: 1,
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
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
      },
      secondary: pink
    },
  });

  return (
    <div className={classes.root}
      style={{
        bottom: window.location.pathname === '/app/searchengine' ? 0 :
                (window.location.pathname === '/app/messenger' && isDesktop) ? -12 :
                60
      }}>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}
