import React from "react";
import { pathConfig } from "../..";
import { token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";

export function WaveSurferBox(props) {
  return (
    <iframe
        onLoad={() => {window.frames['wavesurfer-' + props.fileId].postMessage({sender: 'main', serverRoot: serverRoot, src: props.src, token: token, fileId: props.fileId, roomId: props.roomId}, pathConfig.waveSurferBox)}}
        id={'wavesurfer-' + props.fileId}
        name={'wavesurfer-' + props.fileId}
        frameBorder='0'
        allowTransparency={true}
        src={pathConfig.waveSurferBox}
        style={{width: '100%', height: 64}}/>
  )
}
