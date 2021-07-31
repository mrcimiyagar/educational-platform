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
import { gotoPage } from '../../App';
import { reloadBotsBox } from '../../modules/botsbox';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const actions = [
  { icon: <Chat />, name: 'پیامرسان' },
  { icon: <Home />, name: 'فضای خانه' },
];

export default function SearchEngineFam(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

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
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
      <SpeedDial
        ariaLabel=""
        className={classes.speedDial}
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
              if (index === 0) {
                gotoPage('/app/messenger')
              }
              else if (index === 1) {
                gotoPage('/app/conf?room_id=1')
              }
            }}
          />
        ))}
      </SpeedDial>
      </ThemeProvider>
    </div>
  );
}
