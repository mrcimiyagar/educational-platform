import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HomeSearchbar from '../HomeSearchbar';
import HomeToolbar from '../HomeToolbar';
import { Container, Fab, Toolbar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EditIcon from '@material-ui/icons/Edit';
import ChatsList from '../ChatsList';
import HomeDrawer from '../HomeDrawer';
import HomeBottombar from '../HomeBottombar';

import ChatIcon from '@material-ui/icons/Chat';
import GroupIcon from '@material-ui/icons/Group';
import RadioIcon from '@material-ui/icons/Radio';
import RedditIcon from '@material-ui/icons/Reddit';
import { currentNav } from '../../App';
import SpacesGrid from '../SpacesGrid';

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
}));

export default function HomeNotifs() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  return (
    <div className={classes.root}>
      {currentNav === 0 ?
        (
          <div>
            <HomeToolbar>
        <AppBar style={{backgroundColor: '#2196f3'}}>
          <Toolbar style={{marginTop: 16}}>
            <HomeSearchbar/>
          </Toolbar>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            style={{marginTop: 8}}
          >
            <Tab icon={<ChatIcon />} label="چت ها" />
            <Tab icon={<GroupIcon />} label="گروه ها" />
            <Tab icon={<RadioIcon />} label="کانال ها" />
            <Tab icon={<RedditIcon />} label="ربات ها" />
          </Tabs>
        </AppBar>
      </HomeToolbar>
            <SwipeableViews
          axis={'x-reverse'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
        <TabPanel value={value} index={0}>
            <Container>
                <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                    <ChatsList/>
                </Box>
            </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <Container>
              <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                <ChatsList/>
              </Box>
            </Container>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <Container>
                <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                  <ChatsList/>
                </Box>
            </Container>
        </TabPanel>
        <TabPanel value={value} index={3}>
            <Container>
              <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                <ChatsList/>
              </Box>
            </Container>
        </TabPanel>
      </SwipeableViews>
            <Fab color="secondary" style={{position: 'fixed', bottom: 56 + 16, left: 16}}>
        <EditIcon />
      </Fab>
          </div>
        ) :
        currentNav === 1 ?
          (
            <SpacesGrid/>
          )
        :
        null
      }
      <HomeBottombar/>
      <HomeDrawer/>
    </div>
  )
}
