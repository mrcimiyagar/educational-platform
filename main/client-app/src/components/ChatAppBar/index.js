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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
            <AppBar position="fixed" style={{backgroundColor: 'rgba(21, 96, 233, 0.5)', backdropFilter: 'blur(10px)'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        onClick={() => props.closeCallback()}
                    >
                        <ArrowBackIcon style={{transform: 'rotate(180deg)'}}/>
                    </IconButton>
                    <Avatar style={{width: 28, height: 28, marginRight: 8}} alt="Profile Picture" src={''}/>
                    <Typography variant="h6" style={{fontFamily: 'mainFont', marginRight: 8}}>
                        پویان
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
