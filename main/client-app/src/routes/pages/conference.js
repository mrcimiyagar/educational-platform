import { IconButton } from "@material-ui/core";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ChatIcon from '@material-ui/icons/Chat';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import NoteIcon from '@material-ui/icons/Note';
import PeopleIcon from '@material-ui/icons/People';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PollIcon from '@material-ui/icons/Poll';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import VideocamIcon from '@material-ui/icons/Videocam';
import "chartjs-plugin-datalabels";
import React, { Component } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { connect } from "react-redux";
import "react-table/react-table.css";
import {
    Button
} from "reactstrap";
import { gotoPage, isDesktop, roomId, setRoomId } from '../../App';
import BottomSheet from '../../components/BottomSheet';
import DivSize2 from "../../components/DivSize/DivSize2";
import RoomTreeMenu from '../../components/RoomTreeMenu';
import { toggleInviteUserModal, togglePoll } from "../../containers/Sidebar";
import { fetchAccessChangeCallbackNavbar, reloadNavbar, reloadNavbarState, setTitle } from "../../containers/TopNav";
import { BoardBox } from "../../modules/boardbox/boardbox";
import { ChatBox } from "../../modules/chatbox/chatbox";
import { ConfBox } from "../../modules/confbox";
import { FileBox, toggleFileBox } from "../../modules/filebox/filebox";
import { NoteBox } from "../../modules/notebox/notebox";
import { PollBox, togglePolling } from "../../modules/pollbox/pollbox";
import { PresentBox } from "../../modules/presentbox/presentbox";
import { TaskBox } from "../../modules/taskbox/taskbox";
import { UsersBox } from "../../modules/usersbox/usersbox";
import { VideoBox } from "../../modules/videobox/videobox";
import store, { changeConferenceMode, PeopleChatModes } from "../../redux/main";
import { colors, me, setToken, token } from "../../util/settings";
import { ConnectToIo, FetchMe, leaveRoom, roothPath, serverRoot, socket, validateToken } from "../../util/Utils";






let accessChangeCallback = undefined;
export let notifyMeOnAccessChange = (callback) => {
  accessChangeCallback = callback;
};
let accessChangeCallbackNavbar = undefined
export let notifyMeOnAccessChangeNavbar = (callback) => {
  accessChangeCallbackNavbar = callback;
};
export let reloadConf = undefined
export let updateConf = undefined

class ConferencePage extends Component {

  noname = false

  constructor(props) {
    super(props)
    this.state = {
      flagPanel: [false, false, false, false, false],
      drawerOpen: false,
      drawerOpen2: false,
      loaded: false,
      flagsOnCount: 0,
      pageSize: {width: 0, height: 0},
      view: 'videos',
      membership: {},
      played: false,
      camera: false,
      screen: false,
      isConfVisible: true
    }
    let that = this
    updateConf = () => {
      that.forceUpdate()
    }
    reloadConf = () => {
      this.setState({
        flagPanel: [false, false, false, false, false],
        drawerOpen: false,
        drawerOpen2: false,
        loaded: false,
        flagsOnCount: 0,
        pageSize: {width: 0, height: 0},
        view: 'videos',
        membership: {},
        played: false
      }, () => {
        that.loadData()
      })
    }
  }

