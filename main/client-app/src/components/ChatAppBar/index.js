import AppBar from '@material-ui/core/AppBar';
import Avatar from "@material-ui/core/Avatar";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ArrowForward } from '@material-ui/icons';
import CallIcon from '@material-ui/icons/Call';
import MoreIcon from '@material-ui/icons/MoreVert';
import VideocamIcon from '@material-ui/icons/Videocam';
import React from 'react';
import { gotoPage, isDesktop } from '../../App';
import { setCurrentRoomNavBackup } from '../../routes/pages/room';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        direction: 'rtl'
    },
    menuButton: {
        marginRight: -16,
    },
    search: {
        position: 'absolute',
        left: 0,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 'auto'
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function ChatAppBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="fixed" style={{width: isDesktop === 'desktop' ? (window.location.pathname === '/app/room' ? 450 : 'calc(100% - 658px - 96px - 208px - 96px - 48px + 180px - 4px)') : isDesktop === 'tablet' ? (window.location.pathname === '/room' ? '100%' : '100% - 450px)') : '100%', borderRadius: isDesktop === 'tablet' || isDesktop === 'mobile' ? 0 : (window.location.pathname === '/app/room' ? 0 : '24px 0 0 0'), position: isDesktop === 'desktop' || isDesktop === 'tablet' ? 'fixed' : undefined, top: isDesktop === 'desktop' ? (window.location.pathname === '/app/room' ? 0 : 32) : 0, left: window.location.pathname === '/app/room' ? (isDesktop === 'desktop' ? 'calc(100% - 450px)' : 96) : (isDesktop === 'desktop' ? 96 : 0), paddingTop: 8, height: 64, backgroundColor: 'rgba(21, 96, 233, 0.75)', backdropFilter: 'blur(10px)'}}>
                <Toolbar style={{height: '100%', marginTop: (isDesktop === 'desktop' || isDesktop === 'tablet') ? -8 : 0}}>
                    {isDesktop === 'mobile' || isDesktop === 'tablet' ? 
                        <IconButton style={{marginRight: -16}} onClick={() => props.handleClose() }>
                            <ArrowForward style={{fill: '#fff'}}/>
                        </IconButton> :
                        null
                    }
                    <Avatar style={{width: 28, height: 28, marginRight: isDesktop === 'desktop' || isDesktop === 'tablet' ? 8 : -8}}
                            alt={props.user !== undefined ? (props.user.firstName + ' ' + props.user.lastName) : props.room !== undefined ? props.room.title : ''} src={
                        props.room !== undefined ?
                            (serverRoot + `/file/download_room_avatar?token=${token}&roomId=${props.room.id}`) :
                            props.user !== undefined ?
                                (serverRoot + `/file/download_user_avatar?token=${token}&userId=${props.user.id}`) :
                                ''
                            }  onClick={() => {gotoPage('/app/userprofile', {user_id: props.user});}}/>
                    <Typography variant="h6" style={{fontFamily: 'mainFont', marginRight: 8}}>
                        {props.user !== undefined ? (props.user.firstName + ' ' + props.user.lastName) : props.room !== undefined ? props.room.title : ''}
                    </Typography>
                    <div className={classes.search}>
                        <IconButton onClick={() => {
                            setCurrentRoomNavBackup(2)
                            gotoPage('/app/p2pCall', {room_id: props.room.id});
                        }}>
                            <VideocamIcon style={{fill: '#fff'}}/>
                        </IconButton>
                        <IconButton onClick={() => {
                            setCurrentRoomNavBackup(2)
                            gotoPage('/app/p2pCall', {room_id: props.room.id});
                        }}>
                            <CallIcon style={{fill: '#fff'}}/>
                        </IconButton>
                        <IconButton>
                            <MoreIcon style={{fill: '#fff'}}/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
