import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Card,
  CardBody
} from "reactstrap";
import { notesPath, whiteboardPath } from "../../util/Utils";

export let NoteBox = (props) => {
    let roomId = props.roomId + '';
    while (roomId.length < 22) {
      roomId = '0' + roomId;
    }
    return (
      <Card style={{height: props.boxHeight, display: props.style.display, marginTop: 16, width: '100%'}}>
          <CardBody style={{position: 'relative'}}>
            <iframe name="board-frame" src={notesPath + '/p/' + roomId}
            style={{width: '100%', height: props.boxHeightInner, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}} frameBorder="0"></iframe>
          </CardBody>
      </Card>);
};