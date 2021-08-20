import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";

export function WaveSurferBox(props) {
  return (
    <iframe 
        onLoad={() => {window.frames['wavesurfer-' + props.fileId].postMessage({sender: 'main', src: props.src}, 'http://localhost:1012')}}
        id={'wavesurfer-' + props.fileId}
        name={'wavesurfer-' + props.fileId}
        frameBorder='0'
        allowTransparency={true}
        src={'http://localhost:1012'}
        style={{width: '100%', height: 64}}/>
  )
}
