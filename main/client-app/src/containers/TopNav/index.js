import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import {AppBar, Avatar, Typography, useMediaQuery, useTheme} from '@material-ui/core';

import { colors, me, token } from "../../util/settings";
import {setProfileState, toggleMenu, toggleProfileSetup} from '../Sidebar';
import { isDesktop } from "../../App";
import { config, roomId, validateToken } from "../../util/Utils";

import Logo from './logo.png';

import Appbar from "../../components/Appbar";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { connect } from "react-redux";
import store, { changePeopleChatMode, PeopleChatModes, switchConf, switchWebinar } from "../../redux/main";

import { StopScreenShare, VideocamOff, VolumeOff } from "@material-ui/icons";
import VideocamIcon from '@material-ui/icons/Videocam';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { notifyMeOnAccessChange, notifyMeOnAccessChangeNavbar, updateConf } from '../../routes/pages/conference';
import { updateVideoBox } from "../../modules/videobox/videobox";
import { updateConfBox } from "../../modules/confbox";

export let fetchAccessChangeCallbackNavbar = undefined

export let reloadNavbar = () => {
  if (document.getElementById('topNavUserTitle') === null) return;
  document.getElementById('topNavUserTitle').innerHTML = isDesktop ? (me.firstName + ' ' + me.lastName) : me.firstName;
};
export let reloadNavbarState = undefined
export let hideNavbar = undefined
export let viewNavbar = undefined
export let setTitle = undefined
export let updateActorsNavbar = undefined
export let updateNavbar = undefined

class TopNav extends Component {
  constructor(props) {
    super(props);

    updateNavbar = () => this.forceUpdate()
    
    this.menuButtonClick = this.menuButtonClick.bind(this);
    this.mobileMenuButtonClick = this.mobileMenuButtonClick.bind(this);
    this.handleChangeLocale = this.handleChangeLocale.bind(this);
    this.state = {
      isInFullScreen: false,
      loaded: true,
      title: '',
      muted: false,
      actors: []
    };

    validateToken(token, (result) => {
      if (result) {
        this.setState({loaded: true})
      }
    })

    updateActorsNavbar = (a) => {
      this.setState({actors: a})
    }

    reloadNavbarState = () => {
      validateToken(token, (result) => {
        if (result) {
          this.setState({loaded: true});
        }
      })
    }

    hideNavbar = () => {
      this.setState({loaded: false});
    }

    viewNavbar = () => {
      this.setState({loaded: true});
    }

    setTitle = (t) => {
      this.setState({title: t})
    }

    updateActorsNavbar = updateActorsNavbar.bind(this)
    reloadNavbarState = reloadNavbarState.bind(this)
    hideNavbar = hideNavbar.bind(this)
    viewNavbar = viewNavbar.bind(this)
  }

