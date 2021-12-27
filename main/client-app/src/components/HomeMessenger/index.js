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
import { setWallpaper } from '../..';
import DesktopWallpaper from '../../images/desktop-wallpaper.jpg';
import {
  inTheGame,
  isDesktop,
  isInMessenger,
  isInRoom,
  isMobile,
  isTablet,
  setInTheGame,
} from '../../App';
import ChatEmbedded from '../../components/ChatEmbedded';
import { setColors, colors, token } from '../../util/settings';
import AllChats from '../AllChats';
import BotChats from '../BotChats';
import ChannelChats from '../ChannelChats';
import ChatEmbeddedInMessenger from '../ChatEmbeddedInMessenger';
import GroupChats from '../GroupChats';
import HomeSearchbar from '../HomeSearchbar';
import HomeToolbar from '../HomeToolbar';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { leaveRoom, serverRoot, useForceUpdate } from '../../util/Utils';
import {setMembership as setMCE} from '../ChatEmbedded';
import {setMembership as setMCEIM} from '../ChatEmbeddedInMessenger';

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
}));

export default function HomeMessenger(props) {
    let forceUpdate = useForceUpdate();
    let classes = useStyles();
    useEffect(() => {
        setWallpaper({
          type: 'color',
          color: colors.accentDark
        });
        let doRoomDoctor = () => {
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              roomId: props.selectedRoomId,
            }),
            redirect: 'follow',
          };
          fetch(
            serverRoot + '/room/am_i_in_room',
            requestOptions,
          )
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (result.result === false) {
              let requestOptions2 = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.selectedRoomId,
                }),
                redirect: 'follow',
              };
              fetch(
                serverRoot + '/room/enter_room',
                requestOptions2,
              )
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.membership !== undefined) {
                  if (setMCEIM !== undefined) setMCEIM(result.membership);
                  if (setMCE !== undefined) setMCE(result.membership);
                  forceUpdate();
                }
              })
              .catch((error) => console.log('error', error));
            }
          })
          .catch((error) => console.log('error', error));
        };
    
        let roomPersistanceDoctor = setInterval(() => {
          doRoomDoctor();
        }, 3500);
        
        console.log('planting destructor...');
        return () => {
          clearInterval(roomPersistanceDoctor);
          leaveRoom(() => {});
        }
    }, []);
    return <div
          style={{
            background: 'transparent',
            marginRight: isMobile() || isTablet() ? 0 : 256 + 136,
          }}
        >
          <HomeToolbar inTheGame={inTheGame}>
            <AppBar
              style={{
                borderRadius: !isDesktop()
                  ? undefined
                  : props.selectedRoomId === undefined
                  ? '24px 24px 0 0'
                  : '0 24px 0 0',
                marginRight: isDesktop() ? 256 + 32 + 32 + 64 : undefined,
                marginTop: isDesktop() ? 32 : undefined,
                width: isDesktop() || isTablet() ? 450 : '100%',
                backgroundColor: colors.primaryMedium,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Toolbar style={{ marginTop: 16 }}>
                <HomeSearchbar setDrawerOpen={props.setDrawerOpen} onSearch={props.onSearch} />
              </Toolbar>
              <Tabs
                variant="fullWidth"
                value={props.value}
                onChange={props.handleChange}
                classes={{
                  indicator: classes.indicator,
                }}
                style={{ marginTop: 8, direction: 'ltr' }}
                centered
              >
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<SmartToyOutlinedIcon />}
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
              backgroundColor: (isDesktop() || isTablet()) ? 'rgba(255, 255, 255, 0.445)' : undefined,
              backdropFilter: (isDesktop() || isTablet()) ? 'blur(10px)' : undefined,
              marginLeft: isMobile() ? -8 : undefined,
              marginRight: isMobile() || isDesktop() ? -8 : undefined,
              marginTop: isDesktop() ? 88 : 56,
              borderRadius:
                isTablet() || isMobile()
                  ? 0
                  : props.selectedRoomId === undefined
                  ? '0 0 24px 24px'
                  : '0 0 24px 0',
            }}
          >
            <TabPanel
              value={props.value}
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
                  setInTheGame={setInTheGame}
                  setSelectedRoomId={props.setSelectedRoomId}
                  setSelectedUserId={props.setSelectedUserId}
                  chats={props.chats.filter((c) => c.chatType === 'p2p')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={props.value}
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
                  setInTheGame={setInTheGame}
                  setSelectedRoomId={props.setSelectedRoomId}
                  setSelectedUserId={props.setSelectedUserId}
                  chats={props.chats.filter((c) => c.chatType === 'group')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={props.value}
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
                  setInTheGame={setInTheGame}
                  setSelectedRoomId={props.setSelectedRoomId}
                  setSelectedUserId={props.setSelectedUserId}
                  chats={props.chats.filter((c) => c.chatType === 'channel')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
            <TabPanel
              value={props.value}
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
                  setInTheGame={setInTheGame}
                  setSelectedRoomId={props.setSelectedRoomId}
                  setSelectedUserId={props.setSelectedUserId}
                  chats={props.chats.filter((c) => c.chatType === 'bot')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
          </div>
          {isDesktop() && isInMessenger() ? (
            <ChatEmbeddedInMessenger
              key={'chat1'}
              roomId={props.selectedRoomId}
              userId={props.selectedUserId}
            />
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
              <ChatEmbedded
                key={'chat2'}
                roomId={props.selectedRoomId}
                userId={props.selectedUserId}
              />
            </div>
          ) : null}
          <Slide direction="right" in={inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
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
          </Slide>
        </div>;
}
