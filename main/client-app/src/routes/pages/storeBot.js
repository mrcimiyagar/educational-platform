import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { AppBar, Avatar, Box, Card, Fab, IconButton, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
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
import LocalMallIcon from '@material-ui/icons/LocalMall';
import StoreComments from '../../components/StoreComments';
import StoreSimiliar from '../../components/StoreSimiliar';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { gotoPage } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100vh',
    position: 'fixed',
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
    marginLeft: -16,
    marginRight: -16,
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

export default function StoreBot() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  const handleChangeIndex = (index) => {
    setValue(index)
  };

  document.body.style.backgroundColor = '#fff'

  return (
    <div className={classes.root}>
      <img style={{width: '100%'}} src={'https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=QC1VKCPE'}/>
      <div style={{width: '100%', position: 'absolute', top: 0}}>
        <IconButton style={{width: 32, height: 32, margin: 16}} onClick={() => gotoPage('/app/store')}>
          <ArrowForwardIcon style={{fill: '#fff'}}/>
        </IconButton>
      </div>
      <div style={{padding: 12, display: 'flex'}}>
        <Typography variant={'h6'}>بات ماشین حساب</Typography>
        <Rating name="read-only" value={2} readOnly style={{position: 'absolute', left: 16}}/>
      </div>

      <Typography style={{padding: 12}}>
      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده
      </Typography>

<div style={{marginTop: 16, height: 150, overflowX: 'auto', display: 'flex', flexWrap: 'nowrap'}}>
  <img style={{width: 240, height: 150}} src={'https://cdn.dribbble.com/users/1172860/screenshots/4853500/calculator-dribbble-tenigor.gif'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://www.igeeksblog.com/wp-content/uploads/2021/03/pcalc-lite-iphone-and-ipad-calculator-app-screenshot.jpg'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://cdn.dribbble.com/users/1172860/screenshots/4853500/calculator-dribbble-tenigor.gif'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://www.igeeksblog.com/wp-content/uploads/2021/03/pcalc-lite-iphone-and-ipad-calculator-app-screenshot.jpg'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://cdn.dribbble.com/users/1172860/screenshots/4853500/calculator-dribbble-tenigor.gif'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://www.igeeksblog.com/wp-content/uploads/2021/03/pcalc-lite-iphone-and-ipad-calculator-app-screenshot.jpg'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://cdn.dribbble.com/users/1172860/screenshots/4853500/calculator-dribbble-tenigor.gif'}/>
  <img style={{marginRight: 8, width: 240, height: 150}} src={'https://www.igeeksblog.com/wp-content/uploads/2021/03/pcalc-lite-iphone-and-ipad-calculator-app-screenshot.jpg'}/>
</div>

<StoreComments/>

<StoreSimiliar/>
      <div style={{height: 100, backgroundColor: '#ddd'}}/>

      <Fab color="secondary" style={{position: 'fixed', bottom: 16, left: 16}}>
        <LocalMallIcon />
      </Fab>
    </div>
  );
}
