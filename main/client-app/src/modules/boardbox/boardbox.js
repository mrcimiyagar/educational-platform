import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Card,
  CardBody
} from "reactstrap";
import { whiteboardPath } from "../../util/Utils";

export let BoardBox = (props) => {
    let roomId = props.roomId + '';
    while (roomId.length < 22) {
      roomId = '0' + roomId;
    }
    return (
      <Card style={{height: props.boxHeight, display: props.style.display, marginTop: 16, width: '100%'}}>
          <CardBody style={{position: 'relative'}}>
            <iframe name="board-frame" src={whiteboardPath + '/#room=91bd46ae3aa84dff9d20,' + roomId}
            style={{width: '100%', height: props.boxHeightInner, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}} frameBorder="0"></iframe>
            {(props.membership !== undefined && props.membership !== null && props.membership.canUseWhiteboard) ?  
                null : 
                <div style={{zIndex: 3000, width: '100%', height: props.boxHeightInner, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}/>
            }
          </CardBody>
      </Card>);
};