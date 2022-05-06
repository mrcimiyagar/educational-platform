import { Dialog, IconButton, Slide } from '@material-ui/core';
import { ArrowForwardTwoTone, Close } from '@material-ui/icons';
import { colors } from '../../util/settings';
import React from 'react';
import { popPage, registerDialogOpen } from '../../App';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoPlayer(props) {

  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(props.onClose, 250);
  };

  return (
    <Dialog
      style={{background: 'transparent', boxShadow: 'none'}}
      PaperProps={{style: {background: colors.backSide}}}
      onTouchStart={(e) => {e.stopPropagation();}}
      fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <div style={{width: '100%', height: '100%'}}>
          <IconButton onClick={handleClose}>
            <Close style={{fill: colors.icon}}/>
          </IconButton>
          <video autoPlay id={'video-player'} controls={true} style={{width: '100%', maxWidth: 900, height: 'auto', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} 
            src={props.src !== undefined ? props.src : 
              serverRoot +
              `/file/download_file?token=${token}&moduleWorkerId=${props.moduleWorkerId}&fileId=${props.fileId}`}/>
        </div>
    </Dialog>
  )
}
