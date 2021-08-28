import Avatar from "@material-ui/core/Avatar";
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import HomeIcon from '@material-ui/icons/Home';
import Language from '@material-ui/icons/Language';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import React from 'react';
import { gotoPage, isDesktop } from "../../App";
import { me, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';


const drawerWidth = 256 + 32 + 32 + 16;

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
    background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(179,0,255,1) 100%)',
    backdropFilter: 'blur(10px)',
    margin: isDesktop === 'desktop' ? 32 : 0,
    height: isDesktop === 'desktop' ? 'calc(100% - 64px)' : '100%',
    borderRadius: isDesktop === 'desktop' ? 24 : 0,
    direction: 'rtl'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function HomeDrawer(props) {
  const { window } = props;
  const classes = useStyles();

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
                        gotoPage('/app/messenger');
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
                        index === 0 ? <HomeIcon style={{fill: '#fff'}} /> : index === 1 ? <ContactPhoneIcon style={{fill: '#fff'}} /> :
                            index === 2 ? <AccessibilityIcon style={{fill: '#fff'}} /> : index === 3 ? <AttachMoneyIcon style={{fill: '#fff'}} /> : 
                                index === 4 ? <Language style={{fill: '#fff'}} /> : index === 5 ? <SettingsIcon style={{fill: '#fff'}} /> : 
                                    null}
                    </ListItemIcon>
                    <ListItemText style={{fontFamily: 'mainFont', color: '#fff', textAlign: 'right'}} primary={text} />
                </ListItem>
            ))}
        </List>
    </div>
);

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        {isDesktop !== 'desktop' ?
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
            style={{zIndex: 2501}}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
          <div onClick={() => {props.setOpen(false); gotoPage('/app/userprofile', {user_id: me.id});}}>
            <Avatar style={{width: 56, height: 56, marginTop: 64, marginRight: 16}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`}/>
            <div style={{position: 'relative'}}>
                <Typography style={{marginTop: -48, position: 'absolute', right: 84, bottom: 24, color: '#fff'}}>{me.firstName + ' ' + me.lastName}</Typography>
                <Typography variant={'subtitle2'} style={{position: 'absolute', right: 84, bottom: 0, color: '#fff'}}>{me.username}</Typography>
            </div>
        </div>
        <div style={{height: 24}}/>
        {list('right')}
          </SwipeableDrawer> :
          null
        }
        {isDesktop === 'desktop' ?
          <Drawer
            anchor={'right'}
            classes={{
              paper: classes.drawerPaper,
            }}
            style={{zIndex: 2499}}
            variant="permanent"
            open
          >
          <div onClick={() => {props.setOpen(false); gotoPage('/app/userprofile', {user_id: me.id});}}>
            <Avatar style={{width: 56, height: 56, marginTop: 64, marginRight: 16}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`}/>
            <div style={{position: 'relative'}}>
                <Typography style={{marginTop: -48, position: 'absolute', right: 84, bottom: 24, color: '#fff'}}>{me.firstName + ' ' + me.lastName}</Typography>
                <Typography variant={'subtitle2'} style={{position: 'absolute', right: 84, bottom: 0, color: '#fff'}}>{me.username}</Typography>
            </div>
        </div>
        <div style={{height: 24}}/>
          {list('right')}
          </Drawer> :
          null
        }
      </nav>
    </div>
  );
}

export default HomeDrawer;
