import { Avatar, Box, Dialog, Fab, IconButton, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Done, Message } from '@material-ui/icons';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { default as ArrowForward, default as ArrowForwardIcon } from '@material-ui/icons/ArrowForward';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import 'react-photo-view/dist/index.css';
import Carousel from 'react-spring-3d-carousel';
import { gotoPage, isMobile, popPage, registerDialogOpen } from '../../App';
import StoreComments from '../../components/StoreComments';
import StoreSimiliar from '../../components/StoreSimiliar';
import StoreWidgets from '../../components/StoreWidgets';
import RoomWallpaper from '../../images/roomWallpaper.png';
import { token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'auto',
    direction: 'rtl'
  },
  imageList: {
    paddingTop: 96,
    width: '100%',
    height: 'auto',
    marginLeft: -16,
    marginRight: -16,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function StoreBot(props) {
  
  document.documentElement.style.overflow = 'auto';

  let forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [bot, setBot] = React.useState({});
  const [screenshots, setScreenshots] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  let [dest, setDest] = React.useState(0)
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  return (
    <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    boxShadow: 'none',
                    backdropFilter: colors.blur,
                    width: isMobile() ? '100%' : 500,
                    height: isMobile() ? '100%' : 600,
                    borderRadius: isMobile() ? 0 : 24
                },
            }}
            fullScreen={isMobile()} open={open} onClose={handleClose} TransitionComponent={Transition}>
    <div className={classes.root}>
      
    </div>
    <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}
      onClick={() => {
        
      }}>
      <Done />
    </Fab>
  </Dialog>
  );
}
