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
import { PollBox } from '../../modules/pollbox/pollbox';
import { setToken } from '../../util/settings';
import { setRoomId } from '../../util/Utils';

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

export default function PollPage(props) {
      
    setToken(localStorage.getItem('token'));
    setRoomId(1)
    const [open, setOpen] = React.useState(true);
    const [createPollOpen, setCreatePollOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false);
        popPage()
    };
    let classes = useStyles();
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
                <AppBar style={{width: '100%', height: 64, backgroundColor: '#2196f3'}}>
                    <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>رای گیزی</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => popPage()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <PollBox style={{display: 'block'}} setOpen={setCreatePollOpen} open={createPollOpen}/>
            </div>
        </Dialog>
    );
}