  handleChangeLocale = locale => {
    this.props.changeLocale(locale);
  };
  
  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen
    });
  };

  menuButtonClick(e, menuClickCount, containerClassnames) {

    if (e !== undefined) {
      e.preventDefault();
    }

    toggleMenu();
  }
  mobileMenuButtonClick(e, containerClassnames) {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  }

  closedFirst = false;

  render() {
    if (this.state.loaded === false) {
      return null
    }
    let screen = store.getState().global.webinar.screen
    return (
      <Appbar>
        <nav className="navbar fixed-top" style={{height: 64, paddingTop: 16, zIndex: 1000, backgroundColor: colors.primary}}>

        {
          config !== undefined && config !== null && isDesktop ?
          <Button
          outline
          style={{position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', border: 'none', background: 'transparent'}}
          className="menu-button d-none d-md-block"
          onClick={e => toggleMenu()}
        >
          <MenuIcon style={{fill: colors.textIcons, width: 24, height: 24}}/>
        </Button> :
        null
        }

        {
          config !== undefined && config !== null && !isDesktop ?
          <Button
              outline
              style={{position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', border: 'none', background: 'transparent'}}
              className="menu-button-mobile d-xs-block d-sm-block d-md-none"
              onClick={e => {toggleMenu()}}
          >
            <MenuIcon style={{fill: colors.textIcons, width: 24, height: 24}}/>
          </Button> :
          null
        }
        
        {
          this.props.main.isInConference === true ?
          <Button
              outline
              style={{position: 'absolute', top: '50%', right: 72, transform: 'translateY(-50%)', border: 'none', background: 'transparent'}}
              onClick={e => {
                if (this.props.main.peopleAndChat === PeopleChatModes.ALL) {
                  store.dispatch(changePeopleChatMode(PeopleChatModes.CHAT));
                }
                else if (this.props.main.peopleAndChat === PeopleChatModes.CHAT) {
                  store.dispatch(changePeopleChatMode(PeopleChatModes.NONE));
                }
                else if (this.props.main.peopleAndChat === PeopleChatModes.NONE) {
                  store.dispatch(changePeopleChatMode(PeopleChatModes.ALL));
                }
              }}
          >
            <MenuOpenIcon style={{fill: colors.textIcons, width: 24, height: 24}}/>
          </Button> :
          null
        }

        <p style={{color: colors.textIcons, position: 'absolute', top: '50%', right: 144, transform: 'translateY(-50%)', border: 'none', background: 'transparent'}}>
        {this.state.title}
        </p>

        <a style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} href="/app/home">
          <img style={{width: 84, height: 56}} src={Logo}/>
        </a>

        <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 144}}>

          <ButtonGroup variant="contained" color="primary">

                <Button id="micButton" disabled={!store.getState().global.conf.isAudioEnable && this.state.actors.includes(me.id)} onClick={() => {
                  if (this.state.actors.includes(me.id)) {
                    if (store.getState().global.webinar.audio === false) {
                      store.dispatch(switchWebinar('audio', true))
                      updateVideoBox()
                      updateConf()
                      window.frames['audio-frame'].postMessage({sender: 'audioBroadcastWrapper', stream: true}, 'https://webinaraudio.kaspersoft.cloud')
                    }
                    else {
                      store.dispatch(switchWebinar('audio', false))
                      updateVideoBox()
                      updateConf()
                      window.frames['audio-frame'].postMessage({sender: 'audioBroadcastWrapper', stream: false}, 'https://webinaraudio.kaspersoft.cloud')
                    }
                  }
                  else {
                    window.frames['conf-audio-frame'].postMessage({sender: 'main', action: 'switchFlag', stream: !store.getState().global.conf.audio}, 'https://confaudio.kaspersoft.cloud')
                    store.dispatch(switchConf('audio', !store.getState().global.conf.audio))
                    this.forceUpdate()
                    updateConfBox()
                  }
                }}>{this.state.actors.includes(me.id) ? store.getState().global.webinar.audio ? <MicIcon/> : <MicOffIcon/> :
                  store.getState().global.conf.audio && store.getState().global.conf.isAudioEnable ? <MicIcon/> : <MicOffIcon/>}</Button>
                
                <Button id="scrButton" disabled={!this.state.actors.includes(me.id)} onClick={() => {
                  if (store.getState().global.webinar.screen === false) {
                    store.dispatch(switchWebinar('screen', true))
                    updateVideoBox()
                    updateConf()
                    window.frames['screen-frame'].postMessage({sender: 'screenBroadcastWrapper', stream: true}, 'https://webinarscreen.kaspersoft.cloud')
                    if (store.getState().global.webinar.video === true) {
                      window.frames['video-frame'].postMessage({sender: 'videoBroadcastWrapper', stream: false}, 'https://webinarvideo.kaspersoft.cloud')
                      window.frames['video-frame-small'].postMessage({sender: 'videoBroadcastWrapper', stream: true, size: {width: 256, height: 256}}, 'https://webinarvideo.kaspersoft.cloud')
                    }
                  }
                  else {
                    store.dispatch(switchWebinar('screen', false))
                    updateVideoBox()
                    updateConf()
                    window.frames['screen-frame'].postMessage({sender: 'screenBroadcastWrapper', stream: false}, 'https://webinarscreen.kaspersoft.cloud')
                    if (store.getState().global.webinar.video === true) {
                      window.frames['video-frame-small'].postMessage({sender: 'videoBroadcastWrapper', stream: false}, 'https://webinarvideo.kaspersoft.cloud')
                      window.frames['video-frame'].postMessage({sender: 'videoBroadcastWrapper', stream: true, size: {width: 1000, height: 600}}, 'https://webinarvideo.kaspersoft.cloud')
                    }
                  }
                }}>{store.getState().global.webinar.screen ? <ScreenShareIcon/> : <StopScreenShare/>}</Button>
                
                <Button id="camButton" disabled={!store.getState().global.conf.isVideoEnable && this.state.actors.includes(me.id)} onClick={() => {
                  if (this.state.actors.includes(me.id)) {
                    if (store.getState().global.webinar.video === false) {
                      store.dispatch(switchWebinar('video', true))
                      updateVideoBox()
                      updateConf()
                      if (screen === true) {
                        window.frames['video-frame-small'].postMessage({sender: 'videoBroadcastWrapper', stream: true, size: {width: screen ? 256 : 1000, height: screen ? 256 : 600}}, 'https://webinarvideo.kaspersoft.cloud')
                      }
                      else {
                        window.frames['video-frame'].postMessage({sender: 'videoBroadcastWrapper', stream: true, size: {width: screen ? 256 : 1000, height: screen ? 256 : 600}}, 'https://webinarvideo.kaspersoft.cloud')
                      }
                    }
                    else {
                      store.dispatch(switchWebinar('video', false))
                      updateVideoBox()
                      updateConf()
                      if (screen === true) {
                        window.frames['video-frame-small'].postMessage({sender: 'videoBroadcastWrapper', stream: false}, 'https://webinarvideo.kaspersoft.cloud')
                      }
                      else {
                        window.frames['video-frame'].postMessage({sender: 'videoBroadcastWrapper', stream: false}, 'https://webinarvideo.kaspersoft.cloud')
                      }
                    }
                  }
                  else {
                    window.frames['conf-video-frame'].postMessage({sender: 'main', action: 'switchFlag', stream: !store.getState().global.conf.video}, 'https://confvideo.kaspersoft.cloud')
                    store.dispatch(switchConf('video', !store.getState().global.conf.video))
                    this.forceUpdate()
                    updateConfBox()
                  }
                }}>{this.state.actors.includes(me.id) ? store.getState().global.webinar.video ? <VideocamIcon/> : <VideocamOff/> :
                    store.getState().global.conf.video && store.getState().global.conf.isVideoEnable ? <VideocamIcon/> : <VideocamOff/>}</Button>
              
                {this.state.actors.includes(me.id) ?
                  null :
                  <Button
                    id="muteButton"
                    onClick={() => {
                      window.frames['audio-frame'].postMessage({sender: 'speaker', muted: !this.state.muted}, 'https://webinaraudio.kaspersoft.cloud')
                      this.setState({muted: !this.state.muted})
                    }}
                  >
                    {this.state.muted ? <VolumeOff/> : <VolumeUpIcon/>}
                  </Button>}
          </ButtonGroup>

        </div>
        
        {
          config !== undefined && config !== null ?
          <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0}} className="mr-auto">
            <div style={{display: 'flex'}}>
                <span id={'topNavUserTitle'} onClick={toggleProfileSetup} style={{color: colors.textIcons, fontSize: 14, marginTop: 16, marginLeft: 8}}>
                  {isDesktop ? (me.firstName + ' ' + me.lastName) : me.firstName}
                </span>
                <span style={{marginLeft: 24}} onClick={toggleProfileSetup}>
                  <Avatar style={{width: 32, height: 32, marginTop: 8}}/>
                </span>
            </div>
          </div> :
          null
        }

      </nav>
      </Appbar>);
  }
}

const mapStateToProps = state => {
  return { main: state.global.main };
};
export default connect(mapStateToProps)(TopNav);;