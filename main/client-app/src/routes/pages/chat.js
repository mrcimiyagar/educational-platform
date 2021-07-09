import React, {useEffect} from 'react';
import ChatAppBar from "../../components/ChatAppBar";
import Slide from "@material-ui/core/Slide";
import {gotoPage, selectedIndex, token} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles} from "@material-ui/core/styles";
import ChatWallpaper from '../../images/chat-wallpaper.jpg';
import DescriptionIcon from '@material-ui/icons/Description';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendIcon from '@material-ui/icons/Send';

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

export default function Chat(props) {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        gotoPage('/app/messenger')
    };
    let [tickets, setTickets] = React.useState([]);
    let classes = useStyles();
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
                <ChatAppBar closeCallback={handleClose}/>
                <img alt={'chat-wallpaper'} src={ChatWallpaper} style={{position: 'fixed', width: '100%', height: '100%'}}/>
                <div style={{height: 64}}/>
                <div className={classes.root}>
                    <IconButton className={classes.iconButton}>
                        <DescriptionIcon />
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <EmojiEmotionsIcon />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="پیام خود را بنویسید"
                    />
                    <IconButton color="primary" className={classes.iconButton} style={{transform: 'rotate(180deg)'}}>
                        <SendIcon />
                    </IconButton>
                </div>
                <div style={{width: "100%", height: "calc(100% - 72px)", paddingTop: 16}}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => {
                        return (
                            <div key={index}>
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#ddd',
                                        borderRadius: '16px 16px 16px 0px', position: 'absolute', left: 12, marginTop: 16}}>
                                        Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', left: 12, bottom: 8}}>12:35</div>
                                    </div>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#ddd', visibility: 'hidden', marginTop: 16,
                                        borderRadius: '16px 16px 16px 0px'}}>
                                        Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', left: 12, bottom: 8}}>12:35</div>
                                    </div>
                                </div>
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#2196f3', color: '#ddd',
                                        borderRadius: '16px 16px 0px 16px', marginLeft: 16, marginTop: 16,
                                        position: 'absolute', right: 16}}>
                                        Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        color: 'transparent', marginLeft: 16, marginTop: 16}}>
                                        Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                </div>
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#ddd',
                                        borderRadius: '16px 16px 16px 0px', position: 'absolute', left: 12, marginTop: 16}}>
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                    <div style={{visibility: 'hidden', fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#ddd',
                                        borderRadius: '16px 16px 16px 0px', marginTop: 16}}>
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                </div>
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        backgroundColor: '#4dabf5', color: '#ddd',
                                        borderRadius: '16px 16px 0px 16px', marginLeft: 16, marginTop: 16,
                                        position: 'absolute', right: 16}}>
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                    <div style={{fontFamily: 'mainFont', display: 'inline-block', width: 'auto', maxWidth: 300, padding: 16,
                                        color: 'transparent', marginLeft: 16, marginTop: 16}}>
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        Hello World Hello World Hello World Hello World Hello World Hello World Hello World
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8}}>12:35</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Dialog>
    );
}
