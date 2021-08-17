import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Card,
  CardBody
} from "reactstrap";
import { setRoomId, roomId } from '../../App'
import { notesPath, whiteboardPath } from "../../util/Utils";

export let NoteBox = (props) => {
    let rId = roomId
    while (rId.length < 22) {
      rId = '0' + rId;
    }
    return (
      <Card style={{height: '100%', marginTop: 8, width: '100%'}}>
          <CardBody style={{position: 'relative'}}>
            <iframe allowTransparency={true} name="board-frame" src={'http://localhost:9001' + '/p/' + rId}
            style={{width: '100%', height: 'calc(100vh - 64px)', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: 'transparent', background: 'none transparent'}} frameBorder="0"></iframe>
          </CardBody>
      </Card>);
};