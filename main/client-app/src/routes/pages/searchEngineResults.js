import React, {Fragment, useEffect} from "react";
import SearchEngineResultsSearchbar from '../../components/SearchEngineResultsSearchbar'; 
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import HomeToolbar from '../../components/HomeToolbar';
import { Container, Fab, Toolbar, AppBar, Typography, Card, ImageListItem, ImageList } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EmailIcon from '@material-ui/icons/Email';
import PeopleIcon from '@material-ui/icons/People';
import RedditIcon from '@material-ui/icons/Reddit';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Audiotrack, Chat, Photo, Videocam } from "@material-ui/icons";
import Post from '../../components/Post'
import SearchResultsUsers from '../../components/SearchResultsUsers'
import { gotoPage } from "../../App";
import PhotoGrid from "../../components/PhotoGrid";
import AudioWallpaper from '../../images/audio-wallpaper.jpg'
import SearchResultsVideos from "../../components/SearchResultsVideos";
import SearchResultsMessages from "../../components/SearchResultsMessages";

const itemData = [
  {
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 2
},
{
    img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
    title: 'Bot A',
    author: 'author',
    cols: 1
},
    {
        img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
        title: 'Bot A',
        author: 'author',
        cols: 1
    },
    {
        img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
        title: 'Bot A',
        author: 'author',
        cols: 2
    },
    {
        img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
        title: 'Bot A',
        author: 'author',
        cols: 2
    },
    {
        img: 'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE',
        title: 'Bot A',
        author: 'author',
        cols: 1
    },
];

const itemData2 = [
  {
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
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
        <Box p={3} style={{padding: -16}}>
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
    flexGrow: 1
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
        style={{backgroundColor: '#eee'}}
      >
        <TabPanel value={value} index={0}>
          <div style={{height: 72}}/>
            <div style={{width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                <Post/>
              ))}
            </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{height: 88}}/>
          <SearchResultsUsers/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{height: 88}}/>
          <ImageList rowHeight={196} className={classes.imageList} cols={2}>
            {itemData.map((item) => (
              <ImageListItem key={item.img} cols={1} onClick={() => gotoPage('/app/storebot')}>
                <div style={{position: 'relative'}}>
                  <img src={item.img} alt={item.title} style={{borderRadius: 16, marginTop: 16, marginRight: '5%', width: '95%', height: 128}} />
                  <Card style={{borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                    <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{item.title}</Typography>
                  </Card>
                </div>
              </ImageListItem>
            ))}
          </ImageList>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div style={{height: 80}}/>
          <ImageList style={{zIndex: 2}} rowHeight={188} cols={3} gap={1} className={classes.imageList} style={{marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)'}}>
            {itemData2.map((item) => (
              <ImageListItem key={item.img} cols={1} rows={1} onClick={() => {gotoPage('/app/conf?room_id=1')}}>
                <div style={{position: 'relative'}}>
                  <img src={item.img} alt={item.title} style={{borderRadius: 16, marginTop: 16, marginRight: '2.5%', width: '95%', height: 128}} />
                  <Card style={{borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                    <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{item.title}</Typography>
                  </Card>
                </div>
              </ImageListItem>
            ))}
          </ImageList>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <div style={{height: 80}}/>
          <PhotoGrid/>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <div style={{height: 88}}/>
          <ImageList rowHeight={196} style={{width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}} cols={2}>
            {itemData.map((item) => (
              <ImageListItem key={item.img} cols={1}>
                <div style={{position: 'relative', display: 'flex', flexWrap: 'nowrap'}}>
                  <div style={{borderRadius: 176 / 2, backgroundColor: '#000', width: 176 - 32, height: 176 - 32, marginTop: 16 + 16, marginRight: -112}}/>
                  <img src={AudioWallpaper} alt={item.title} style={{borderRadius: 16, marginTop: 16, marginRight: -72, width: 'calc(95% - 32px)', height: 176}} />
                  <Typography style={{background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px 0px 0px 12px', marginLeft: -56, marginTop: 136, width: 144, height: 24, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>آواز های هایده</Typography>
                </div>
              </ImageListItem>
            ))}
          </ImageList>
        </TabPanel>
        <TabPanel value={value} index={6}>
          <div style={{height: 80}}/>
          <SearchResultsVideos/>
        </TabPanel>
        <TabPanel value={value} index={7}>
          <div style={{height: 88}}/>
          <SearchResultsMessages/>
        </TabPanel>
      </SwipeableViews>
    </div>
  </div>
  );
}
export default MessengerPage;
