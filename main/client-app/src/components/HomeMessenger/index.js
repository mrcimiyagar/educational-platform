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
  isMobile,
  isTablet,
  setInTheGame,
} from '../../App';
import { setColors, colors, token } from '../../util/settings';
import AllChats from '../AllChats';
import BotChats from '../BotChats';
import ChannelChats from '../ChannelChats';
import GroupChats from '../GroupChats';
import HomeSearchbar from '../HomeSearchbar';
import HomeToolbar from '../HomeToolbar';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { leaveRoom, serverRoot, useForceUpdate } from '../../util/Utils';
import MainWallpaper from '../../images/home-wallpaper2.jpg';

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

export default function HomeMessenger(props) {
    let forceUpdate = useForceUpdate();
    const useStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
        width: '100%',
        maxWidth: '100%',
        height: '100%',
      },
      indicator: {
        backgroundColor: colors.oposText,
      },
      tab: {
        minWidth: isDesktop() || isTablet() ? 100 : undefined,
        maxWidth: isDesktop() || isTablet() ? 100 : undefined,
        width: isDesktop() || isTablet() ? 100 : undefined,
        color: colors.oposText,
      },
  }));
    let classes = useStyles();
    return <div
          style={{
            background: 'transparent',
            marginRight: isMobile() || isTablet() ? 0 : 256 + 136,
          }}
        >
          <HomeToolbar inTheGame={inTheGame}>
            <AppBar
              style={{
                marginRight: isDesktop() ? 256 + 32 + 32 + 64 : undefined,
                marginTop: isDesktop() ? 32 : undefined,
                width: isDesktop() || isTablet() ? 450 : '100%',
                backgroundColor: colors.primaryMedium,
                backdropFilter: colors.blur
              }}
            >
              <Toolbar style={{ marginTop: 16, direction: 'rtl' }}>
                <HomeSearchbar setBackClicked={props.onClose} onSearch={props.onSearch} />
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
                  label="???????? ????"
                  style={{color: colors.oposText}}
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<RadioIcon />}
                  label="?????????? ????"
                  style={{color: colors.oposText}}
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<GroupIcon />}
                  label="???????? ????"
                  style={{color: colors.oposText}}
                />
                <Tab
                  classes={{ root: classes.tab }}
                  icon={<ChatIcon  />}
                  label="???? ????"
                  style={{color: colors.oposText}}
                />
              </Tabs>
            </AppBar>
          </HomeToolbar>
          <div
            style={{
              position: 'absolute',
              width: isDesktop() || isTablet() ? 450 : 'calc(100% + 16px)',
              height: isDesktop()
                ? 'calc(100% - 184px - 40px)'
                : isTablet()
                ? 'calc(100% - 168px - 40px)'
                : 'calc(100% - 128px - 28px)',
              backgroundColor: colors.backSide,
              backdropFilter: colors.blur,
              opacity: inTheGame ? 1 : 0,
              transition: 'opacity .5s',
              marginLeft: isMobile() ? -8 : undefined,
              marginRight: isMobile() || isDesktop() ? -8 : undefined,
              marginTop: isDesktop() ? 128 : 96
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
                  direction: 'ltr'
                }}
              >
                <AllChats
                  setSelectedChatId={props.setSelectedChatId}
                  setInTheGame={setInTheGame}
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
                <GroupChats
                  setSelectedChatId={props.setSelectedChatId}
                  setInTheGame={setInTheGame}
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
                <ChannelChats
                  setSelectedChatId={props.setSelectedChatId}
                  setInTheGame={setInTheGame}
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
                <BotChats
                  setSelectedChatId={props.setSelectedChatId}
                  setInTheGame={setInTheGame}
                  chats={props.chats.filter((c) => c.chatType === 'bot')}
                />
                <div style={{ width: '100%', height: 100 }} />
              </div>
            </TabPanel>
          </div>
          <Slide direction="right" in={inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
              <Fab
                style={{
                  position: 'fixed',
                  bottom: isDesktop() ? 48 : isTablet() ? 104 : 24,
                  left: isDesktop() || isTablet() ? undefined : 16,
                  right: isDesktop()
                    ? 568 + 64 + 256 + 32 + 32 - 16 - 180
                    : isTablet()
                    ? 450 - 56 - 16 - 16
                    : undefined,
                  backgroundColor: colors.accent
                }}
              >
                <EditIcon />
              </Fab>
          </Slide>
        </div>;
}
