import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { ArrowForward, Search } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { isDesktop, isMobile, isTablet, popPage, setInTheGame } from "../../App";
import InvitesBox from '../../components/InvitesBox';
import { colors } from '../../util/settings';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export default function InvitationsList(props) {
    
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(props.onClose, 250);
    };

    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: isDesktop() ? '85%' : "100%", height: isDesktop() ? '75%' : "100%",
                    overflow: 'hidden'
                },
            }}
            fullScreen={!isDesktop()}
            open={open}
            onClose={handleClose} 
            TransitionComponent={Transition}
            style={{backdropFilter: (isMobile() || isTablet()) ? colors.blur : undefined}}>
            <div style={{backdropFilter: isDesktop() ? colors.blur : undefined, backdropFilter: isDesktop() ? colors.blur : undefined, width: "100%", height: '100%', ...((isMobile() || isTablet()) && {position: "absolute", top: 0, left: 0})}}>
                <AppBar position={'fixed'} style={{
                    width: '100%',
                    height: 64, 
                    backgroundColor: colors.primaryMedium,
                    backdropFilter: colors.blur
                }}>
                    <Toolbar style={{marginTop: (isDesktop() || isTablet()) ? 0 : 8, width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton><Search style={{fill: colors.oposText}}/></IconButton>
                        <Typography style={{flex: 1}}>دعوت نامه ها</Typography>
                        <IconButton onClick={() => handleClose()}><ArrowForward style={{fill: colors.oposText}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <div style={{backgroundColor: colors.backSide, width: '100%', height: 'calc(100% - 64px)', marginTop: 64}}>
                    <InvitesBox roomId={props.roomId} userId={props.userId}/>
                </div>
            </div>
        </Dialog>
    );
}
