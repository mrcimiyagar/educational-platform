import { Fab, Slide, Toolbar, Zoom } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import RadioIcon from '@material-ui/icons/Radio';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  cacheChat,
  fetchChats,
  gotoPage,
  histPage,
  inTheGame,
  isDesktop,
  isInMessenger,
  isInRoom,
  isMobile,
  isTablet,
  setInTheGame,
} from '../../App';
import ChatEmbedded from '../../components/ChatEmbedded';
import store from '../../redux/main';
import { setColors, colors, token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';
import AllChats from '../AllChats';
import BotChats from '../BotChats';
import ChannelChats from '../ChannelChats';
import ChatEmbeddedInMessenger from '../ChatEmbeddedInMessenger';
import GroupChats from '../GroupChats';
import HomeBottombar from '../HomeBottombar';
import HomeDrawer from '../HomeDrawer';
import HomeNotifs from '../HomeNotifs';
import HomeSearchbar from '../HomeSearchbar';
import HomeSettings from '../HomeSettings';
import HomeToolbar from '../HomeToolbar';
import Jumper from '../SearchEngineFam';
import SpacesGrid from '../SpacesGrid';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import HomePage from '../../routes/pages/home';
import HomeMessenger from '../HomeMessenger';
import { RocketLaunch } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
      style={{ width: '100%', height: '100%' }}
    >
      {value === index && (
        <Box p={3} style={{ width: '100%', height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: isDesktop() && isInRoom() ? 256 + 32 + 32 + 8 + 64 : undefined,
    width: isDesktop() && isInRoom() ? 450 : '100%',
    maxWidth: isDesktop() && isInRoom() ? 450 : '100%',
    height: '100%',
  },
  indicator: {
    backgroundColor: '#fff',
  },
  tab: {
    minWidth: isDesktop() || isTablet() ? 100 : undefined,
    maxWidth: isDesktop() || isTablet() ? 100 : undefined,
    width: isDesktop() || isTablet() ? 100 : undefined,
    color: '#fff',
  },
}))

export let updateHome = undefined
export let setLastMessage = () => {}
export let addNewChat = () => {}
export let updateChat = () => {}

let tabIndexBackup = 0;
let searchText = '';

export default function HomeAppbar(props) {
  updateHome = useForceUpdate()
  const classes = useStyles()

  const [jumperOpen, setJumperOpen] = React.useState(true)
  const [value, setValue] = React.useState(3)
  let [chats, setChats] = React.useState([])
  let [drawerOpen, setDrawerOpen] = React.useState(false)
  let searchFilltered = chats.filter(chat => {
    if (chat.title !== undefined && chat.title !== null && chat.title.includes(searchText)) {
      return true;
    }
    else if (chat.participent !== undefined && chat.participent !== null &&
      (chat.participent.firstName + ' ' + chat.participent.lastName).includes(searchText)) {
        return true;
    }
    else {
      return false;
    }
  })

  /*useEffect(() => {
    fetchChats().then(chats => {
     setChats(chats);
    })
  }, []);*/

  setLastMessage = (msg, targetChat) => {
    try {
      if (chats.filter((c) => c.id === msg.roomId).length > 0) {
        chats.filter((c) => c.id === msg.roomId)[0].lastMessage = msg
        chats.sort(function (a, b) {
          if (a.lastMessage === undefined && b.lastMessage === undefined)
            return 0
          if (b.lastMessage === undefined) return 0 - a.lastMessage.time
          if (a.lastMessage === undefined) return b.lastMessage.time - 0
          return b.lastMessage.time - a.lastMessage.time
        })
        if (targetChat !== undefined) {
          chats.forEach(chat => {
            if (targetChat.id === chat.id) {
              chat.lastMessage = targetChat.lastMessage;
              chat.unread = targetChat.unread;
            }
          });
        }
        setChats(chats)
        updateHome()
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  addNewChat = (chat) => {
    try {
      chats.unshift(chat)
      chats.sort(function (a, b) {
        if (a.lastMessage === undefined && b.lastMessage === undefined) return 0
        if (b.lastMessage === undefined) return 0 - a.lastMessage.time
        if (a.lastMessage === undefined) return b.lastMessage.time - 0
        return b.lastMessage.time - a.lastMessage.time
      })
      setChats(chats)
      updateHome()
    } catch (ex) {
      console.log(ex)
    }
  }

  updateChat = (chat) => {
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].id === chat.id) {
        chats[i] = chat
        setChats(chats)
        updateHome()
        break
      }
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      redirect: 'follow',
    }
    fetch(serverRoot + '/chat/get_chats', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        result.rooms.forEach((chat) => {
          cacheChat(chat)
        })
        result.rooms.sort(function (a, b) {
          if (a.lastMessage === undefined && b.lastMessage === undefined)
            return 0
          if (b.lastMessage === undefined) return 0 - a.lastMessage.time
          if (a.lastMessage === undefined) return b.lastMessage.time - 0
          return b.lastMessage.time - a.lastMessage.time
        })
        setChats(result.rooms)
      })
      .catch((error) => console.log('error', error))

      setInTheGame(true);
  }, []);

  if (props.tabIndex !== undefined) {
    tabIndexBackup = props.tabIndex;
  }

  return (
    <div className={classes.root}>
      {tabIndexBackup === '4' ?
        <HomePage/>
      : tabIndexBackup === '0' ? 
        <HomeMessenger
          chats={searchFilltered}
          onSearch={(text) => {
            searchText = text;
            updateHome();
          }}
          value={value}
          handleChange={handleChange}
          setDrawerOpen={setDrawerOpen}/>
        : tabIndexBackup === '1' ? (
        <SpacesGrid setDrawerOpen={setDrawerOpen} />
      ) : tabIndexBackup === '2' ? (
        <HomeNotifs setDrawerOpen={setDrawerOpen} />
      ) : tabIndexBackup === '3' ? (
        <HomeSettings setDrawerOpen={setDrawerOpen} />
      ) : null}
        <Fab
          onClick={() => gotoPage("/app/rocket")}
          style={{
            position: "fixed",
            right: isDesktop() ? 
                    (tabIndexBackup === '4') ? (16 + 450) :
                    48 :
                    isMobile() ? 16 : 32,
            bottom: isDesktop() ? (tabIndexBackup === '4') ? 16 : 48 : (64 + 24),
            zIndex: 2500,
          }}
        >
          <RocketLaunch />
        </Fab>
      <HomeBottombar inTheGame={inTheGame} tabIndex={tabIndexBackup}/>
      <HomeDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </div>
  )
}
