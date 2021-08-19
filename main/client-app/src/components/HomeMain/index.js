import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import HomeSearchbar from '../HomeSearchbar';
import HomeToolbar from '../HomeToolbar';
import { Container, Fab, Toolbar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EditIcon from '@material-ui/icons/Edit';
import ChatsList from '../AllChats';
import HomeDrawer from '../HomeDrawer';
import HomeBottombar from '../HomeBottombar';
import ChatIcon from '@material-ui/icons/Chat';
import GroupIcon from '@material-ui/icons/Group';
import RadioIcon from '@material-ui/icons/Radio';
import RedditIcon from '@material-ui/icons/Reddit';
import SpacesGrid from '../SpacesGrid';
import HomeNotifs from '../HomeNotifs';
import HomeSettings from '../HomeSettings';
import RoomWallpaper from '../../images/roomWallpaper.png'
import store from '../../redux/main';
import { serverRoot, useForceUpdate } from '../../util/Utils';
import Jumper from '../SearchEngineFam';
import AllChats from '../AllChats';
import GroupChats from '../GroupChats';
import ChannelChats from '../ChannelChats';
import BotChats from '../BotChats';
import { token } from '../../util/settings';

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

export let updateHome = undefined

export default function HomeAppbar(props) {
  updateHome = useForceUpdate()
  const classes = useStyles()

  const [jumperOpen, setJumperOpen] = React.useState(true);
  const [value, setValue] = React.useState(0)
  let currNav = store.getState().global.main.currentMessengerNav
  let [chats, setChats] = React.useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/chat/get_chats", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              setChats(result.rooms);
          })
          .catch(error => console.log('error', error));
  }, [])

  return (
    <div className={classes.root}>
      {currNav === 0 ?
        (
          <div style={{background: 'transparent'}}>
            <HomeToolbar>
        <AppBar style={{backgroundColor: 'rgba(21, 96, 233, 0.65)', backdropFilter: 'blur(10px)'}}>
          <Toolbar style={{marginTop: 16}}>
            <HomeSearchbar/>
          </Toolbar>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8}}
          >
            <Tab icon={<ChatIcon />} label="چت ها" />
            <Tab icon={<GroupIcon />} label="گروه ها" />
            <Tab icon={<RadioIcon />} label="کانال ها" />
            <Tab icon={<RedditIcon />} label="ربات ها" />
          </Tabs>
        </AppBar>
      </HomeToolbar>
        <TabPanel value={value} index={0} style={{height: 'auto', marginLeft: -8, marginRight: -8, marginTop: 88, borderRadius: 16}}>
            <AllChats chats={chats.filter(c => c.chatType === 'p2p')}/>
        </TabPanel>
        <TabPanel value={value} index={1} style={{height: 'auto', marginLeft: -8, marginRight: -8, marginTop: 88, borderRadius: 16}}>
            <GroupChats chats={chats.filter(c => c.chatType === 'group')}/>
        </TabPanel>
        <TabPanel value={value} index={2} style={{height: 'auto', marginLeft: -8, marginRight: -8, marginTop: 88, borderRadius: 16}}>
            <ChannelChats chats={chats.filter(c => c.chatType === 'channel')}/>
        </TabPanel>
        <TabPanel value={value} index={3} style={{height: 'auto', marginLeft: -8, marginRight: -8, marginTop: 88, borderRadius: 16}}>
            <BotChats chats={chats.filter(c => c.chatType === 'bot')}/>
        </TabPanel>
      <Fab color="secondary" style={{position: 'fixed', bottom: 72 + 16, left: 16}}>
        <EditIcon />
      </Fab>
          </div>
        ) :
        currNav === 1 ?
          (
            <SpacesGrid/>
          ) :
          currNav === 2 ?
            (
              <HomeNotifs/>
            ) :
            currNav === 3 ?
              (
                <HomeSettings/>
              )
        :
        null
      }
      <div style={{position: 'fixed', right: 16, bottom: 4}}>
        <Jumper open={jumperOpen} setOpen={setJumperOpen}/>
      </div>
      <HomeBottombar/>
      <HomeDrawer/>
    </div>
  )
}
