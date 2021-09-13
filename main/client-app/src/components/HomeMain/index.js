import { Fab, Toolbar } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import ChatIcon from '@material-ui/icons/Chat'
import EditIcon from '@material-ui/icons/Edit'
import GroupIcon from '@material-ui/icons/Group'
import RadioIcon from '@material-ui/icons/Radio'
import RedditIcon from '@material-ui/icons/Reddit'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { histPage, isDesktop, isInMessenger, isMobile, isTablet } from '../../App'
import ChatEmbedded from '../../components/ChatEmbedded'
import store from '../../redux/main'
import { setColors, colors, token } from '../../util/settings'
import { serverRoot, useForceUpdate } from '../../util/Utils'
import AllChats from '../AllChats'
import BotChats from '../BotChats'
import ChannelChats from '../ChannelChats'
import ChatEmbeddedInMessenger from '../ChatEmbeddedInMessenger'
import GroupChats from '../GroupChats'
import HomeBottombar from '../HomeBottombar'
import HomeDrawer from '../HomeDrawer'
import HomeNotifs from '../HomeNotifs'
import HomeSearchbar from '../HomeSearchbar'
import HomeSettings from '../HomeSettings'
import HomeToolbar from '../HomeToolbar'
import Jumper from '../SearchEngineFam'
import SpacesGrid from '../SpacesGrid'

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
    marginRight: isDesktop() && histPage === '/app/room' ? 256 + 32 + 32 + 8 + 64 : undefined,
    width: isDesktop() && histPage === '/app/room' ? 450 : '100%',
    maxWidth: isDesktop() && histPage === '/app/room'  ? 450 : '100%',
    height: '100%',
    backgroundColor: colors.accentDark
  },
  indicator: {
    backgroundColor: 'white',
  },
  tab: {
    minWidth: isDesktop() || isTablet() ? 100 : undefined,
    maxWidth: isDesktop() || isTablet() ? 100 : undefined,
    width: isDesktop() || isTablet() ? 100 : undefined,
  },
}))

export let updateHome = undefined
export let setLastMessage = () => {}
export let addNewChat = () => {}

