import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import React from "react";
import { pathConfig } from "../..";
import { isDesktop } from "../../App";

export let AudioBox = (props) => {
    window.addEventListener('message', e => {
      if (e.data.sender === 'audio-player') {
        if (e.data.action === 'start') {
          let playButton = document.getElementById('playButton')
          playButton.click()
        }
      }
    })
    return (
      <div style={{backgroundColor: isDesktop() ? 'rgba(255, 255, 255, 0.5)' : undefined, borderRadius: isDesktop() ? 24 : undefined, height: isDesktop() ? 650 : 'calc(100% - 72px)', width: isDesktop() ? 500 : 'calc(100% + 32px)', 
          marginLeft: isDesktop() ? undefined : -16, marginRight: isDesktop() ? undefined : -16}}>
          <div style={{position: 'relative', height: '100%'}}>
            <AppBar position={'static'} style={{width: isDesktop() ? 500 : '100%', height: 64,
              backgroundColor: 'rgba(21, 96, 233, 0.65)',
              borderRadius: isDesktop() ? '24px 24px 0 0' : undefined,
              backdropFilter: 'blur(10px)'}}>
              <Toolbar style={{width: '100%', height: '100%', justifyContent: 'center', textAlign: 'center'}}>
                <Typography variant={'h6'} style={{position: 'absolute', right: 16 + 32 + 16}}>مدیا پلیر</Typography>
                <IconButton style={{width: 32, height: 32, position: 'absolute', right: 16}} onClick={() => props.handleClose()}><ArrowForward style={{fill: '#fff'}}/></IconButton>
              </Toolbar>
            </AppBar>
            
            <iframe allowTransparency={true} name="audio-player-frame" id={'audio-player-frame'} src={pathConfig.audioPlayer}
              onLoad={() => {window.frames['audio-player-frame'].postMessage({sender: 'main', action: 'config', src: props.src, isDesktop: isDesktop()}, pathConfig.audioPlayer)}}
              style={{width: '100%', height: 'calc(100% - 64px)', position: 'absolute', left: 0, top: 64, bottom: 0, right: 0}} frameBorder="0"></iframe>
          </div>
      </div>);
};