import React, {Fragment, useEffect} from "react";
import SearchEngineResultsSearchbar from '../../components/SearchEngineResultsSearchbar'; 
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import HomeToolbar from '../../components/HomeToolbar';
import { Container, Fab, Toolbar, AppBar, Typography, Card, ImageListItem, ImageList, Dialog, Slide } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EmailIcon from '@material-ui/icons/Email';
import PeopleIcon from '@material-ui/icons/People';
import RedditIcon from '@material-ui/icons/Reddit';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Audiotrack, Chat, Photo, Videocam } from "@material-ui/icons";
import Post from '../../components/Post'
import SearchResultsUsers from '../../components/SearchResultsUsers'
import { gotoPage, popPage, query, registerDialogOpen, setQuery } from "../../App";
import PhotoGrid from "../../components/PhotoGrid";
import AudioWallpaper from '../../images/audio-wallpaper.jpg'
import SearchResultsVideos from "../../components/SearchResultsVideos";
import SearchResultsMessages from "../../components/SearchResultsMessages";
import BotIcon from '../../images/robot.png'
import { serverRoot } from "../../util/Utils";
import { setToken, token } from "../../util/settings";
import EmptyIcon from '../../images/empty.png'

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
    flexGrow: 1,
    direction: 'rtl'
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SearchEngineResults(props) {

  setToken(localStorage.getItem('token'))

  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const [open, setOpen] = React.useState(true)
  registerDialogOpen(setOpen)

  let [users, setUsers] = React.useState([])
  let [bots, setBots] = React.useState([])
  let [rooms, setRooms] = React.useState([])
  let [photos, setPhotos] = React.useState([])
  let [audios, setAudios] = React.useState([])
  let [videos, setVideos] = React.useState([])
  let [messages, setMessages] = React.useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }

  let fetchUsers = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
        query: query
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/search/search_users", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.users !== undefined) {
          setUsers(result.users)
        }
      })
      .catch(error => console.log('error', error));
  }

  let fetchBots = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
        query: query
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/search/search_bots", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.bots !== undefined) {
          setBots(result.bots)
        }
      })
      .catch(error => console.log('error', error));
  }

  let fetchRooms = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
        query: query
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/search/search_rooms", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.rooms !== undefined) {
          setRooms(result.rooms)
        }
      })
      .catch(error => console.log('error', error));
  }

  let fetchFiles = (fileType) => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
        query: query,
        fileType: fileType
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/search/search_files", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.files !== undefined) {
          if (fileType === 'photo') {
            setPhotos(result.files)
          }
          else if (fileType === 'audio') {
            setAudios(result.files)
          }
          else if (fileType === 'video') {
            setVideos(result.files)
          }
        }
      })
      .catch(error => console.log('error', error));
  }

  let fetchMessages = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
        query: query
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/search/search_messages", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.messages !== undefined) {
          setMessages(result.messages)
        }
      })
      .catch(error => console.log('error', error));
  }

  let fetchTotal = () => {
    fetchUsers()
    fetchBots()
    fetchRooms()
    fetchFiles('photo')
    fetchFiles('audio')
    fetchFiles('video')
    fetchMessages()
  }

  useEffect(() => {
    fetchTotal()
  }, [])

  return (
    <Dialog
        onTouchStart={(e) => {e.stopPropagation();}}
        PaperProps={{
            style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        }}
        fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
  <div className={classes.root} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>   
    <div>
      <HomeToolbar>
        <AppBar style={{backgroundColor: 'rgba(21, 96, 233, 0.65)', backdropFilter: 'blur(10px)'}}>
          <Toolbar style={{marginTop: 16}}>
            <SearchEngineResultsSearchbar handleClose={handleClose} onQueryChange={(q) => {
              setQuery(q)
              fetchTotal()
            }}/>
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
          <div style={{height: 72}}/>
            <div style={{width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                <Post/>
              ))}
            </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{height: 88}}/>
          <SearchResultsUsers data={users}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{height: 88}}/>
          <ImageList rowHeight={196} className={classes.imageList} cols={2}>
            {bots.length > 0 ?
              bots.map((bot) => (
                <ImageListItem key={'search-bot-' + bot.id} cols={1} onClick={() => gotoPage('/app/storebot')}>
                  <div style={{position: 'relative'}}>
                    <img src={serverRoot + `/file/download_bot_avatar?token=${token}&botId=${bot.id}`} alt={bot.title} style={{paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff', borderRadius: 16, marginTop: 16, marginRight: '5%', width: '95%', height: 128}} />
                    <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                      <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{bot.title}</Typography>
                    </Card>
                  </div>
                </ImageListItem>
              ))  :
              <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
                <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
              </div>
            }
          </ImageList>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div style={{height: 80}}/>
          <ImageList style={{zIndex: 2}} rowHeight={188} cols={3} gap={1} className={classes.imageList} style={{marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)'}}>
            {rooms.length > 0 ?
              rooms.map((room) => (
                <ImageListItem key={'search-room-' + room.id} cols={1} rows={1} onClick={() => {gotoPage('/app/conf?room_id=1')}}>
                  <div style={{position: 'relative'}}>
                    <img src={serverRoot + `/file/download_room_avatar?token=${token}&roomId=${room.id}`} alt={room.title} style={{borderRadius: 16, marginTop: 16, marginRight: '2.5%', width: '95%', height: 128}} />
                    <Card style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                      <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{room.title}</Typography>
                    </Card>
                  </div>
                </ImageListItem>
              ))  :
              <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
                <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
              </div>
            }
          </ImageList>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <div style={{height: 80}}/>
          <PhotoGrid data={photos}/>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <div style={{height: 88}}/>
          {audios.length > 0 ?
            <ImageList rowHeight={196} style={{width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}} cols={2}>
              {audios.map((audio) => (
                <ImageListItem key={'search-audio-' + audio.id} cols={1}>
                  <div style={{position: 'relative', display: 'flex', flexWrap: 'nowrap'}}>
                    <div style={{borderRadius: 176 / 2, backgroundColor: '#000', width: 176 - 32, height: 176 - 32, marginTop: 16 + 16, marginRight: -112}}/>
                    <img src={AudioWallpaper} alt={audio.title} style={{borderRadius: 16, marginTop: 16, marginRight: -72, width: 'calc(95% - 32px)', height: 176}} />
                    <Typography style={{background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px 0px 0px 12px', marginLeft: -72, marginTop: 136, width: 144, height: 24, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>{audio.title}</Typography>
                  </div>
                </ImageListItem>
              ))}
            </ImageList>  :
            <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
              <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
            </div>
          }
        </TabPanel>
        <TabPanel value={value} index={6}>
          <div style={{height: 80}}/>
          <SearchResultsVideos data={videos}/>
        </TabPanel>
        <TabPanel value={value} index={7}>
          <div style={{height: 88}}/>
          <SearchResultsMessages data={messages}/>
        </TabPanel>
      </SwipeableViews>
    </div>
  </div>
  </Dialog>
  );
}
export default SearchEngineResults;
