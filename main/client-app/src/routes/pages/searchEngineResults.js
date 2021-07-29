import React, {Fragment, useEffect} from "react";
import SearchEngineResultsSearchbar from '../../components/SearchEngineResultsSearchbar'; 
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import HomeToolbar from '../../components/HomeToolbar';
import { Container, Fab, Toolbar, AppBar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EmailIcon from '@material-ui/icons/Email';
import PeopleIcon from '@material-ui/icons/People';
import RedditIcon from '@material-ui/icons/Reddit';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Audiotrack, Chat, Photo, Videocam } from "@material-ui/icons";
import Post from '../../components/Post'

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
    backgroundColor: '#fff'
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

function MessengerPage(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };
  
  return (
  <div className={classes.root} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#eee'}}>   
    <div>
      <HomeToolbar>
        <AppBar style={{backgroundColor: '#2196f3'}}>
          <Toolbar style={{marginTop: 16}}>
            <SearchEngineResultsSearchbar/>
          </Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8}}
          >
          <Tab icon={<EmailIcon />} label="پست ها" />
            <Tab icon={<PeopleIcon />} label="کاربران"/>
            <Tab icon={<RedditIcon />} label="بات ها" />
            <Tab icon={<AccountBalanceIcon />} label="فضا ها" />
            <Tab icon={<Photo />} label="عکس ها" />
            <Tab icon={<Audiotrack />} label="صدا ها" />
            <Tab icon={<Videocam />} label="ویدئو ها" />
            <Tab icon={<Chat />} label="پیام ها" />
          </Tabs>
        </AppBar>
      </HomeToolbar>
        <SwipeableViews
          axis={'x-reverse'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
        <TabPanel value={value} index={0}>
          <div style={{height: 80}}/>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
            <Post/>
          ))}
        </TabPanel>
      </SwipeableViews>
    </div>
  </div>
  );
}
export default MessengerPage;
