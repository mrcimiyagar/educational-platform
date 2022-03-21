import { AppBar, Fab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Notes, Search } from "@material-ui/icons";
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React from "react";
import { pathConfig } from "../..";
import { gotoPage, isDesktop, isInRoom, boardFrame, setBoardFrame } from "../../App";
import { colors, me } from "../../util/settings";
import './style.css';

let cachedIframe = null;

export let BoardBox = (props) => {
    if (boardFrame === undefined) {
      setBoardFrame(
        <iframe allowTransparency={true} name="board-frame" src={pathConfig.whiteBoard + `/boards/${props.roomId}`}
          frameborder="0" style={{border: 0, borderRadius: isDesktop() ? 24 : 0, width: '100%',
          height: '100%', position: 'absolute', left: 0, 
          top: 0, bottom: 0, right: 0}}>
        </iframe>
      );
    }
    return (
      <div id={props.id} style={{backgroundColor: 'transparent', background: 'transparent', height: '100%', width: '100%', marginLeft: (isDesktop() && isInRoom()) ? 16 : 0, marginRight: (isDesktop() && isInRoom()) ? 16 : 0, position: 'relative', zIndex: 99999}}>
          <div style={{position: 'relative', height: '100%', width: '100%'}}>
            <div className="maincontentdiv" style={{borderRadius: isDesktop() ? 24 : 0}}>
              {(props.membership !== undefined && props.membership !== null) ? boardFrame : null}
              {(props.membership !== undefined && props.membership !== null && props.membership.canUseWhiteboard) ?  
                null : 
                <div style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}/>
              }
            </div>
          </div>
      </div>);
};
