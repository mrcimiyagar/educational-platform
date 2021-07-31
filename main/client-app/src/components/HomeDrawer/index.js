import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MessageIcon from '@material-ui/icons/Message';
import DrawerImage from '../../images/drawer-image.png';
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {colors} from "../../util/settings";
import HomeIcon from '@material-ui/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import {drawerOpen, gotoPage, setDrawerOpen} from "../../App";
import Language from '@material-ui/icons/Language';

const useStyles = makeStyles({
    menuList: {
        width: 250
    },
    fullList: {
        width: 'auto',
    },
});

export default function HomeDrawer(props) {
    let classes = useStyles();
    const list = (anchor) => (
        <div
            className={clsx(classes.menuList, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
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
    return (
        <SwipeableDrawer
            style={{
                direction: 'rtl'}}
            anchor={'right'}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
        >
            <div onClick={() => {setDrawerOpen(false); gotoPage('/app/profile')}}>
                <img alt={'drawer-image'} src={DrawerImage} style={{width: 300, height: 200}}/>
                <Avatar style={{width: 56, height: 56, marginTop: -72, marginRight: 16}}/>
                <div style={{position: 'relative'}}>
                    <Typography style={{marginTop: -48, position: 'absolute', right: 84, bottom: 24, color: '#fff'}}>کیهان محمدی</Typography>
                    <Typography variant={'subtitle2'} style={{position: 'absolute', right: 84, bottom: 0, color: '#fff'}}>TheProgrammerMachine</Typography>
                </div>
            </div>
            <div style={{height: 24}}/>
            {list('right')}
        </SwipeableDrawer>
    );
}