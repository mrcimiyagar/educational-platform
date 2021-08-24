import { Dialog, IconButton, Slide } from '@material-ui/core'
import React, { useEffect } from 'react'
import { popPage, registerDialogOpen } from '../../App'
import {AudioBox} from '../../modules/audiobox'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AudioPlayer(props) {
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  return (
    <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
        <AudioBox roomId={props.room_id} src={props.src} handleClose={handleClose}/>
      </Dialog>
    )
}
