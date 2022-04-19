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
    return <Slide direction="right" ref={ref} {...props} />;
});

export default function NotePage(props) {
    
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(props.onClose, 250)
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
                    width: "100%",
                    height: '100%'
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
                    direction: 'rtl'
                }}>
                    <Toolbar style={{marginTop: (isDesktop() || isTablet()) ? 0 : 8, width: '100%', height: '100%'}}>
                    <IconButton onClick={() => handleClose()}><ArrowForward style={{fill: colors.icon}}/></IconButton>
                    <Typography variant={'h6'} style={{color: colors.text, flex: 1, textAlign: 'right'}}>یادداشت ها</Typography>
                    </Toolbar>
                </AppBar>
                <div style={{width: '100%', height: 'calc(100% - 64px)', marginTop: 64}}>
                    <iframe name="notes-frame" src={pathConfig.sharedNotes + '/p/' + rId}
                        style={{width: '100%', height: '100%'}} frameBorder="0"></iframe>
                </div>
            </div>
        </Dialog>
    );
}
