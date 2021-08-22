import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from '@material-ui/icons/Home';
import {gotoPage} from "../../App";
import SearchEngineIcon from '../../images/world.png'
import { Audiotrack, Photo, Settings } from '@material-ui/icons';

const useStyles = makeStyles({
    menuList: {
        width: 250
    },
    fullList: {
        width: 'auto',
    },
});

export default function SearchEngineDrawer(props) {
    let classes = useStyles();
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
                {['جستجو با متن', 'جستجو با عکس', 'تنظیمات جستجو'].map((text, index) => (
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

                        }
                        else if (index === 5) {

                        }
                    }}>
                        <ListItemIcon style={{marginRight: 16}}>{
                            index === 0 ? <HomeIcon /> : index === 1 ? <Photo/> :
                                index === 2 ? <Settings/> :
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
            open={props.open}
            onClose={() => props.setOpen(false)}
            onOpen={() => props.setOpen(true)}
        >
            <div style={{width: '100%', height: 176, backgroundColor: '#eee'}}>
                <Avatar style={{width: 112, height: 112, marginRight: 64, marginTop: 32}} src={SearchEngineIcon}/>
            </div>
            <div style={{height: 24}}/>
            {list('right')}
        </SwipeableDrawer>
    );
}