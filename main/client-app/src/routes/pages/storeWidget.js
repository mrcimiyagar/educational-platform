import { AppBar, BottomNavigation, BottomNavigationAction, Box, Card, Dialog, Fab, Grow, Slide, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import ExtensionIcon from '@material-ui/icons/Extension';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { gotoPage, inTheGame, isDesktop, isMobile, isTablet, popPage, setInTheGame } from '../../App';
import HomeToolbar from '../../components/HomeToolbar';
import Jumper from '../../components/SearchEngineFam';
import StoreBottombar from '../../components/StoreBottombar';
import StoreSearchbar from '../../components/StoreSearchbar';
import { colors, token } from '../../util/settings';
import { registerEvent, serverRoot, useForceUpdate } from '../../util/Utils';
import InboxIcon from '@mui/icons-material/Inbox';
import CategoryIcon from '@mui/icons-material/Category';
import { SmartToy } from '@mui/icons-material';
import { Navigation, SportsEsports } from '@material-ui/icons';
import StoreFam from '../../components/StoreFam';
import { setWallpaper } from '../..';
import store, { setCurrentStoreNav } from '../../redux/main';
import Extension from '@material-ui/icons/Extension';

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

const useStyles = makeStyles((theme) => ({
  rootBB: {
    width: '100%',
    height: 72,
    position: 'fixed',
    bottom: 0
  },
  root: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  imageList: {
    paddingTop: 32,
    width: '100%',
    height: 'auto',
    paddingRight: -8,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
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
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
    {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export let updateStore = () => {}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StoreDialog() {

  document.documentElement.style.overflow = 'hidden';

  const classes = useStyles();
  let forceUpdate = useForceUpdate()
  updateStore = forceUpdate

  const [value, setValue] = React.useState(0)
  const [open, setOpen] = React.useState(true);
  const [widgets, setWidgets] = React.useState([]);

  const handleClose = () => {
    setInTheGame(false);
    setOpen(false);
    setTimeout(() => {
      popPage();
    }, 750);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  useEffect(() => {

    registerEvent('widget-created', widget => {

    });
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        botId: props.bot_id
      }),
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/get_widgets", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.widgets !== undefined) {
          setWidgets(result.widgets);
          forceUpdate();
        }
      })
      .catch(error => console.log('error', error));
  }, [])

  let counter = 0;

  let finalColsCount = Math.floor(window.innerWidth / 130);
  let finalWidth = window.innerWidth / finalColsCount;
  
  const classesAction = useStylesAction();
  let [valueBB, setValueBB] = React.useState(0);

  if (isDesktop() || isTablet()) {
    return (
      <div style={{width: '100%', height: '100%'}}>
      <Dialog TransitionComponent={Transition} fullScreen={isMobile()} open={open} onClose={handleClose}
              style={{width: '100%', height: '100%'}}
              PaperProps={{style: {
                transform: 'translateY(72px)',
                minWidth: isMobile() ? '100%' : '75%',
                width: isMobile() ? '100%' : '75%',
                height: isMobile() ? '100%' : '75%',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(10px)',
                borderRadius: isMobile() ? 0 : 24,
                overflow: 'hidden',
                direction: 'rtl'
              }}}
      >
      <div className={classes.root}>
        {categories.map(cat => {
          counter++;
          let counterMini = 0;
          return (
            <TabPanel style={{display: (counter - 1) === value ? 'block' : 'none'}}>
              <ImageList rowHeight={finalWidth + 56} className={classes.imageList} cols={finalColsCount} style={{marginLeft: 16, marginRight: 16, width: 'calc(100% - 32px)'}}>
                {widget.map((item) => {
                  counterMini++;
                return (<Grow
                  in={inTheGame}
                  {...{ timeout: counterMini * 500 }}
                  transitionDuration={1000}
                >
                  <ImageListItem style={{width: finalWidth, height: finalWidth + 56, marginLeft: 12, marginRight: 12}} key={'store-bot-'+ item.id} cols={1} onClick={() => {gotoPage('/app/storebot', {bot_id: item.id})}}>
                    <div style={{width: finalWidth, height: finalWidth, borderRadius: 16, position: 'relative'}}>
                      <img src={'https://icon-library.com/images/bot-icon/bot-icon-5.jpg'} alt={item.title} style={{opacity: 0.65, borderRadius: 16, marginTop: 16, width: finalWidth - 8, height: finalWidth}} />
                      <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: 12, position: 'absolute', top: finalWidth, left: 'calc(50% + 4px)', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', height: 40, position: 'absolute'}}><div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{item.title}</div></Card>
                    </div>
                  </ImageListItem>
                  </Grow>
                )})}
              </ImageList>
            </TabPanel>
          );
        })}
        <Slide
          direction="up"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
        <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}>
          <ShoppingCartIcon />
        </Fab>
        </Slide>
        <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
        <Fab size="medium" color="primary" style={{position: 'fixed', bottom: 16 + 56 + 16, left: 20}} onClick={() => gotoPage('/app/storeads')}>
          <ViewCompactIcon />
        </Fab>
        </Slide>
        <StoreFam />
      </div>
      </Dialog>
        <AppBar style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                        backgroundColor: colors.primaryMedium, position: 'fixed', top: inTheGame ? 0 : -200,
                        left: '50%', transform: 'translateX(-50%)', width: 'auto', maxWidth: 500,
                        zIndex: 99999, borderRadius: '0px 0px 24px 24px', transition: 'top .5s'}}>
            <Toolbar style={{marginTop: 16}}>
              <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
              <StoreSearchbar dialogMode={true} setDrawerOpen={(v) => {
                  setOpen(false);
                  setInTheGame(false);
                  setTimeout(() => {
                    popPage();
                  }, 500);
              }}/>
              </div>
            </Toolbar>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              classes={{
                indicator: classes.indicator
              }}
              style={{width: 'auto', maxWidth: '100%'}}
            >
              {
                categories.map(cat => (
                  <Tab icon={<ExtensionIcon style={{fill: '#fff'}} />} label={<div style={{color: '#fff'}}>{cat.title}</div>}/>
                ))
              }
            </Tabs>
        </AppBar>
      <BottomNavigation
          value={valueBB}
          onChange={(event, newValue) => {
            setValueBB(newValue)
            store.dispatch(setCurrentStoreNav (newValue))
            forceUpdate();
          }}
          showLabels
          className={classes.rootBB}
          style={{zIndex: 99999, width: 300, height: 80, borderRadius: 40, position: 'fixed', left: inTheGame ? 32 : -200, transition: 'left .5s', top: '50%', transform: 'translateY(-50%) rotateZ(90deg)', backgroundColor: colors.primaryMedium}}
        >
          <BottomNavigationAction value={0} classes={classesAction} style={{transform: 'rotateZ(-90deg)'}} label="اپ بات ها" icon={<Extension />}/>
          <BottomNavigationAction value={1} classes={classesAction} style={{transform: 'rotateZ(-90deg)'}} label="گیم بات ها" icon={<SportsEsports />} />
        </BottomNavigation>
      </div>
    ); 
  }
  else {
    return (
      <Dialog TransitionComponent={Transition} fullScreen={isMobile()} open={open} onClose={handleClose}
              style={{width: '100%', height: '100%'}}
              PaperProps={{style: {
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                direction: 'rtl',
                backgroundColor: 'transparent'
              }}}
      >
      <div className={classes.root} style={{
        backgroundColor: 'rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(10px)'
      }}>
        <HomeToolbar>
          <AppBar style={{backgroundColor: colors.primaryMedium}}>
            <Toolbar style={{marginTop: 16}}>
              <StoreSearchbar dialogMode={true} setDrawerOpen={(v) => {
                  setOpen(false);
                  setInTheGame(false);
                  setTimeout(() => {
                    popPage();
                  }, 500);
              }}/>
            </Toolbar>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              classes={{
                indicator: classes.indicator
              }}
              style={{width: '100%'}}
            >
              {
                categories.map(cat => (
                  <Tab icon={<ExtensionIcon style={{fill: '#fff'}} />} label={<div style={{color: '#fff'}}>{cat.title}</div>}/>
                ))
              }
            </Tabs>
          </AppBar>
        </HomeToolbar>
        <div style={{width: '100%', height: 72}}/>
        {categories.map(cat => {
          counter++;
          return (
            <TabPanel style={{display: (counter - 1) === value ? 'block' : 'none'}}>
              <ImageList rowHeight={finalWidth + 56} className={classes.imageList} cols={finalColsCount} style={{marginLeft: 16, marginRight: 16, width: 'calc(100% - 32px)'}}>
                {cat.packages.map((item) => (
                  <ImageListItem key={'store-package-'+ item.id} cols={3} style={{position: 'relative', marginTop: 8}}>
                    <div style={{width: '100%', height: '100%', backdropFilter: 'blur(10px)', position: 'absolute', left: 0, top: 0}}></div>
                    <img src={item.coverUrl} alt={item.title} style={{borderRadius: 16, opacity: '0.65', width: '100%', height: '100%'}} />
                  </ImageListItem>
                ))}
                {cat.bots.map((item) => (
                <Grow
                  in={inTheGame}
                  {...{ timeout: (counter + 1) * 500 }}
                  transitionDuration={1000}
                >
                  <ImageListItem style={{width: finalWidth, height: finalWidth + 56, marginLeft: 12, marginRight: 12}} key={'store-bot-'+ item.id} cols={1} onClick={() => gotoPage('/app/storebot', {bot_id: item.id})}>
                    <div style={{width: finalWidth, height: finalWidth, borderRadius: 16, position: 'relative'}}>
                      <img src={'https://icon-library.com/images/bot-icon/bot-icon-5.jpg'} alt={item.title} style={{opacity: 0.65, borderRadius: 16, marginTop: 16, width: finalWidth - 8, height: finalWidth}} />
                      <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: 12, position: 'absolute', top: finalWidth, left: 'calc(50% + 4px)', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', height: 40, position: 'absolute'}}><div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{item.title}</div></Card>
                    </div>
                  </ImageListItem>
                  </Grow>
                ))}
              </ImageList>
            </TabPanel>
          );
        })}
        <Slide
          direction="up"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
        <Fab color="secondary" style={{position: 'fixed', bottom: 16 + 72, left: 16}}>
          <ShoppingCartIcon />
        </Fab>
        </Slide>
        <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
        <Fab size="medium" color="primary" style={{position: 'fixed', bottom: 16 + 72 + 56 + 16, left: 20}} onClick={() => gotoPage('/app/storeads')}>
          <ViewCompactIcon />
        </Fab>
        </Slide>
        <StoreFam />
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: isDesktop() ? -8 : 0
          }}
        >
          <Jumper />
        </div>
        <StoreBottombar/>
      </div>
      </Dialog>
    );
  }
}
