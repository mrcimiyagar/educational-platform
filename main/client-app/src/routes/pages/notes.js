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
import { NoteBox } from '../../modules/notebox/notebox';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
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

export default function NotePage(props) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250)
    };
    let classes = useStyles();
    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }} fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
                <AppBar style={{width: '100%', height: 56, 
                    backgroundColor: 'transparent'}}>
                    <Toolbar style={{marginTop: 8, width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'}>یادداشت ها</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{width: '100%', height: 'calc(100% - 56px)', position: 'absolute', top: 56}}>
                    <NoteBox/>
                </div>
            </div>
        </Dialog>
    );
}
