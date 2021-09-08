import React from "react";
import { pathConfig } from "../..";

export function WaveSurferBox(props) {
  return (
    <iframe 
        onLoad={() => {window.frames['wavesurfer-' + props.fileId].postMessage({sender: 'main', src: props.src}, pathConfig.WaveSurferBox)}}
        id={'wavesurfer-' + props.fileId}
        name={'wavesurfer-' + props.fileId}
        frameBorder='0'
        allowTransparency={true}
        src={pathConfig.WaveSurferBox}
        style={{width: '100%', height: 64}}/>
  )
}
