import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import React from "react";

export let AudioBox = (props) => {
    let [playing, setPlaying] = React.useState(false)
    window.addEventListener('message', e => {
      if (e.data.sender === 'audio-player') {
        if (e.data.action === 'start') {
          let playButton = document.getElementById('playButton')
          playButton.click()
        }
      }
    })
    return (
      <div style={{height: 'calc(100% - 72px)', width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}}>
          <div style={{position: 'relative', height: '100%'}}>
            <AppBar style={{width: '100%', height: 64,
              backgroundColor: 'rgba(21, 96, 233, 0.65)',
              backdropFilter: 'blur(10px)'}}>
              <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>مدیا پلیر</Typography>
                <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => props.handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
              </Toolbar>
            </AppBar>
            
            <iframe allowTransparency={true} name="audio-player-frame" id={'audio-player-frame'} src={'http://localhost:1013'}
              onLoad={() => {window.frames['audio-player-frame'].postMessage({sender: 'main', action: 'config', src: props.src}, 'http://localhost:1013')}}
              style={{width: '100%', height: 'calc(100% - 64px)', position: 'absolute', left: 0, top: 64, bottom: 0, right: 0}} frameBorder="0"></iframe>
          </div>
      </div>);
};