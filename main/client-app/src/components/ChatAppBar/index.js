import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from "@material-ui/icons/Search";
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from "@material-ui/core/Avatar";
import { gotoPage, isDesktop } from '../../App';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import { ArrowForward } from '@material-ui/icons';

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
            <AppBar position="fixed" style={{width: isDesktop ? 'calc(100% - 658px - 96px)' : '100%', borderRadius: isDesktop ? 32 : 0, position: isDesktop ? 'fixed' : undefined, top: isDesktop ? 48 : 0, left: isDesktop ? 96 : 0, paddingTop: 8, height: 64, backgroundColor: 'rgba(21, 96, 233, 0.75)', backdropFilter: 'blur(10px)'}}>
                <Toolbar style={{height: '100%', marginTop: isDesktop ? -8 : 0}}>
                    {!isDesktop ? 
                        <IconButton style={{marginRight: -16}} onClick={() => props.handleClose() }>
                            <ArrowForward style={{fill: '#fff'}}/>
                        </IconButton> :
                        null
                    }
                    <Avatar style={{width: 28, height: 28, marginRight: isDesktop ? 8 : -8}} alt="Profile Picture" src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${props.user.id}`}  onClick={() => {gotoPage('/app/userprofile', {user_id: props.user.id});}}/>
                    <Typography variant="h6" style={{fontFamily: 'mainFont', marginRight: 8}}>
                        {props.user.firstName + ' ' + props.user.lastName}
                    </Typography>
                    <div className={classes.search}>
                        <IconButton>
                            <VideocamIcon style={{fill: '#fff'}}/>
                        </IconButton>
                        <IconButton>
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
