import { Container, Tab, Tabs } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { setWallpaper } from '../..';
import { colors } from '../../util/settings';
import HomeToolbar from '../HomeToolbar';
import NotifsList from '../NotifsList';
import MainWallpaper from '../../images/home-wallpaper.jpg';
import { inTheGame, isDesktop, isMobile, isTablet } from '../../App';

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
    height: '100%',
    overflow: 'auto'
  },
  indicator: {
    backgroundColor: '#fff',
  },
}));

var lastScrollTop = 0

export default function HomeNotifs() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  useEffect(() => {
    setWallpaper({
      type: 'photo',
      photo: MainWallpaper
    });
  }, []);

  let [visibilityAllowed, setVisibilityAllowed] = React.useState(false);

  useEffect(() => {
    let notifsAppBarContainer = document.getElementById('notifsAppBarContainer');
    if (notifsAppBarContainer !== null) {
      notifsAppBarContainer.style.transform = (inTheGame && visibilityAllowed) ? 'translateY(0)' : 'translateY(-100px)';
    }
  }, [inTheGame, visibilityAllowed]);

  useEffect(() => {

    setTimeout(() => {
      setVisibilityAllowed(true);
    }, 250);

    let notifsAppBarContainer = document.getElementById('notifsAppBarContainer');
    let notifsAppBarScroller = document.getElementById('notifsAppBarScroller');
    notifsAppBarScroller.addEventListener(
      'scroll',
      function () {
        var st = notifsAppBarScroller.scrollTop
        if (st > lastScrollTop) {
          notifsAppBarContainer.style.transform = 'translateY(-100px)'
        } else {
          notifsAppBarContainer.style.transform = 'translateY(0)'
        }
        lastScrollTop = st <= 0 ? 0 : st
      },
      false
    );
  }, []);

  return (
    <div className={classes.root} id="notifsAppBarScroller">
        <AppBar id="notifsAppBarContainer" position={'fixed'} style={{borderRadius: (isMobile() || isTablet()) ? 0 : '0 0 24px 24px', paddingLeft: 24, paddingRight: 24, maxWidth: isDesktop() ? 600 : '100%', transform: isDesktop() ? 'transformX(-50%), translateY(-100px)' : 'translateY(-100px)', transition: 'transform .5s', left: isDesktop() ? 'calc(50% - 480px)' : 0, backgroundColor: colors.primaryMedium, backdropFilter: colors.blur}}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8, color: '#fff'}}
          >
            <Tab icon={<NotificationsIcon style={{fill: '#fff'}} />} label="??????????????" />
            <Tab icon={<AlternateEmailIcon style={{fill: '#fff'}} />} label="???????? ????" />
          </Tabs>
        </AppBar>
      <div style={{width: '100%', height: (isMobile() || isTablet()) ? 'calc(100% - 144px)' : '100%', marginTop: (isMobile() || isTablet()) ?  76 : 0,
                   background: colors.accentDark, backdropFilter: colors.blur,
                   backgroundColor: colors.accentDark, opacity: (inTheGame && visibilityAllowed) ? 1 : 0, transition: 'opacity 1s'}}>
        <TabPanel value={value} index={0}>
          <Container>
              <Box my={2} style={{minHeight: '100%', paddingTop: 48}}>
                <NotifsList/>
              </Box>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <Box my={2} style={{minHeight: '100%', paddingTop: 48}}>
              <NotifsList/>
            </Box>
          </Container>
        </TabPanel>
      </div>
    </div>
  )
}
