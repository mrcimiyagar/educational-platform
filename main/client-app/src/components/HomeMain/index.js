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
import { isDesktop } from '../../App';
import ChatEmbedded from '../../components/ChatEmbedded'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
      style={{width: '100%', height: '100%'}}
    >
      {value === index && (
        <Box p={3} style={{width: '100%', height: '100%'}}>
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
    marginRight: isDesktop ? (256 + 32 + 32 + 8) : undefined,
    width: isDesktop ? 600 : '100%',
    maxWidth: isDesktop ? 600 : '100%',
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

export let updateHome = undefined

export default function HomeAppbar(props) {
  updateHome = useForceUpdate()
  const classes = useStyles()

  let [selectedRoomId, setSelectedRoomId] = React.useState(undefined)
  let [selectedUserId, setSelectedUserId] = React.useState(undefined)
  const [jumperOpen, setJumperOpen] = React.useState(true);
  const [value, setValue] = React.useState(0)
  let currNav = store.getState().global.main.currentMessengerNav
  let [chats, setChats] = React.useState([])
  let [drawerOpen, setDrawerOpen] = React.useState(false)

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
        <AppBar style={{marginRight: isDesktop ? 256 + 32 + 32 : undefined, width: isDesktop ? 630 : '100%', backgroundColor: 'rgba(21, 96, 233, 0.65)', backdropFilter: 'blur(10px)'}}>
          <Toolbar style={{marginTop: 16}}>
            <HomeSearchbar setDrawerOpen={setDrawerOpen}/>
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
      <div style={{position: 'absolute', width: isDesktop ? 630 : 'calc(100% + 16px)', height: isDesktop ? 'calc(100vh - 128px)' : 'calc(100vh - 128px - 56px)', backgroundColor: isDesktop ? 'rgba(255, 255, 255, 0.45)' : undefined, backdropFilter:  isDesktop ? 'blur(10px)' : undefined, marginLeft: -8, marginRight: -8, marginTop: isDesktop ? 88 : 72}}>
        <TabPanel value={value} index={0} style={{width: '100%', height: '100%', borderRadius: 16}}>
            <div style={{width: '100%', height: '100%', overflow: 'auto', direction: 'ltr'}}>
              <div style={{width: '100%', height: 16}}/>
              <AllChats setSelectedRoomId={setSelectedRoomId} setSelectedUserId={setSelectedUserId} chats={chats.filter(c => c.chatType === 'p2p')}/>
              <div style={{width: '100%', height: 100}}/>
            </div>
        </TabPanel>
        <TabPanel value={value} index={1} style={{width: '100%', height: '100%', borderRadius: 16}}>
            <div style={{width: '100%', height: '100%', overflow: 'auto', direction: 'ltr'}}>
              <div style={{width: '100%', height: 16}}/>
              <GroupChats setSelectedRoomId={setSelectedRoomId} chats={chats.filter(c => c.chatType === 'group')}/>
              <div style={{width: '100%', height: 100}}/>
            </div>
        </TabPanel>
        <TabPanel value={value} index={2} style={{width: '100%', height: '100%', borderRadius: 16}}>
            <div style={{width: '100%', height: '100%', overflow: 'auto', direction: 'ltr'}}>
              <div style={{width: '100%', height: 16}}/>
              <ChannelChats setSelectedRoomId={setSelectedRoomId} chats={chats.filter(c => c.chatType === 'channel')}/>
              <div style={{width: '100%', height: 100}}/>
            </div>
        </TabPanel>
        <TabPanel value={value} index={3} style={{width: '100%', height: '100%', borderRadius: 16}}>
            <div style={{width: '100%', height: '100%', overflow: 'auto', direction: 'ltr'}}>
              <div style={{width: '100%', height: 16}}/>
              <BotChats setSelectedRoomId={setSelectedRoomId} chats={chats.filter(c => c.chatType === 'bot')}/>
              <div style={{width: '100%', height: 100}}/>
            </div>
        </TabPanel>
      </div>
      {
        isDesktop ?
          <div style={{width: 'calc(100% - 625px)', height: 'calc(100% - 96px)', position: 'fixed', left: 0, top: 0}}>
            <ChatEmbedded roomId={selectedRoomId} userId={selectedUserId}/>  
          </div>:
          null
      }
      <Fab color="secondary" style={{position: 'fixed', bottom: isDesktop ? 16 : 72 + 16, left: isDesktop ? undefined : 16, right: isDesktop ? (568 + 256 + 32 + 32 - 16) : undefined}}>
        <EditIcon />
      </Fab>
    </div>
        ) :
        currNav === 1 ?
          (
            <SpacesGrid setDrawerOpen={setDrawerOpen}/>
          ) :
          currNav === 2 ?
            (
              <HomeNotifs setDrawerOpen={setDrawerOpen}/>
            ) :
            currNav === 3 ?
              (
                <HomeSettings setDrawerOpen={setDrawerOpen}/>
              )
        :
        null
      }
      <div style={{position: 'fixed', right: 16, bottom: 4}}>
        <Jumper open={jumperOpen} setOpen={setJumperOpen}/>
      </div>
      <HomeBottombar/>
      <HomeDrawer open={drawerOpen} setOpen={setDrawerOpen}/>
    </div>
  )
}
