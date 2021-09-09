import { AppBar, createTheme, Fab, IconButton, ThemeProvider, Toolbar, Typography } from "@material-ui/core";
import { green, pink } from "@material-ui/core/colors";
import { ArrowForward, Mic, MicOff, Notes, VideocamOff } from "@material-ui/icons";
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Chat from "@material-ui/icons/Chat";
import Menu from "@material-ui/icons/Menu";
import PollIcon from '@material-ui/icons/Poll';
import Search from "@material-ui/icons/Search";
import SettingsIcon from '@material-ui/icons/Settings';
import VideocamIcon from '@material-ui/icons/Videocam';
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import React, { useEffect } from "react";
import { gotoPage, isDesktop, isInRoom } from '../../App';
import store, { switchConf } from "../../redux/main";
import { colors, me, theme } from '../../util/settings';
import { useForceUpdate } from "../../util/Utils";
import './style.css';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import { pathConfig } from "../..";

export let updateConfBox = undefined
export let isConfConnected = false

export let ConfBox = (props) => {
    return (
      <div>
        hello
      </div>
    );
};
