import React, {useEffect} from 'react';
import ChatAppBar from "../../components/ChatAppBar";
import Slide from "@material-ui/core/Slide";
import {gotoPage, popPage, selectedIndex, token} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles} from "@material-ui/core/styles";
import ChatWallpaper from '../../images/chat-wallpaper.jpg';
import DescriptionIcon from '@material-ui/icons/Description';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendIcon from '@material-ui/icons/Send';
import { PresentBox } from '../../modules/presentbox/presentbox';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { ArrowForward, Search } from '@material-ui/icons';
import ViewListIcon from '@material-ui/icons/ViewList';
import { membership } from './room';
import { room, roomId } from '../../util/Utils';
import { RoomTreeBox } from '../../components/RoomTreeBox';
import HomeToolbar from '../../components/HomeToolbar';
import SpacesSearchbar from '../../components/SpacesSearchbar';
import HomeSpaceSearchbar from '../../components/HomeSpaceSearchbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#ddd'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontFamily: 'mainFont'
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function HomeSpace(props) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        popPage()
    };
    let classes = useStyles();
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
                <HomeToolbar>
                    <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
                        <HomeSpaceSearchbar/>
                    </div>
                </HomeToolbar>
                <div style={{width: '100%', height: 'calc(100% - 64px)', marginTop: 64, padding: 16}}>
                    
                </div>
            </div>
        </Dialog>
    );
}
