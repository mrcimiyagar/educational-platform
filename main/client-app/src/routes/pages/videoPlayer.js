import { Dialog, IconButton, Slide } from '@material-ui/core';
import { ArrowForwardTwoTone, Close } from '@material-ui/icons';
import React from 'react';
import { popPage, registerDialogOpen } from '../../App';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoPlayer(props) {

  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  return (
    <Dialog
      onTouchStart={(e) => {e.stopPropagation();}}
      fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <div style={{width: '100%', height: '100%'}}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
          <IconButton style={{position: 'fixed', right: 12, top: 24}} onClick={() => {setOpen(false); setTimeout(popPage, 250)}}>
            <ArrowForwardTwoTone style={{fill: '#fff'}}/>
          </IconButton>
          <video autoPlay id={'video-player'} controls={true} style={{width: '100%', maxWidth: 900, height: 'auto', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} 
            src={props.src !== undefined ? props.src : 
              serverRoot +
              `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${props.fileId}`}/>
        </div>
    </Dialog>
  )
}
