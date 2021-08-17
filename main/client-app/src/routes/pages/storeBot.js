import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { AppBar, Avatar, Box, Card, Dialog, Fab, IconButton, Slide, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import StoreSearchbar from '../../components/StoreSearchbar';
import HomeToolbar from '../../components/HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import ExtensionIcon from '@material-ui/icons/Extension';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import StoreHead from '../../components/StoreHead';
import StoreBottombar from '../../components/StoreBottombar';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import StoreComments from '../../components/StoreComments';
import StoreSimiliar from '../../components/StoreSimiliar';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { gotoPage, popPage, registerDialogOpen } from '../../App';
import Carousel from 'react-spring-3d-carousel';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import BotIcon from '../../images/robot.png'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    overflow: 'auto',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
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

const slides = [
  {
    key: 0,
    content: <img onClick={() => gotoPage('/app/photoviewer')} style={{width: 100}} src={'https://picsum.photos/600/800/?random'} alt="" />
  },
  {
    key: 1,
    content: <img onClick={() => gotoPage('/app/photoviewer')} style={{width: 100}} src={'https://picsum.photos/600/800/?random'} alt="" />
  },
  {
    key: 2,
    content: <img onClick={() => gotoPage('/app/photoviewer')} style={{width: 100}} src={'https://picsum.photos/600/800/?random'} alt="" />
  },
  {
    key: 3,
    content: <img onClick={() => gotoPage('/app/photoviewer')} style={{width: 100}} src={'https://picsum.photos/600/800/?random'} alt="" />
  },
];

export default function StoreBot() {
  
  document.documentElement.style.overflow = 'auto';

  const classes = useStyles();
  const [value, setValue] = React.useState(0)
  const [open, setOpen] = React.useState(true);
  let [dest, setDest] = React.useState(3)
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  return (
    <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
    <div className={classes.root}>

      <img style={{width: 'calc(100% - 256px)', marginLeft: 128, marginRight: 128, marginTop: 72, marginBottom: 72}} src={BotIcon}/>
      
      <div style={{padding: 12, display: 'flex'}}>
        <Typography variant={'h6'} style={{color: '#fff'}}>بات ماشین حساب</Typography>
        <Rating name="read-only" value={2} readOnly style={{paddingLeft: 16, paddingTop: 8, paddingRight: 16, borderRadius: '0 20px 20px 0',  position: 'absolute', left: 0, height: 40}}/>
      </div>

      <IconButton style={{width: 32, height: 32, margin: 16, position: 'absolute', top: 0}} onClick={() => popPage()}>
        <ArrowForwardIcon style={{fill: '#fff'}}/>
      </IconButton>

      <Typography style={{padding: 12, color: '#fff'}}>
      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده
      </Typography>

      <div style={{width: '100%', height: 200, position: 'relative'}}>
        <div style={{width: 'calc(100% - 64px)', height: '100%', margin: 32}}>
          <Carousel slides={slides} goToSlide={dest}/>
        </div>
        <IconButton style={{position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)'}} onClick={() => {setDest(dest + 1)}}>
          <ArrowForward style={{fill: '#fff'}}/>
        </IconButton>
        <IconButton style={{position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)'}} onClick={() => {setDest(dest - 1)}}>
          <ArrowBack style={{fill: '#fff'}}/>
        </IconButton>
      </div>

      <StoreComments/>

      <StoreSimiliar/>

    </div>
    <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}>
      <LocalMallIcon />
    </Fab>
  </Dialog>
  );
}
