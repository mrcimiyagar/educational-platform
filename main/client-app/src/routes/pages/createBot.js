import { AppBar, Fab, TextField, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { Add, ArrowForward, Done, Search } from '@material-ui/icons';
import React from 'react';
import { isDesktop, isMobile, isTablet, popPage } from "../../App";
import SpacesGridForInvitation from '../../components/SpacesGridForInvitation';
import { colors, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateBotPage(props) {

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
                    backgroundColor: 'transparent',
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
            style={{backdropFilter: (isMobile() || isTablet()) ? 'blur(10px)' : undefined, position: 'fixed', zIndex: 99999}}>
            <div style={{backdropFilter: isDesktop() ? 'blur(10px)' : undefined, backdropFilter: isDesktop() ? 'blur(10px)' : undefined, width: "100%", height: '100%', ...((isMobile() || isTablet()) && {position: "absolute", top: 0, left: 0})}}>
                <AppBar position={'fixed'} style={{
                    width: '100%',
                    height: 64, 
                    backgroundColor: colors.primaryMedium,
                    backdropFilter: isDesktop() ? 'blur(15px)' : undefined,
                    borderRadius: isDesktop() ? '24px 24px 0 0' : undefined}}>
                    <Toolbar style={{marginTop: (isDesktop() || isTablet()) ? 0 : 8, width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <Typography variant={'h6'} style={{color: '#fff'}}>ساخت بات</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '100%', height: isDesktop() ? 'calc(100% - 56px)' : '100%', position: 'absolute', top: 56}}>
                    <TextField variant={'outlined'} label={'نام بات'} style={{width: 'calc(100% - 48px)', margin: 24}} />
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
                      roomId: Number(props.roomId)
                    }),
                    redirect: 'follow',
                }
                fetch(serverRoot + '/bot/create_bot', requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        
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
