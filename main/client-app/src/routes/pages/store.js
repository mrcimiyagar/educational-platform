import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { AppBar, Avatar, Box, Card, Fab, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import StoreSearchbar from '../../components/StoreSearchbar';
import HomeToolbar from '../../components/HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import ExtensionIcon from '@material-ui/icons/Extension';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import StoreHead from '../../components/StoreHead';
import StoreBottombar from '../../components/StoreBottombar';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import { gotoPage } from '../../App';
import { serverRoot, useForceUpdate } from '../../util/Utils';
import { token } from '../../util/settings';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ddd',
    width: '100%',
    height: 'auto',
    position: 'absolute',
    overflow: 'auto',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  imageList: {
    backgroundColor: '#ddd',
    paddingTop: 96,
    width: '100%',
    height: 'auto',
    paddingRight: -8,
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
  let forceUpdate = useForceUpdate()
  const [value, setValue] = React.useState(0)
  const [categories, setCategories] = React.useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    }

    fetch(serverRoot + "/bot/get_categories", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        setCategories(result.categories)
        result.categories.forEach(cat => {
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              categoryId: cat.id
            }),
            redirect: 'follow'
          }
          fetch(serverRoot + "/bot/get_bots", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              cat.bots = result.bots
              setCategories(result.categories)
              forceUpdate()
            })
            .catch(error => console.log('error', error));
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              categoryId: cat.id
            }),
            redirect: 'follow'
          }
          fetch(serverRoot + "/bot/get_packages", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              cat.packages = result.packages
              setCategories(result.categories)
              forceUpdate()
            })
            .catch(error => console.log('error', error));
        });
        forceUpdate()
      })
      .catch(error => console.log('error', error));
  }, [])

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
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8}}
          >
            {
              categories.map(cat => (
                <Tab icon={<ExtensionIcon />} label={cat.title}/>
              ))
            }
          </Tabs>
        </AppBar>
      </HomeToolbar>
      <SwipeableViews
          axis={'x-reverse'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {categories.map(cat => (
            <TabPanel value={value} index={cat}>
              <ImageList rowHeight={196} className={classes.imageList} cols={2}>
                {cat.packages.map((item) => (
                  <ImageListItem key={item.coverUrl} cols={2}>
                    <img src={item.coverUrl} alt={item.title} style={{borderRadius: 16, width: '100%', height: '100%'}} />
                  </ImageListItem>
                ))}
                {cat.bots.map((item) => (
                  <ImageListItem key={item.avatarId} cols={1} onClick={() => gotoPage('/app/storebot')}>
                    <div style={{position: 'relative'}}>
                      <img src={item.avatarId} alt={item.title} style={{borderRadius: 16, marginTop: 16, marginRight: '5%', width: '95%', height: 128}} />
                      <Card style={{borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                        <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{item.title}</Typography>
                      </Card>
                    </div>
                  </ImageListItem>
                ))}
              </ImageList>
            </TabPanel>
          ))}
      </SwipeableViews>
      <Fab color="secondary" style={{position: 'fixed', bottom: 16 + 56, left: 16}}>
        <ShoppingCartIcon />
      </Fab>
      <Fab size="small" color="secondary" style={{position: 'fixed', bottom: 16 + 56 + 56 + 16, left: 24}} onClick={() => gotoPage('/app/storeads')}>
        <ViewCompactIcon />
      </Fab>
      <StoreBottombar/>
    </div>
  );
}
