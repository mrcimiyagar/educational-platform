import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowForward, Search } from '@material-ui/icons';
import React from 'react';
import { isDesktop, isInRoom, isMobile, isTablet, popPage } from "../../App";
import { PollBox } from '../../modules/pollbox/pollbox';
import { setToken } from '../../util/settings';

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

export default function PollPage(props) {
      
    setToken(localStorage.getItem('token'));
    const [open, setOpen] = React.useState(true);
    const [createPollOpen, setCreatePollOpen] = React.useState(false)
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250);
    };
    let classes = useStyles();
    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}fullScreen={!isDesktop()} open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: (!(isDesktop() && isInRoom())) ? 'blur(10px)' : undefined}}>
            <div style={{...(!isDesktop() && {position: "absolute", top: 0, left: 0}), height: (isMobile() || isTablet()) ? "100%" : 650, width: (isMobile() || isTablet()) ? "100%" : 500}}>
                <AppBar position={'static'} style={{
                    width: '100%',
                    height: 64,
                    backgroundColor: 'rgba(21, 96, 233, 0.65)',
                    borderRadius: isDesktop() ? '24px 24px 0 0' : undefined
                }}>
                    <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', left: 16}}><Search style={{fill: '#fff'}}/></IconButton>
                        <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>رای گیزی</Typography>
                        <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
                    </Toolbar>
                </AppBar>
                <PollBox style={{display: 'block'}} roomId={props.room_id} setOpen={setCreatePollOpen} open={createPollOpen}/>
            </div>
        </Dialog>
    );
}
