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
    let forceUpdate = useForceUpdate()
    updateConfBox = forceUpdate
    let [video, setVideo] = React.useState(false)
    let [audio, setAudio] = React.useState(false)
    let [connected, setConnected] = React.useState(false)
    isConfConnected = connected
    useEffect(() => {
      window.addEventListener('message', e => {
        if (e.data.action === 'switchVideoControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('video', false))
          store.dispatch(switchConf('isVideoEnable', e.data.visibility))
          setVideo(e.data.visibility)
          forceUpdate()
        }
        else if (e.data.action === 'switchAudioControlVisibility') {
          if (!e.data.visibility)
            store.dispatch(switchConf('audio', false))
          store.dispatch(switchConf('isAudioEnable', e.data.visibility))
          setAudio(e.data.visibility)
          forceUpdate()
        }
      })
    }, [])
    let [uniqueKey, setUniqueKey] = React.useState(Math.random())
    const theme2 = createTheme({
      palette: {
        primary: {
          main: '#2196f3',
        },
        secondary: green
      },
    });
    return (
      <div>
        
        hello
      </div>
    );
};
