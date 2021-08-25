import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import MessageIcon from '@material-ui/icons/Message';
import DrawerImage from '../../images/drawer-image.png';
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from '@material-ui/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import {gotoPage} from "../../App";
import Language from '@material-ui/icons/Language';
import { me, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';


const drawerWidth = 256 + 32 + 32;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function HomeDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const list = (anchor) => (
    <div
        className={clsx(classes.menuList, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
        })}
        role="presentation"
        onClick={() => props.setOpen(false)}
        onKeyDown={() => props.setOpen(false)}
    >
        <List>
            {['خانه', 'مخاطبان', 'دوستان', 'فروشگاه', 'گشت و گذار'].map((text, index) => (
                <ListItem button key={text} onClick={() => {
                    if (index === 0) {
                        gotoPage('/app/home');
                    }
                    else if (index === 1) {
                    }
                    else if (index === 2) {

                    }
                    else if (index === 3) {
                        gotoPage('/app/store');
                    }
                    else if (index === 4) {
                        gotoPage('/app/searchengine');
                    }
                    else if (index === 5) {

                    }
                }}>
                    <ListItemIcon style={{marginRight: 16}}>{
                        index === 0 ? <HomeIcon /> : index === 1 ? <ContactPhoneIcon/> :
                            index === 2 ? <AccessibilityIcon/> : index === 3 ? <AttachMoneyIcon /> : 
                                index === 4 ? <Language/> : index === 5 ? <SettingsIcon/> : 
                                    null}
                    </ListItemIcon>
                    <ListItemText style={{fontFamily: 'mainFont', textAlign: 'right'}} primary={text} />
                </ListItem>
            ))}
        </List>
    </div>
);

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={'right'}
            open={props.open}
            onClose={() => props.setOpen(false)}
            onOpen={() => props.setOpen(true)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
          <div onClick={() => {props.setOpen(false); gotoPage('/app/userprofile', {user_id: me.id});}}>
            <img alt={'drawer-image'} src={DrawerImage} style={{width: 316, height: 216}}/>
            <Avatar style={{width: 56, height: 56, marginTop: -72, marginRight: 16}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`}/>
            <div style={{position: 'relative'}}>
                <Typography style={{marginTop: -48, position: 'absolute', right: 84, bottom: 24, color: '#fff'}}>{me.firstName + ' ' + me.lastName}</Typography>
                <Typography variant={'subtitle2'} style={{position: 'absolute', right: 84, bottom: 0, color: '#fff'}}>{me.username}</Typography>
            </div>
        </div>
        <div style={{height: 24}}/>
        {list('right')}
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            anchor={'right'}
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
          <div onClick={() => {props.setOpen(false); gotoPage('/app/userprofile', {user_id: me.id});}}>
            <img alt={'drawer-image'} src={DrawerImage} style={{width: 316, height: 216}}/>
            <Avatar style={{width: 56, height: 56, marginTop: -72, marginRight: 16}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`}/>
            <div style={{position: 'relative'}}>
                <Typography style={{marginTop: -48, position: 'absolute', right: 84, bottom: 24, color: '#fff'}}>{me.firstName + ' ' + me.lastName}</Typography>
                <Typography variant={'subtitle2'} style={{position: 'absolute', right: 84, bottom: 0, color: '#fff'}}>{me.username}</Typography>
            </div>
        </div>
        <div style={{height: 24}}/>
          {list('right')}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default HomeDrawer;
