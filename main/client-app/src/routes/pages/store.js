import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { AppBar, Avatar, Box, Card, Fab, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import StoreSearchbar from '../../components/StoreSearchbar';
import HomeToolbar from '../../components/HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import AppsSharpIcon from '@material-ui/icons/AppsSharp';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import StoreHead from '../../components/StoreHead';
import StoreBottombar from '../../components/StoreBottombar';
import './store.css';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#eee',
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  imageList: {
    backgroundColor: '#eee',
    paddingTop: 96,
    height: 'auto',
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

const itemData = [
  {
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 2
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    cols: 1
},
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        cols: 1
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        cols: 2
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        cols: 2
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        cols: 1
    },
];

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

export default function Store() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  return (
    <div className={classes.root}>
      
      <HomeToolbar>
        <AppBar style={{backgroundColor: '#2196f3'}}>
          <Toolbar style={{marginTop: 16}}>
            <StoreSearchbar/>
          </Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            centered
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8}}
          >
            <Tab icon={<AppsSharpIcon />} label="دسته ی 1"/>
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۲" />
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۳" />
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۴" />
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۵" />
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۶" />
            <Tab icon={<SportsEsportsIcon />} label="دسته ی ۷" />
          </Tabs>
        </AppBar>
      </HomeToolbar>
      <SwipeableViews
          axis={'x-reverse'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {[0, 1, 2, 3, 4, 5, 6].map(cat => (
            <TabPanel value={value} index={cat}>
              <ImageList rowHeight={160} className={classes.imageList} cols={3}>
                {itemData.map((item) => (
                  <ImageListItem key={item.img} cols={item.cols || 1}>
                    <img src={item.img} alt={item.title} />
                  </ImageListItem>
                ))}
              </ImageList>
            </TabPanel>
          ))}
      </SwipeableViews>
      <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}>
        <HomeIcon />
      </Fab>
      <StoreBottombar/>
    </div>
  );
}
