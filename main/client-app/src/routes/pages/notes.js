import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { colors } from '../../util/settings';
import { ArrowForward, Search } from '@material-ui/icons';
import React from 'react';
import { pathConfig } from '../..';
import { isDesktop, isMobile, isTablet, popPage } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotePage(props) {

    const urlSearchParams = new URLSearchParams(window.location.search);
    props = Object.fromEntries(urlSearchParams.entries());
    
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250)
    };
    let rId = props.room_id
    while (rId.length < 22) {
      rId = '0' + rId;
    }
    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: isDesktop() ? '85%' : "100%", height: '100%'
                },
            }}
            style={{height: '100%', width: '100%'}}
            fullWidth
            maxWidth="md"
            fullScreen={!isDesktop()}
            open={open}
            onClose={handleClose} 
            TransitionComponent={Transition}>
            <div style={{overflow: 'hidden', width: '100%', height: '100%', ...(isMobile() && {position: "absolute", top: 0, left: 0})}}>
                <AppBar position={'fixed'} style={{
                    width: isDesktop() ? '50%' : '100%',
                    marginLeft: isDesktop() ? '25%' : undefined,
                    marginRight: isDesktop() ? '25%' : undefined,
                    marginTop: isDesktop() ? '3%' : undefined,
                    height: 64, 
                    backgroundColor: colors.primaryMedium,
                    backdropFilter: 'blur(10px)',
                    borderRadius: isDesktop() ? '24px 24px 0 0' : undefined}}>
                    <Toolbar style={{marginTop: (isDesktop() || isTablet()) ? 0 : 8, width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{color: '#fff'}}>یادداشت ها</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <iframe name="notes-frame" src={pathConfig.sharedNotes + '/p/' + rId}
                    style={{width: '100%', height: isMobile() ? '100%' : 'calc(100% - 112px)', marginTop: isMobile() ? 56 : 88}} frameBorder="0"></iframe>
            </div>
        </Dialog>
    );
}
