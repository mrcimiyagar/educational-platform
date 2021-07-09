import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './style.css';
import { taskManagerPath } from "../../util/Utils";

export let TaskBox = (props) => {
    return (
      <iframe name="task-frame" src={taskManagerPath} style={{width: '100%', height: props.boxHeightInner}} frameBorder="0"></iframe>
    );
};