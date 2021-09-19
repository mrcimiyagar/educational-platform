import { Dialog, IconButton, Slide } from '@material-ui/core';
import { ArrowForwardTwoTone } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { popPage, registerDialogOpen } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoPlayer(props) {
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen)
  const handleClose = () => {
      setOpen(false);
      setTimeout(popPage, 250);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        let videoPlayer = document.getElementById('video-player')
        videoPlayer.addEventListener('loadeddata', (e) => {
          if (videoPlayer.readyState >= 3){
            videoPlayer.style.width = window.innerWidth + 'px'
            videoPlayer.style.height = (window.innerWidth * videoPlayer.videoHeight / videoPlayer.videoWidth) + 'px'
            videoPlayer.play()
          }
        });
      });
    }
  }, [open])

  return (
    <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <div style={{width: '100%', height: '100%'}}>
          <IconButton style={{position: 'fixed', right: 12, top: 24}} onClick={() => {setOpen(false); setTimeout(popPage, 250)}}>
            <ArrowForwardTwoTone style={{fill: '#fff'}}/>
          </IconButton>
          <video id={'video-player'} controls={true} style={{width: 0, height: 0, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} src={props.src}/>
        </div>
      </Dialog>
    )
}
