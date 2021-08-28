import { AppBar, Box, Card, Fab, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import ExtensionIcon from '@material-ui/icons/Extension';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { gotoPage } from '../../App';
import HomeToolbar from '../../components/HomeToolbar';
import Jumper from '../../components/SearchEngineFam';
import StoreBottombar from '../../components/StoreBottombar';
import StoreSearchbar from '../../components/StoreSearchbar';
import { token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
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

export let updateStore = undefined

export default function Store() {

  document.documentElement.style.overflow = 'auto';

  const classes = useStyles();
  let forceUpdate = useForceUpdate()
  updateStore = forceUpdate

  const [jumperOpen, setJumperOpen] = React.useState(true);
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
        if (result.categories !== undefined) {
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
              setCategories(categories)
              forceUpdate()
            })
            .catch(error => console.log('error', error));
          let requestOptions2 = {
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
          fetch(serverRoot + "/bot/get_packages", requestOptions2)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              cat.packages = result.packages
              setCategories(categories)
              forceUpdate()
            })
            .catch(error => console.log('error', error));
        });
        forceUpdate()
        }
      })
      .catch(error => console.log('error', error));
  }, [])

  return (
    <div className={classes.root}>
      
      <HomeToolbar>
        <AppBar style={{
          backgroundColor: 'rgba(21, 96, 233, 0.65)',
          backdropFilter: 'blur(10px)'}}>
          <Toolbar style={{marginTop: 16}}>
            <StoreSearchbar setDrawerOpen={(v) => {
              
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
            style={{width: '100%'}}
          >
            {
              categories.map(cat => (
                <Tab icon={<ExtensionIcon />} label={cat.title}/>
              ))
            }
          </Tabs>
        </AppBar>
      </HomeToolbar>
          {categories.map(cat => (
            <TabPanel value={value} index={cat}>
              <ImageList rowHeight={212} className={classes.imageList} cols={2}>
                {cat.packages.map((item) => (
                  <ImageListItem key={'store-package-'+ item.id} cols={2} style={{position: 'relative', marginTop: 8}}>
                    <div style={{width: '100%', height: '100%', backdropFilter: 'blur(10px)', position: 'absolute', left: 0, top: 0}}></div>
                    <img src={item.coverUrl} alt={item.title} style={{borderRadius: 16, opacity: '0.65', width: '100%', height: '100%'}} />
                  </ImageListItem>
                ))}
                {cat.bots.map((item) => (
                  <ImageListItem key={'store-bot-'+ item.id} cols={1} onClick={() => gotoPage('/app/storebot')}>
                    <div style={{margin: 4, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(10px)', position: 'relative'}}>
                      <img src={'https://icon-library.com/images/bot-icon/bot-icon-5.jpg'} alt={item.title} style={{opacity: 0.65, borderRadius: 16, marginRight: 16, marginLeft: 16, marginTop: 16, width: 'calc(100% - 32px)', height: 128}} />
                      <Card style={{background: 'transparent', backgroundColor: 'transparent', width: '95%', height: 56, marginRight: '2.5%' }}>
                        <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)', borderRadius: '0 0 16px 16px'}}>{'ربات'}</Typography>
                      </Card>
                    </div>
                  </ImageListItem>
                ))}
              </ImageList>
            </TabPanel>
          ))}
      <Fab color="secondary" style={{position: 'fixed', bottom: 16 + 72, left: 16}}>
        <ShoppingCartIcon />
      </Fab>
      <Fab size="medium" color="secondary" style={{position: 'fixed', bottom: 16 + 72 + 56 + 16, left: 20}} onClick={() => gotoPage('/app/storeads')}>
        <ViewCompactIcon />
      </Fab>
      <div style={{position: 'fixed', right: 16, bottom: 4}}>
        <Jumper open={jumperOpen} setOpen={setJumperOpen}/>
      </div>
      <StoreBottombar/>
    </div>
  );
}
