import React, {useEffect} from 'react';
import Slide from "@material-ui/core/Slide";
import {gotoPage, popPage, registerDialogOpen} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { ArrowForward, Search } from '@material-ui/icons';
import { membership } from './room';
import { RoomTreeBox } from '../../components/RoomTreeBox';
import { serverRoot } from '../../util/Utils';
import { setToken, token } from '../../util/settings';

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

export default function RoomsTree(props) {
    setToken(localStorage.getItem('token'))
    const [open, setOpen] = React.useState(true);
    registerDialogOpen(setOpen)
    const [room, setRoom] = React.useState({});
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250)
    };
    let classes = useStyles();
    useEffect(() => {
        let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': token
            },
            body: JSON.stringify({
              roomId: props.room_id
            }),
            redirect: 'follow'
        };
        fetch(serverRoot + "/room/get_room", requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(JSON.stringify(result))
                setRoom(result.room)
              })
    }, [])
    document.documentElement.style.overflow = 'hidden'
    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}
        >
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0, backdropFilter: 'blur(10px)'}}>
                <AppBar style={{width: '100%', height: 64, backgroundColor: 'rgba(21, 96, 233, 0.65)'}}>
                    <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>نقشه</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{width: '100%', height: 'calc(100% - 64px)', display: 'flex', position: 'relative', marginTop: 64}}>
                    <div style={{width: 450, position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                        <RoomTreeBox membership={membership} room={room}/>
                    </div>
                    <div style={{width: 'calc(100% - 450px)', position: 'absolute', left: 450, top: 0, height: 'calc(100% - 48px)'}}>

                    </div>
                </div>
            </div>
        </Dialog>
    );
}
