import { AppBar, Fab, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { Add, ArrowForward, Done, Search } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { isDesktop, isMobile, isTablet, popPage } from "../../App";
import { colors, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import {updateMyBotsList} from './workshop';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateWidget(props) {

    const urlSearchParams = new URLSearchParams(window.location.search);
    props = Object.fromEntries(urlSearchParams.entries());
    
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250)
    };
    
    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    width: isDesktop() ? '85%' : "100%", height: isDesktop() ? '75%' : "100%",
                    overflow: 'hidden',
                },
            }}
            fullWidth
            maxWidth="md"
            fullScreen={!isDesktop()}
            open={open}
            onClose={handleClose} 
            TransitionComponent={Transition}
            style={{backdropFilter: (isMobile() || isTablet()) ? 'blur(10px)' : undefined}}>
            <div style={{width: "100%", height: '100%', ...((isMobile() || isTablet()) && {position: "absolute", top: 0, left: 0})}}>
                <Paper position={'fixed'} style={{
                    width: '100%',
                    height: 64, 
                    background: colors.primaryMedium,
                    backdropFilter: 'blur(10px)',
                    borderRadius: isDesktop() ? '24px 24px 0 0' : undefined}}>
                    <Toolbar style={{marginTop: (isDesktop() || isTablet()) ? 0 : 8, width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <Typography variant={'h6'} style={{color: '#fff'}}>ساخت ویجت</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </Paper>
                <div style={{borderRadius: isDesktop() ? '0 0 24px 24px' : undefined, backdropFilter: 'blur(15px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '100%', height: isDesktop() ? 'calc(100% - 72px)' : '100%'}}>
                    <TextField id={'widgetTitle'} variant={'outlined'} label={'عنوان ویجت'} style={{width: 'calc(100% - 48px)', marginTop: 24, marginLeft: 24, marginRight: 24}} />
                    <Fab
                        color={'secondary'}
                        style={{ position: 'fixed', bottom: 16, left: 16 }}
                        onClick={() => {
                            let requestOptions = {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  token: token,
                                },
                                body: JSON.stringify({
                                  title: document.getElementById('widgetTitle').value,
                                  botId: props.bot_id
                                }),
                                redirect: 'follow',
                            }
                            fetch(serverRoot + '/bot/create_widget', requestOptions)
                                .then((response) => response.json())
                                .then((result) => {
                                    if (result.status === 'success') {
                                        updateMyBotsList();
                                        handleClose();
                                    }
                                    else {
                                        alert(result.message);
                                    }
                                });
                        }}
                    >
                        <Done />
                    </Fab>
                </div>
            </div>
        </Dialog>
    );
}
