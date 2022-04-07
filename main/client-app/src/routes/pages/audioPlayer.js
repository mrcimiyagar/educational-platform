import { Dialog, Slide } from '@material-ui/core';
import React from 'react';
import { isDesktop, popPage, registerDialogOpen } from '../../App';
import { AudioBox } from '../../modules/audiobox';
import { useForceUpdate } from '../../util/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AudioPlayer(props) {
  let forceUpdate = useForceUpdate()
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
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
                },
            }}
            fullScreen={!isDesktop()} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AudioBox roomId={props.room_id} src={props.src} fileId={props.file_id} roomId={props.room_id} handleClose={handleClose}/>
      </Dialog>
    )
}
