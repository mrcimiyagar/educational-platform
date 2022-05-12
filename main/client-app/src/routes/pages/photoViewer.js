import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';
import ArrowForwardTwoTone from '@material-ui/icons/ArrowForwardTwoTone';
import React from 'react';
import "react-image-gallery/styles/css/image-gallery.css";
import { PhotoConsumer, PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import { popPage } from '../../App';
import {colors} from '../../util/settings';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PhotoViewer(props) {
  let [open, setOpen] = React.useState(true)
  const images = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnWW_4_fCR1Zze9-jo_AG-EHWgA9iDqHndg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnWW_4_fCR1Zze9-jo_AG-EHWgA9iDqHndg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnWW_4_fCR1Zze9-jo_AG-EHWgA9iDqHndg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnWW_4_fCR1Zze9-jo_AG-EHWgA9iDqHndg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnWW_4_fCR1Zze9-jo_AG-EHWgA9iDqHndg&usqp=CAU'
  ]
  return (
    <Dialog
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        open={open} fullScreen={true} TransitionComponent={Transition} style={{backdropFilter: colors.blur}} >
          <AppBar style={{direction: 'rtl', height: 64, position: 'fixed', left: 0, top: 0, backdropFilter: colors.blur, background: 'white', backgroundColor: 'rgba(255, 255, 255, 0.25)'}}>
            <Toolbar style={{height: 64}}>
              <IconButton onClick={() => {setOpen(false); setTimeout(popPage, 250);}}>
                <ArrowForwardTwoTone style={{width: 32, height: 32, fill: '#fff'}}/>
              </IconButton>
              <Typography variant={'body1'}>عکس ها</Typography>
            </Toolbar>
          </AppBar>
          <div style={{width: '100%', paddingLeft: 32, paddingRight: 32, paddingTop: 64}}></div>
        
          <PhotoProvider>
            {images.map((item, index) => (
              <PhotoConsumer key={index} src={item} intro={item}>
                <img style={{width: 'calc(100% - 32px)', marginTop: 16, marginLeft: 16, marginRight: 16}} src={item} alt="" />
              </PhotoConsumer>
            ))}
          </PhotoProvider>
    </Dialog>
  )
}

export default PhotoViewer
