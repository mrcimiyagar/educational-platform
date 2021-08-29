import React from "react";
import {
    Card,
    CardBody
} from "reactstrap";
import './style.css';

export let NoteBox = (props) => {
    let rId = props.roomId
    while (rId.length < 22) {
      rId = '0' + rId;
    }
    return (
      <div style={{height: '100%', marginTop: 8, width: '100%'}}>
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <iframe allowTransparency={true} name="notes-frame" src={'http://localhost:9001' + '/p/' + rId}
                style={{width: '100%', height: 'calc(100% - 64px)', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: 'transparent', background: 'none transparent'}} frameBorder="0"></iframe>
          </div>
      </div>);
};