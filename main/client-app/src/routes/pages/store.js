import { AppBar, BottomNavigation, BottomNavigationAction, Box, Card, Checkbox, Dialog, Fab, FormControl, FormControlLabel, FormGroup, FormLabel, Grow, Paper, Slide, SwipeableDrawer, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import ExtensionIcon from '@material-ui/icons/Extension';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { animatePageChange, db, gotoPage, histPage, inTheGame, isDesktop, isTablet, popPage, setInTheGame } from '../../App';
import HomeToolbar from '../../components/HomeToolbar';
import Jumper from '../../components/SearchEngineFam';
import StoreBottombar from '../../components/StoreBottombar';
import StoreSearchbar from '../../components/StoreSearchbar';
import { colors, token } from '../../util/settings';
import { isMobile, registerEvent, serverRoot, useForceUpdate } from '../../util/Utils';
import InboxIcon from '@mui/icons-material/Inbox';
import CategoryIcon from '@mui/icons-material/Category';
import { SmartToy } from '@mui/icons-material';
import { AccountBalance, ExitToApp, Explore, Home, Navigation, StoreMallDirectory } from '@material-ui/icons';
import StoreFam from '../../components/StoreFam';
import { pathConfig, setWallpaper } from '../..';
import store, { setCurrentStoreNav } from '../../redux/main';
import Extension from '@material-ui/icons/Extension';
import SportsEsports from '@material-ui/icons/SportsEsports';
import DesktopWallpaper from '../../images/desktop-wallpaper.jpg';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    position: 'absolute',
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
let categories = [];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const actions = [
  { icon: <Home />, name: 'خانه' },
  { icon: <Explore />, name: 'گردش' },
  { icon: <StoreMallDirectory />, name: 'فروشگاه' },
  { icon: <AccountBalance />, name: '+روم' },
  { icon: <ExitToApp/>, name: 'خروج'},
  { icon: <SmartToy/>, name: 'کارگاه'},
]

export default function Store(props) {

  document.documentElement.style.overflow = 'hidden';

  const classes = useStyles();
  let forceUpdate = useForceUpdate()
  updateStore = forceUpdate

  const [value, setValue] = React.useState(0)
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [jumperOpen, setJumperOpen] = React.useState(true);
  const [hidden, setHidden] = React.useState(false)

  const handleClose = () => {
    setInTheGame(false);
    setOpen(false);
    setTimeout(() => {
      props.onClose();
    }, 750);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeOfCheckbox = (event) => {
    setCategory({
      ...category,
      [event.target.name]: event.target.checked,
    });
  };
  
  const classesAction = useStylesAction();
  let [valueBB, setValueBB] = React.useState(0);

  const [category, setCategory] = React.useState({
    books: true,
    notes: true,
    digitals: true,
    electronics: true,
    videos: true,
    bots: true
  });
  
  let filters = (
    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" style={{marginTop: 40, width: 280, direction: 'rtl'}}>
  <FormLabel component="legend" style={{color: '#fff', marginRight: 24}}><b>انواع کالا</b></FormLabel>
  <FormGroup style={{marginTop: 16}}>
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.books} onChange={handleChangeOfCheckbox} name="books" style={{color: '#fff'}} />
      }
      label="کتاب"
    />
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.notes} onChange={handleChangeOfCheckbox} name="notes" style={{color: '#fff'}} />
      }
      label="جزوه"
    />
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.electronics} onChange={handleChangeOfCheckbox} name="electronics" style={{color: '#fff'}} />
      }
      label="قطعات الکترونبکی"
    />
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.digitals} onChange={handleChangeOfCheckbox} name="digitals" style={{color: '#fff'}} />
      }
      label="وسایل دیجیتال"
    />
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.videos} onChange={handleChangeOfCheckbox} name="videos" style={{color: '#fff'}} />
      }
      label="فیلم آموزشی"
    />
    <FormControlLabel style={{color: '#fff'}}
      control={
        <Checkbox checked={category.bots} onChange={handleChangeOfCheckbox} name="bots" style={{color: '#fff'}} />
      }
      label="بات"
    />
  </FormGroup>
  </FormControl>
);

  useEffect(() => {

    registerEvent('bot-created', bot => {
      categories.forEach(cat => {
        if (cat.id === bot.categoryId) {
          cat.bots.push(bot);
          forceUpdate();
        }
      });
    });
    
    registerEvent('store-category-created', cat => {
      cat.bots = [];
      cat.packages = [];
      categories.push(cat);
      forceUpdate();
    });

    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        loadExtra: true
      }),
      redirect: 'follow'
    }
    fetch(serverRoot + "/bot/get_categories", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.categories !== undefined) {
        categories = result.categories;
        result.categories.forEach(cat => {
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              categoryId: cat.id
            }),
            redirect: 'follow'
          }
          fetch(serverRoot + "/bot/get_bots", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              if (result.bots !== undefined) {
                cat.bots = result.bots;
                forceUpdate();
              }
            })
            .catch(error => console.log('error', error));
          let requestOptions2 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              categoryId: cat.id
            }),
            redirect: 'follow'
          }
          fetch(serverRoot + "/bot/get_packages", requestOptions2)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              if (result.packages !== undefined) {
                cat.packages = result.packages;
                forceUpdate();
              }
            })
            .catch(error => console.log('error', error));
        });
        forceUpdate()
        }
      })
      .catch(error => console.log('error', error));
  }, [])

  let counter = 0;

  let finalColsCount = Math.floor(window.innerWidth / 130);
  let finalWidth = window.innerWidth / finalColsCount;

  if (isDesktop() || isTablet()) {
    return (
      <div style={{width: '100%', height: '100%', direction: 'rtl'}}>
      <Fab
        onClick={() => gotoPage("/app/rocket")}
        ariaLabel=""
        style={{position: 'fixed', right: 280 + 80, bottom: 24 + 40, zIndex: 99999}}
      >
        <RocketLaunchIcon />
      </Fab>
      <Dialog TransitionComponent={Transition} fullScreen={isMobile()} open={open}
              style={{width: '100%', height: '100%'}}
              PaperProps={{style: {
                transform: 'translate(-96px, 64px)',
                minWidth: isMobile() ? '100%' : 'calc(85% - 200px)',
                width: isMobile() ? '100%' : 'calc(85% - 200px)',
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
                {cat.packages.map((item) => (
                  <ImageListItem key={'store-package-'+ item.id} cols={3} style={{position: 'relative', marginTop: 8}}>
                    <div style={{width: '100%', height: '100%', backdropFilter: 'blur(10px)', position: 'absolute', left: 0, top: 0}}></div>
                    <img src={item.coverUrl} alt={item.title} style={{borderRadius: 16, opacity: '0.65', width: '100%', height: '100%'}} />
                  </ImageListItem>
                ))}
                {cat.bots.map((item) => {
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
      <AppBar style={{backdropFilter: 'blur(10px)', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                        backgroundColor: colors.primaryMedium, position: 'fixed', top: inTheGame ? 0 : -200,
                        left: '50%', transform: 'translateX(-50%)', width: 'auto', maxWidth: 750,
                        zIndex: 99999, borderRadius: '0px 0px 24px 24px', transition: 'top .5s'}}>
            <Toolbar style={{marginTop: 16}}>
              <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
              <StoreSearchbar dialogMode={false} removeIcon setDrawerOpen={(v) => {
                  
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
            store.dispatch(setCurrentStoreNav(newValue))
            forceUpdate();
          }}
          showLabels
          className={classes.rootBB}
          style={{zIndex: 99999, width: 300, height: 80, borderRadius: 40, position: 'fixed', left: inTheGame ? -64 : -200, transition: 'left .5s', top: '50%', transform: 'translateY(-50%) rotateZ(90deg)', backgroundColor: colors.primaryMedium}}
      >
          <BottomNavigationAction value={0} classes={classesAction} style={{transform: 'rotateZ(-90deg)'}} label="اپ بات ها" icon={<Extension />}/>
          <BottomNavigationAction value={1} classes={classesAction} style={{transform: 'rotateZ(-90deg)'}} label="گیم بات ها" icon={<SportsEsports />} />
      </BottomNavigation>
      <Paper
          className={classes.rootBB}
          style={{zIndex: 99999, width: 280, height: '90%', borderRadius: 24, position: 'fixed',
                  right: inTheGame ? 32 : (-200 - 280), transition: 'right .5s', top: '50%',
                  transform: 'translateY(-50%)', backgroundColor: colors.primaryMedium,
                  backdropFilter: 'blur(10px)'}}
      >
        {filters}
      </Paper>
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
                backgroundColor: 'transparent',
                direction: 'rtl'
              }}}
      >
      <div className={classes.root} style={{
        backgroundColor: 'rgba(24, 34, 44, 0.85)',
        backdropFilter: 'blur(10px)'
      }}>
        <HomeToolbar>
          <AppBar style={{backgroundColor: "rgba(24, 34, 44, 0.85)", backdropFilter: 'blur(10px)'}}>
            <Toolbar style={{marginTop: 16}}>
              <StoreSearchbar dialogMode={false} removeIcon={false} setDrawerOpen={(v) => {
                  handleClose();
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
          let counterMini = 0;
          return (
            <TabPanel style={{display: (counter - 1) === value ? 'block' : 'none'}}>
              <iframe frameBorder={0} src={pathConfig.carouselfrontend}  style={{width: '100%', height: 300}} />
              <ImageList rowHeight={finalWidth + 56} className={classes.imageList} cols={finalColsCount} style={{marginLeft: 16, marginRight: 16, width: 'calc(100% - 32px)'}}>
                {cat.packages.map((item) => (
                  <ImageListItem key={'store-package-'+ item.id} cols={3} style={{position: 'relative', marginTop: 8}}>
                    <div style={{width: '100%', height: '100%', backdropFilter: 'blur(10px)', position: 'absolute', left: 0, top: 0}}></div>
                    <img src={item.coverUrl} alt={item.title} style={{borderRadius: 16, opacity: '0.65', width: '100%', height: '100%'}} />
                  </ImageListItem>
                ))}
                {cat.bots.map((item) => {
                  counterMini++;
                return <Grow
                  in={inTheGame}
                  {...{ timeout: counterMini * 500 }}
                  transitionDuration={1000}
                >
                  <ImageListItem style={{width: finalWidth, height: finalWidth + 56, marginLeft: 12, marginRight: 12}} key={'store-bot-'+ item.id} cols={1} onClick={() => gotoPage('/app/storebot', {bot_id: item.id})}>
                    <div style={{width: finalWidth, height: finalWidth, borderRadius: 16, position: 'relative'}}>
                      <img src={'https://icon-library.com/images/bot-icon/bot-icon-5.jpg'} alt={item.title} style={{opacity: 0.65, borderRadius: 16, marginTop: 16, width: finalWidth - 8, height: finalWidth}} />
                      <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: 12, position: 'absolute', top: finalWidth, left: 'calc(50% + 4px)', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', height: 40, position: 'absolute'}}><div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>{item.title}</div></Card>
                    </div>
                  </ImageListItem>
                  </Grow>
                })}
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
        <StoreBottombar/>
      </div>
      </Dialog>
    );
  }
}