  updateActors = () => {
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/video/get_actors", requestOptions4)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        this.setState({actors: result.users.map(u => u.id)})
        //updateActorsNavbar(result.users.map(u => u.id))
      });
  }

  onSocketAuth = () => {
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/enter_room", requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          this.setState({
            membership: result.membership
          })
          reloadNavbarState()
          reloadNavbar()
          this.setState({
            loaded: true
          })
          this.forceUpdate()
        })
        .catch(error => console.log('error', error));
  }

  getPersonality = () => {
    let userTitle = 'anonymous';
    if (!this.noname) {
      userTitle = prompt('عنوان خود را وارد کنید :', '');
    }
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: roomId,
        name: userTitle
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/make_personality", requestOptions)
      .then(response => response.json())
      .then(result => {
        leaveRoom(() => {
          localStorage.setItem('token', result.token);
          setToken(result.token);
          window.location.href = roothPath + `/app/conf?room_id=${roomId}&is_guest=${'true'}&guest_token=${result.token}`
        });
      });
  }

  processMessage = (e) => {
    if (e.data.sender === 'videoconference') {
      if (e.data.selector === 'camera') {
        this.setState({camera: e.data.value})
      }
      else if (e.data.selector === 'screen') {
        this.setState({screen: e.data.value})
      }
    }
  }

  loadData = () => {
    leaveRoom(() => {
      window.removeEventListener('message', this.processMessage)
      window.addEventListener('message', this.processMessage, false)
      if (isDesktop) {
        this.setState({flagPanel: [true, true, true, true, true, true]})
      } else {
        this.setState({flagPanel: [false, false, false, false, false, false]})
      }
      const search = this.props.location.search
      let rId = new URLSearchParams(search).get('room_id')
      let isGuest = new URLSearchParams(search).get('is_guest')
      this.noname = (new URLSearchParams(search).get('no_name') === 'true')
      let guestToken = new URLSearchParams(search).get('guest_token')
      if (rId === null) {
        rId = prompt("شناسه ی روم را وارد کنید :", "")
        if (rId === null) {
          alert('ورود به روم ناموفق')
          gotoPage('/app/home')
        }
        else {
          setRoomId(rId)
          gotoPage('/app/conf?room_id=' + rId)
        }
      } else {
        setRoomId(rId)
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            roomId: rId
          }),
          redirect: 'follow'
        };
        fetch(serverRoot + "/room/get_room", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result))
              this.room = result.room
              setTitle(result.room.name)
            })
            .catch(error => console.log('error', error));
      }
      if (isGuest === 'true') {
        if (guestToken === null) {
          this.getPersonality();
        }
        else {
          localStorage.setItem('token', guestToken);
          setToken(guestToken);
          FetchMe(() => {
            reloadNavbarState();
            reloadNavbar();
            ConnectToIo(token, () => {
              this.onSocketAuth();
            }, true);
          });
        }
      }
      else {
        setToken(localStorage.getItem('token'));
        validateToken(token, (result) => {
          if (result) {
            this.onSocketAuth()
            this.setState({loaded: true})
          }
          else {
            gotoPage('/app/register')
          }
        })
      }
      socket.off('membership-updated')
      socket.on('membership-updated', mem => {
        this.setState({membership: mem})
        if (accessChangeCallback !== undefined) {
          accessChangeCallback(mem)
        }
        if (accessChangeCallbackNavbar !== undefined) {
          accessChangeCallbackNavbar(mem)
        }
        this.updateActors()
      })

      this.updateActors()
    
      socket.off('view-updated')
      socket.on('view-updated', v => {
        this.setState({view: v})
      })
  
      window.scrollTo(0, 0);
      
      store.dispatch(changeConferenceMode(true));

      fetchAccessChangeCallbackNavbar()
      });
  }

  componentDidMount() {
    this.loadData()
  }

  onFlagClicked = (index) => {
    let fp = this.state.flagPanel
    fp[index] = !fp[index]
    this.setState({flagPanel: fp})
    let fOnCount = 0
    this.state.flagPanel.forEach(flag => {
      if (flag) fOnCount++
    });
    this.setState({flagPanel: this.state.flagPanel})
    this.setState({flagsOnCount: fOnCount})
    this.forceUpdate()
  }

  updateView = (v) => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        view: v,
        roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/view/update_view", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
        })
        .catch(error => console.log('error', error));
  }
  
  render() {

  if (!this.state.played && !this.noname) {
    return <Button id={'confEnter'} style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 128, height: 128}} onClick={() => this.setState({played: true})}><PlayCircleFilledIcon style={{width: 56, height: 56}}/></Button>
  }

  let screen = store.getState().global.webinar.screen

  if (isDesktop) {
    return (
      <div style={{width: '100%', height: '100vh', position: 'fixed', right: 0, paddingRight: 16, top: 64, backgroundColor: colors.primaryDark}}>
        <div style={{width: '100%', display: 'flex', position: 'relative'}}>
            <div style={{position: 'absolute', right: 0, top: 0}}>
              <RoomTreeMenu membership={this.state.membership} roomId={roomId} room={this.room} />
            </div>
            <div style={{width: 212, height: 'calc(100vh - 104px)', zIndex: 3000, display: (this.props.main.peopleAndChat === PeopleChatModes.ALL) ? 'block' : 'none'}}>
              <UsersBox membership={this.state.membership} roomId={roomId} room={this.room} boxHeight={'calc(100vh - 104px)'} style={{display: 'block'}}/>
            </div>
            <div className="mb-4" style={{marginRight: 12, padding: 16, width: 256 + 16, height: 'auto', backgroundColor: colors.primaryDark, zIndex: 3000, marginTop: (this.state.view === 'videos' || this.state.view === 'presentation' || this.state.view === 'whiteboard' || this.state.view === 'notes') && store.getState().global.webinar.video && store.getState().global.webinar.screen ? 256 : 0, display: (this.props.main.peopleAndChat === PeopleChatModes.ALL || this.props.main.peopleAndChat === PeopleChatModes.CHAT) ? 'block' : 'none'}}>
              <ChatBox membership={this.state.membership} roomId={roomId} style={{display: 'block'}} boxHeight={(this.state.view === 'videos' || this.state.view === 'presentation' || this.state.view === 'whiteboard' || this.state.view === 'notes') && store.getState().global.webinar.video && store.getState().global.webinar.screen ? 'calc(100vh - 104px - 256px)' : 'calc(100vh - 104px)'} boxHeightInner={(this.state.view === 'videos' || this.state.view === 'presentation' || this.state.view === 'whiteboard' || this.state.view === 'notes') && store.getState().global.webinar.video && store.getState().global.webinar.screen ? 'calc(100vh - 264px - 256px)' : 'calc(100vh - 264px)'}/>
            </div>
            <div style={{marginRight: -256 - 8, marginTop: 8, zIndex: 3001, position: 'relative', display: ((screen || this.state.view === 'presentation' || this.state.view === 'whiteboard' || this.state.view === 'notes') && store.getState().global.webinar.video) ? 'block' : 'none', width: 256 + 8, backgroundColor: colors.primaryDark, height: 256}}>
              <div style={{width: 256, height: 256, display: 'flex', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>
                {this.state.actors.includes(me.id) ?
                  <iframe id ={'video-frame-small'} name="video-frame-small" src={'https://webinarvideo.kaspersoft.cloud/broadcast_video.html'} allow={'microphone; camera'}
                    style={{display: store.getState().global.webinar.video === true ? 'block' : 'none', zIndex: 4000, width: 256, height: 256}} frameBorder="0"></iframe> :
                  <iframe id ={'video-frame-small'} name="video-frame-small" src={'https://webinarvideo.kaspersoft.cloud/watch_video.html'} allow={'microphone; camera'}
                    style={{display: store.getState().global.webinar.video === true ? 'block' : 'none', zIndex: 4000, width: 256, height: 256}} frameBorder="0"></iframe>
                }
              </div>
            </div>
            <div className="mb-4" style={{width: this.props.main.peopleAndChat === PeopleChatModes.ALL ? 'calc(100% - 32px - 212px - 64px - 28px)' : this.props.main.peopleAndChat === PeopleChatModes.CHAT ? 'calc(100% - 128px)' : 'calc(100% - 32px - 72px)', position: 'absolute', left: 96, top: 16, height: this.state.isConfVisible ? 'calc(100vh - 104px - 256px)' : 'calc(100vh - 104px)', display: (this.state.view === 'videos' ? 'block' : 'none')}}>
              <VideoBox roomId={roomId} style={{display: 'block'}} boxHeight={this.state.isConfVisible ? 'calc(100vh - 104px - 256px)' : 'calc(100vh - 104px)'} boxHeightInner={this.state.isConfVisible ? 'calc(100vh - 104px - 256px)' : 'calc(100vh - 104px)'}/>
              {this.state.isConfVisible ? 
                null : 
                <IconButton style={{position: 'absolute', right: 256 + 16 + 8, bottom: 8}} onClick={() => {
                  this.setState({isConfVisible: true})
                }}>
                  <KeyboardArrowUpIcon style={{fill: colors.textIcons}}/>
                </IconButton>
              }
            </div>
            <div className="mb-4" style={{marginRight: 16, width: this.props.main.peopleAndChat === PeopleChatModes.ALL ? 'calc(100% - 32px - 212px - 64px - 16px - 256px)' : this.props.main.peopleAndChat === PeopleChatModes.CHAT ? 'calc(100% - 16px - 64px - 256px)' : 'calc(100% - 32px - 72px)', position: 'absolute', left: 96, bottom: 16, height: 256, display: (this.state.isConfVisible && this.state.view === 'videos') ? 'block' : 'none'}}>
              <ConfBox roomId={roomId} boxHeight={256} boxHeightInner={256}/>
              <IconButton style={{position: 'absolute', right: 8, top: 8}} onClick={() => {
                this.setState({isConfVisible: false})
              }}>
                <KeyboardArrowDownIcon style={{fill: colors.textIcons}}/>
              </IconButton>
            </div>
            <div className="mb-4" style={{marginRight: 16, width: this.props.main.peopleAndChat === PeopleChatModes.ALL ? 'calc(100% - 32px - 212px - 64px - 16px - 256px)' : this.props.main.peopleAndChat === PeopleChatModes.CHAT ? 'calc(100% - 16px - 64px - 256px)' : 'calc(100% - 32px - 72px)', position: 'absolute', left: 96, top: 0, height: 'calc(100vh - 104px)', display: (this.state.view === 'presentation' || this.state.view === 'whiteboard' || this.state.view === 'notes') ? 'block' : 'none'}}>
                <div style={{display: this.state.view === 'presentation' ? 'block': 'none'}}>
                  <PresentBox membership={this.state.membership} roomId={roomId} style={{display: 'block' }} boxHeight={'calc(100vh - 104px)'}/>
                </div>
                <div style={{display: this.state.view === 'whiteboard' ? 'block': 'none'}}>
                  <BoardBox membership={this.state.membership} roomId={roomId} style={{display:'block'}} boxHeight={'calc(100vh - 104px)'} boxHeightInner={'calc(100vh - 104px)'}/>
                </div>
                <div style={{display: this.state.view === 'notes' ? 'block': 'none'}}>
                  <NoteBox membership={this.state.membership} roomId={roomId} style={{display:'block'}} boxHeight={'calc(100vh - 104px)'} boxHeightInner={'calc(100vh - 104px)'}/>
                </div>
            </div>
            <div className="mb-4" style={{marginRight: 16, marginLeft: 16, width: 64, position: 'absolute', left: 0}}>
            {
              this.state.membership.canUseWhiteboard ?
                <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  this.setState({view: 'whiteboard'});
                  this.updateView('whiteboard')
                }}>
                  <BorderColorIcon/>
                </Button> :
                null
            }
            {
              this.state.membership.canPresent ?
                <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  this.setState({view: 'presentation'});
                  this.updateView('presentation')
                }}>
                  <SlideshowIcon/>
                </Button> :
                null
            }
            <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  this.setState({view: 'conference'});
                }}>
              <PeopleIcon/>
            </Button>
            {
              this.state.membership.canUploadFile ?
                <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  toggleFileBox();
                }}>
                  <DescriptionIcon/>
                </Button> :
                null
            }
            <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  this.setState({view: 'videos'});
                  this.updateView('videos')
              }}>
              <VideocamIcon/>
            </Button>
            <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  if (togglePolling !== undefined) togglePolling();
                }}>
              <ThumbsUpDownIcon/>
            </Button>
            {
              this.state.membership.canAddPoll ?
                <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  togglePoll();
                }}>
                  <PollIcon/>
                </Button> :
                null
            }
            {
              this.state.membership.canInviteToRoom ?
                <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  toggleInviteUserModal();
                }}>
                  <EmailIcon/>
                </Button> :
                null
            }
            <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
                  this.setState({drawerOpen2: true});
                }}>
                  <ListAltIcon/>
            </Button>
            <Button outline color="primary" style={{marginTop: 16}} onClick={() => {
              this.setState({view: 'notes'});
              this.updateView('notes')
                }}>
                  <NoteIcon/>
            </Button>
          </div>
        </div>
        <PollBox roomId={roomId}/>
        <FileBox roomId={roomId}/>
        <BottomSheet setDrawerOpen={(d) => this.setState({drawerOpen2: d})} drawerOpen={this.state.drawerOpen2}>
          <TaskBox roomId={roomId} style={{display:'block'}} boxHeight={'calc(100vh - 104px)'} boxHeightInner={'calc(100vh - 146px)'}/>
        </BottomSheet>
      </div>
    );
  }
  else {
    return (
      <div style={{width: window.innerWidth + 'px', height: window.innerHeight + 'px', position: 'fixed', right: 0, paddingRight: 16, top: 0, backgroundColor: colors.primaryDark}}>
        <DivSize2 sizeFetcher={({width, height}) => {
          this.setState({pageSize: {width: width, height: height - 64}});
        }}/>
        <div style={{position: 'absolute', left: 0, top: 64, width: '100%', height: 'calc(100vh - 128px)'}}> 
          <UsersBox membership={this.state.membership} roomId={roomId} style={{display: this.state.flagPanel[0] ? 'block' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 48) : this.state.pageSize.height - 32}/>
          <ChatBox membership={this.state.membership} roomId={roomId} style={{display: this.state.flagPanel[1] ? 'block' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height} boxHeightInner={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 128) : this.state.pageSize.height - 112}/>
          <VideoBox roomId={roomId} style={{display: this.state.flagPanel[2] ? 'block' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height} boxHeightInner={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 48) : this.state.pageSize.height - 32}/>
          <PresentBox membership={this.state.membership} roomId={roomId} style={{display: this.state.flagPanel[3] ? 'flex' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 48) : this.state.pageSize.height - 32}/>
          <BoardBox membership={this.state.membership} roomId={roomId} style={{display: this.state.flagPanel[4] ? 'block' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height} boxHeightInner={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height}/>
          <BoardBox membership={this.state.membership} roomId={roomId} style={{display: this.state.flagPanel[5] ? 'block' : 'none'}} boxHeight={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height} boxHeightInner={this.state.flagsOnCount > 0 ? (this.state.pageSize.height / this.state.flagsOnCount - 16) : this.state.pageSize.height}/>
          <BottomSheet setDrawerOpen={(d) => this.setState({drawerOpen2: d})} drawerOpen={this.state.drawerOpen2}>
            <TaskBox roomId={roomId} style={{display:'block'}} boxHeight={'calc(100vh - 64px)'} boxHeightInner={'calc(100vh - 64px)'}/>
          </BottomSheet>

          <BottomSheet setDrawerOpen={d => this.setState({drawerOpen: d})} drawerOpen={this.state.drawerOpen}>
            <div style={{display: 'grid',
                         gridTemplateColumns: '50% 50%',
                         rowGap: '15px'
                       }}>
              {
                this.state.membership.canUseWhiteboard ?
                  <Button color="primary" className="default mb-2" outline={!this.state.flagPanel[4]} style={{height: 100, marginRight: 8}} onClick={() => this.onFlagClicked(4)}>
                    <BorderColorIcon/>
                  </Button> :
                  null
              }
              {
                this.state.membership.canPresent ?
                  <Button color="primary" className="default mb-2" outline={!this.state.flagPanel[3]} style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(3)}>
                    <SlideshowIcon/>
                  </Button> :
                  null
              }
              {
                this.state.membership.canUploadFile ?
                  <Button color="primary" className="default mb-2" outline onClick={() => toggleFileBox()} style={{height: 100, marginRight: 8}}>
                    <DescriptionIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" outline={!this.state.flagPanel[2]} style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(2)}>
                <VideocamIcon/>
              </Button>
              {
                this.state.membership.canAddMessage ?
                  <Button color="primary" className="default mb-2" outline={!this.state.flagPanel[1]} style={{height: 100, marginRight: 8}}  onClick={() => this.onFlagClicked(1)}>
                    <ChatIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" outline={!this.state.flagPanel[0]} style={{height: 100, marginRight: 16}}  onClick={() => this.onFlagClicked(0)}>
                <PeopleIcon/>
              </Button>
              {
                this.state.membership.canAddPoll ?
                  <Button color="primary" className="default mb-2" outline style={{height: 100, marginRight: 8}}  onClick={() => togglePoll()}>
                    <PollIcon/>
                  </Button> :
                  null
              }
              {
                this.state.membership.canInviteToRoom ?
                  <Button color="primary" className="default mb-2" outline style={{height: 100, marginRight: 16}}  onClick={() => toggleInviteUserModal()}>
                    <EmailIcon/>
                  </Button> :
                  null
              }
              <Button color="primary" className="default mb-2" outline style={{height: 100, marginRight: 8}} onClick={() => {
                  this.setState({view: 'notes'});
                  this.updateView('notes')
              }}>
                <NoteIcon/>
              </Button>
              <Button color="primary" className="default mb-2" outline style={{height: 100, marginRight: 16}} onClick={() => this.setState({drawerOpen2: true})}>
                <ListAltIcon/>
              </Button>
            </div>
          </BottomSheet>
        </div>
        <PollBox roomId={roomId}/>
        <FileBox roomId={roomId}/>
        <Button color="primary" className="mb-2" onClick={() => this.setState({drawerOpen: true})} style={{position: 'fixed', width: 56, height: 56, left: 16, bottom: 16, padding: 12, zIndex: 2000}}>
          <EditIcon/>
        </Button> 
      </div>
    );
  }
}
}
const mapStateToProps = state => {
  return { main: state.global.main };
};
export default connect(mapStateToProps)(ConferencePage);;