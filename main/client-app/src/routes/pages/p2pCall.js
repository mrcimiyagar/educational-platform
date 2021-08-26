import { Dialog, Slide } from '@material-ui/core'
import React from 'react'
import { gotoPage, popPage, registerDialogOpen } from '../../App'
import { ConfBox } from '../../modules/confbox'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function P2pCall(props) {

    const [open, setOpen] = React.useState(true)
    registerDialogOpen(setOpen)
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250);
    };
    
    let openDeck = () => {
        gotoPage('/app/deck', {room_id: props.room_id})
    }
    let openNotes = () => {
        gotoPage('/app/notes', {room_id: props.room_id})
    }
    let openPolls = () => {
        gotoPage('/app/poll', {room_id: props.room_id})
    }

    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)', zIndex: 2501}}
        >
           <ConfBox handleClose={handleClose} openDeck={openDeck} openNotes={openNotes} openPolls={openPolls} style={{display: 'block'}} roomId={props.room_id}/>
        </Dialog>
    )
}
