import { AppBar, Box, Card, Fab, Grow, Slide, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import ExtensionIcon from '@material-ui/icons/Extension';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { gotoPage, inTheGame, isDesktop } from '../../App';
import HomeToolbar from '../../components/HomeToolbar';
import Jumper from '../../components/SearchEngineFam';
import StoreBottombar from '../../components/StoreBottombar';
import StoreSearchbar from '../../components/StoreSearchbar';
import { colors, token } from '../../util/settings';
import { registerEvent, serverRoot, useForceUpdate } from '../../util/Utils';
import InboxIcon from '@mui/icons-material/Inbox';
import CategoryIcon from '@mui/icons-material/Category';
import { SmartToy } from '@mui/icons-material';
import { Navigation } from '@material-ui/icons';
import StoreFam from '../../components/StoreFam';
import { setWallpaper } from '../..';

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

export let updateStore = undefined
let categories = [];

export default function Store() {

  document.documentElement.style.overflow = 'auto';

  const classes = useStyles();
  let forceUpdate = useForceUpdate()
  updateStore = forceUpdate

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  useEffect(() => {

    setWallpaper({
      type: 'color',
      color: colors.accentDark
    });

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

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <AppBar style={{backgroundColor: colors.primaryMedium}}>
          <Toolbar style={{marginTop: 16}}>
            <StoreSearchbar setDrawerOpen={(v) => {
              
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
                <ImageListItem style={{width: finalWidth, height: finalWidth + 56, marginLeft: 12, marginRight: 12}} key={'store-bot-'+ item.id} cols={1} onClick={() => gotoPage('/app/storebot')}>
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
      <Fab color="secondary" style={{position: 'fixed', bottom: 16 + 72, left: 16}}>
        <ShoppingCartIcon />
      </Fab>
      <Fab size="medium" color="primary" style={{position: 'fixed', bottom: 16 + 72 + 56 + 16, left: 20}} onClick={() => gotoPage('/app/storeads')}>
        <ViewCompactIcon />
      </Fab>
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
  );
}
