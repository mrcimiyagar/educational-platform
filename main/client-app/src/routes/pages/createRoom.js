import React, {useEffect, useState} from 'react';
import ChatAppBar from "../../components/ChatAppBar";
import Slide from "@material-ui/core/Slide";
import {gotoPage, gotoPageWithDelay, isDesktop, popPage, registerDialogOpen, roomId} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles} from "@material-ui/core/styles";
import DescriptionIcon from '@material-ui/icons/Description';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendIcon from '@material-ui/icons/Send';
import { me, setToken, token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import {WaveSurferBox} from '../../components/WaveSurfer'
import Picker from 'emoji-picker-react';
import { useFilePicker } from 'use-file-picker';
import { PlayArrowTwoTone } from '@material-ui/icons';
import ArrowForwardTwoTone from '@material-ui/icons/ArrowForwardTwoTone';
import { AppBar, Fab, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import Add from '@material-ui/icons/Add';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1000,
        direction: 'rtl'
    },
    textField: {
        "& .MuiFilledInput-root": {
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: 16
        }
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

let uplaodedFileId = 0

export default function CreateRoom(props) {

    setToken(localStorage.getItem('token'))

    let forceUpdate = useForceUpdate()
    const [open, setOpen] = React.useState(true)
    registerDialogOpen(setOpen)
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250);
    };
    let classes = useStyles();

    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={isDesktop ? 
                {
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                        boxShadow: 'none',
                        borderRadius: 16
                    },
                } :
                {
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }
            }
            fullScreen={isDesktop !== 'desktop'} open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: isDesktop === 'desktop' ? undefined : 'blur(10px)'}}>
            <div style={{width: isDesktop === 'desktop' ? 450 : '100%', height: isDesktop === 'desktop' ? 300 : "100%", position: isDesktop === 'desktop' ? undefined : "fixed", top: isDesktop === 'desktop' ? undefined : 0, left:  isDesktop === 'desktop' ? undefined : 0, direction: 'rtl'}}>
                <Paper style={{width: isDesktop === 'desktop' ? 450 : undefined, paddingTop: 8, height: 64, backgroundColor: 'rgba(21, 96, 233, 0.85)', backdropFilter: 'blur(10px)'}}>
                    <Toolbar style={{marginTop: isDesktop === 'desktop' ? -8 : undefined}}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => handleClose()}

                        >
                            <ArrowForwardTwoTone />
                        </IconButton>
                        <Typography variant="h6" style={{fontFamily: 'mainFont', marginRight: 8}}>
                            ساخت روم
                        </Typography>
                    </Toolbar>
                </Paper>
                <TextField className={classes.textField} id="roomCreationTitle" label="عنوان روم" variant="filled" style={{marginTop: isDesktop === 'desktop' ? 32 : 96, marginLeft: 32, marginRight: 32, width: 'calc(100% - 64px)', color: '#fff'}} />
                <Fab style={{marginRight: 32, marginTop: 24}} variant="extended" onClick={() => {
                    let requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        },
                        body: JSON.stringify({
                            title: document.getElementById('roomCreationTitle').value,
                            chatType: 'group'
                        }),
                        redirect: 'follow'
                    };
                    fetch(serverRoot + "/room/create_room", requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(JSON.stringify(result));
                            if (result.room !== undefined) {
                                gotoPageWithDelay('/app/room', {room_id: result.room.id})
                            }
                        })
                        .catch(error => console.log('error', error));
                }}>
                  <Add />
                  ساخت روم
                </Fab>
            </div>
        </Dialog>
    );
}