export default function HomeAppbar(props) {
  updateHome = useForceUpdate();
  const classes = useStyles();

  document.documentElement.style.overflowY = 'hidden';

  let [selectedRoomId, setSelectedRoomId] = React.useState(props.selectedChatId);
  let [selectedUserId, setSelectedUserId] = React.useState(props.selectedUserId);
  const [jumperOpen, setJumperOpen] = React.useState(true);
  const [value, setValue] = React.useState(3);
  let currNav = store.getState().global.main.currentMessengerNav;
  let [chats, setChats] = React.useState([]);
  let [drawerOpen, setDrawerOpen] = React.useState(false);

  setLastMessage = (msg) => {
    try {
      if (chats.filter(c => c.id === msg.roomId).length > 0) {
        chats.filter(c => c.id === msg.roomId)[0].lastMessage = msg;
        chats.sort(function(a, b){
          if (b.lastMessage === undefined) return (0 - a.lastMessage.time)
          if (a.lastMessage === undefined) return (b.lastMessage.time - 0)
          return b.lastMessage.time-a.lastMessage.time
        });
        setChats(chats)
        updateHome();
      }
    }
    catch(ex) {console.log(ex)}
  }
  addNewChat = (chat) => {
    try {
      chats.unshift(chat);
      chats.sort(function(a, b){return b.lastMessage.time-a.lastMessage.time});
      setChats(chats);
      updateHome();
    }
    catch(ex) {console.log(ex)}
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
        result.rooms.sort(function(a, b){return b.lastMessage.time-a.lastMessage.time});
        setChats(result.rooms)
      })
      .catch((error) => console.log('error', error))
  }, [])

  return (
    <div className={classes.root}>
      {currNav === 0 ? (
        <div style={{ background: 'transparent', marginRight: (isMobile() || isTablet()) ? 0 : 256 + 136 }}>
          <HomeToolbar>
            <AppBar
              style={{
                borderRadius: !isDesktop()
                  ? undefined
                  : selectedRoomId === undefined
                  ? '24px 24px 0 0'
                  : '0 24px 0 0',
                marginRight: isDesktop() ? 256 + 32 + 32 + 64 : undefined,
                marginTop: isDesktop() ? 32 : undefined,
                width: isDesktop() || isTablet() ? 450 : '100%',
                backgroundColor: colors.primaryMedium,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Toolbar style={{ marginTop: 16 }}>
                <HomeSearchbar setDrawerOpen={setDrawerOpen} />
              </Toolbar>
              <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChange}
                classes={{
                  indicator: classes.indicator,
                }}
                style={{ marginTop: 8, direction: 'ltr' }}
                centered
              >
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<RedditIcon />}
                  label="ربات ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<RadioIcon />}
                  label="کانال ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<GroupIcon />}
                  label="گروه ها"
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<ChatIcon />}
                  label="چت ها"
                />
              </Tabs>
            </AppBar>
          </HomeToolbar>
          <div
            style={{
              position: 'absolute',
              width: isDesktop() || isTablet() ? 450 : 'calc(100% + 16px)',
              height: isDesktop()
                ? 'calc(100% - 184px)'
                : isTablet()
                ? 'calc(100% - 168px)'
                : 'calc(100% - 128px - 32px)',
              backgroundColor:
                isDesktop() || isTablet()
                  ? 'rgba(255, 255, 255, 0.45)'
                  : undefined,
              backdropFilter:
                isDesktop() || isTablet() ? 'blur(10px)' : undefined,
              marginLeft: isMobile() ? -8 : undefined,
              marginRight: isMobile() || isDesktop() ? -8 : undefined,
              marginTop: isDesktop() ? 88 : 56,
              borderRadius:
                isTablet() || isMobile()
                  ? 0
                  : selectedRoomId === undefined
                  ? '0 0 24px 24px'
                  : '0 0 24px 0',
            }}
          >
            <TabPanel
              value={value}
              index={3}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                className="hiddenScrollbar"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  direction: 'ltr',
                }}
              >
                <div style={{ width: '100%', height: isDesktop() ? 48 : 32 }} />
                <AllChats
                  setSelectedRoomId={setSelectedRoomId}
                  setSelectedUserId={setSelectedUserId}
                  chats={chats.filter((c) => c.chatType === 'p2p')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={2}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                className="hiddenScrollbar"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  direction: 'ltr',
                }}
              >
                <div style={{ width: '100%', height: isDesktop() ? 48 : 32 }} />
                <GroupChats
                  setSelectedRoomId={setSelectedRoomId}
                  chats={chats.filter((c) => c.chatType === 'group')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                className="hiddenScrollbar"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  direction: 'ltr',
                }}
              >
                <div style={{ width: '100%', height: isDesktop() ? 48 : 32 }} />
                <ChannelChats
                  setSelectedRoomId={setSelectedRoomId}
                  chats={chats.filter((c) => c.chatType === 'channel')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={0}
              style={{ width: '100%', height: '100%' }}
            >
              <div
                className="hiddenScrollbar"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  direction: 'ltr',
                }}
              >
                <div style={{ width: '100%', height: isDesktop() ? 48 : 32 }} />
                <BotChats
                  setSelectedRoomId={setSelectedRoomId}
                  chats={chats.filter((c) => c.chatType === 'bot')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
          </div>
          {isDesktop() && isInMessenger() ? (
            <ChatEmbeddedInMessenger key={'chat1'} roomId={selectedRoomId} userId={selectedUserId} />
          ) : isTablet() ? (
            <div
              style={{
                width: 'calc(100% - 450px)',
                height: '100%',
                position: 'fixed',
                left: 0,
                top: 0,
              }}
            >
              <ChatEmbedded key={'chat2'} roomId={selectedRoomId} userId={selectedUserId} />
            </div>
          ) : null}
          <Fab
            color="secondary"
            style={{
              position: 'fixed',
              bottom: isDesktop() ? 48 : isTablet() ? 104 : 88,
              left: isDesktop() || isTablet() ? undefined : 16,
              right: isDesktop()
                ? 568 + 64 + 256 + 32 + 32 - 16 - 180
                : isTablet()
                ? 450 - 56 - 16 - 16
                : undefined,
            }}
          >
            <EditIcon />
          </Fab>
        </div>
      ) : currNav === 1 ? (
        <SpacesGrid setDrawerOpen={setDrawerOpen} />
      ) : currNav === 2 ? (
        <HomeNotifs setDrawerOpen={setDrawerOpen} />
      ) : currNav === 3 ? (
        <HomeSettings setDrawerOpen={setDrawerOpen} />
      ) : null}
      <div
        style={{
          position: 'fixed',
          right: isDesktop() ? 48 : isMobile() ? 16 : 32,
          transform: isDesktop()
            ? 'translateY(-16px)'
            : isTablet()
            ? 'translateY(0px)'
            : 'translateY(16px)',
          bottom: 16,
          zIndex: 2500,
        }}
      >
        <Jumper open={jumperOpen} setOpen={setJumperOpen} />
      </div>
      <HomeBottombar />
      <HomeDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        roomId={selectedRoomId}
      />
    </div>
  )
}
