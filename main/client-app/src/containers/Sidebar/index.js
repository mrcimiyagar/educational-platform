import React, { Component } from "react";
import {Button, CustomInput, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem} from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import Switch from "rc-switch";
import {myCache, ThemeColor} from '../../index';

import EmailIcon from '@material-ui/icons/Email';

import {colors, me, token} from "../../util/settings";
import {Fab, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import Select from "react-select";
import CustomSelectInput from "../../components/CustomSelectInput";
import {reloadSurveysList} from '../../routes/pages/survey';
import {reloadNavbar} from '../TopNav';
import {reloadUsersList} from '../../modules/usersbox/usersbox';

import AppsIcon from '@material-ui/icons/Apps';
import { config, getColor, roothPath, serverRoot, socket } from "../../util/Utils";

import isReachable from 'is-reachable';
import { gotoPage } from "../../App";

export let toggleMenu = undefined;
export let toggleAddRoom = undefined;
export let toggleAddSurvey = undefined;
export let togglePermissions = undefined;
export let toggleProfileSetup = undefined;
export let toggleRooms = undefined;
export let toggleInvites = undefined;
export let togglePoll = undefined;
export let toggleInviteUserModal = undefined;

let roomsPreviewIntervals = [];

let targetUserId;
let roomId;

export let setPermissionState = (rId, tUserId) => {
  targetUserId = tUserId;
  roomId = rId;
}

export let setProfileState = (rId) => {
  roomId = rId;
}

let reloadRoomsList;

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.toggleAddRoomModal = this.toggleAddRoomModal.bind(this);
    this.toggleInviteUserModal = this.toggleInviteUserModal.bind(this);
    this.togglePoll = this.togglePoll.bind(this);
    this.toggleInviteQuestModal = this.toggleInviteQuestModal.bind(this);
    this.toggleAddSurveyModal = this.toggleAddSurveyModal.bind(this);
    this.toggleAddSurveyLabelModal = this.toggleAddSurveyLabelModal.bind(this);
    this.addSurveyLabel = this.addSurveyLabel.bind(this);
    this.toggleAddSurveyCatModal = this.toggleAddSurveyCatModal.bind(this);
    this.addSurveyCat = this.addSurveyCat.bind(this);
    this.toggleRoomPermission = this.toggleRoomPermission.bind(this);
    this.toggleSetupProfile = this.toggleSetupProfile.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleRoomsList = this.toggleRoomsList.bind(this);
    this.toggleInvitesList = this.toggleInvitesList.bind(this);
    this.fetchInvites = this.fetchInvites.bind(this);
    this.fetchRooms = this.fetchRooms.bind(this);
    this.togglePoll = this.togglePoll.bind(this);
    this.toggleInviteUserModal = this.toggleInviteUserModal.bind(this);

    reloadRoomsList = this.fetchRooms;

    togglePoll = this.togglePoll;
    toggleMenu = () => this.toggle();
    toggleAddRoom = this.toggleAddRoomModal;
    toggleAddSurvey = this.toggleAddSurveyModal;
    togglePermissions = this.toggleRoomPermission;
    toggleProfileSetup = this.toggleSetupProfile;
    toggleRooms = this.toggleRoomsList;
    toggleInvites = this.toggleInvitesList;
    toggleInviteUserModal = this.toggleInviteUserModal;

    this.state = {
      drawerOpen: false,
      drawerOpenDelayed: false,
      currentSubMenuIndex: 0,
      onSettings: false,
      selectedParentMenu: "",
      viewingParentMenu: "",
      addRoomOpen: false,
      inviteUserOpen: false,
      addPollOpen: false,
      inviteQuestOpen: false,
      addSurveyOpen: false,
      addSurveyLabelOpen: false,
      addSurveyCatOpen: false,
      updateRoomPermissions: false,
      setupProfile: false,
      roomsList: false,
      invitesList: false,
      roomTitle: '',
      roomDesc: '',
      inviteTitle: '',
      inviteDesc: '',
      inviteTargetNumber: '',
      inviteRoomId: '',
      inviteExtra: '',
      pollId: 0,
      pollRoomId: 0,
      pollQuestion: '',
      pollOptions: [],
      inviteQuestRoomId: 0,
      inviteQuestTitle: '',
      inviteQuestDesc: '',
      inviteQuestSurveyId: 0,
      surveyTitle: '',
      surveyDetails: '',
      surveyLabel: 0,
      surveyCategory: 0,
      surveyLabels: [],
      surveyCategories: [],
      permissions: {
        canUploadFile: false,
        canRemoveFile: false,
        canAddRoom: false,
        canAddMessage: false,
        canRemoveMessage: false,
        canRemoveOwnMessage: false,
        canEditOwnMessage: false,
        canAddPoll: false,
        canRemovePoll: false,
        canInviteToRoom: false,
        canActInVideo: false,
        canPresent: false
      },
      firstName: '',
      lastName: '',
      rooms: [],
      invites: [],
      isOnline: 0
    };

    (async () => {
      if (await isReachable('https://kaspersoft.cloud')) {
        this.setState({isOnline: 2})
      } else {
        this.setState({isOnline: 1})
      }
    })()
  }

  setupProfile() {
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/auth/setup_profile", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        me.firstName = this.state.firstName;
        me.lastName = this.state.lastName;
        this.setState({setupProfile: false});
        reloadNavbar();
        reloadUsersList();
      });
  }

  addSurveyLabel() {
    const newItem = {
      name: this.state.surveyLabel
    };
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(newItem),
      redirect: 'follow'
    };
    fetch(serverRoot + "/survey/add_label", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.toggleAddSurveyLabelModal();
          }
        })
        .catch(error => console.log('error', error));
  }

  addSurveyCat() {
    const newItem = {
      name: this.state.surveyCategory
    };
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(newItem),
      redirect: 'follow'
    };
    fetch(serverRoot + "/survey/add_category", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.toggleAddSurveyCatModal();
          }
        })
        .catch(error => console.log('error', error));
  }

  toggleAddSurveyCatModal() {
    this.setState({
      surveyCategory: '',
      addSurveyCatOpen: !this.state.addSurveyCatOpen
    });
  }

  toggleRoomPermission() {
    if (!this.state.updateRoomPermissions) {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          roomId: roomId,
          targetUserId: targetUserId
        }),
        redirect: 'follow'
      };
      fetch(serverRoot + "/room/get_permissions", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.setState({
              permissions: result.permissions,
              updateRoomPermissions: !this.state.updateRoomPermissions
            })
          }
        })
        .catch(error => console.log('error', error));
      }
      else {
        this.setState({
          updateRoomPermissions: !this.state.updateRoomPermissions
        })
      }
  }

  fetchRooms = async (toggle) => {
    this.setState({roomsList: !this.state.roomsList});
    let address = serverRoot + '/room/get_spaces';
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    };
    fetch(address, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (toggle) {
            this.setState({rooms: result.spaces});
            (async () => {
              result.spaces.forEach(space => {
                roomsPreviewIntervals.push(setInterval(() => {
                  let newImage = document.getElementById('roomPreview' + space.id);
                  if (newImage !== null) {
                    newImage.src = serverRoot + '/shots/get_shot?room_id=' + space.id + '&random=' + new Date().getTime();
                  }
                }, 10000));
              })
            })()
          } else {
            this.setState({rooms: result.spaces});
          }
        })
        .catch(async error => {
          console.log('error', error)
        });
  };

  toggleRoomsList() {
    if (!this.state.roomsList) {
      this.fetchRooms(true);
    }
    else {
      roomsPreviewIntervals.forEach(interval => {
        clearInterval(interval);
      })
      roomsPreviewIntervals = [];
      this.setState({
        roomsList: !this.state.roomsList
      })
    }
  }

  fetchInvites = (toggle) => {
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/get_invites", requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (toggle) {
            this.setState({invites: result.invites, invitesList: !this.state.invitesList});
            this.forceUpdate();
          }
          else {
            this.setState({invites: result.invites});
            this.forceUpdate();
          }
          socket.off('user-invited');
          socket.on('user-invited', ({invite, user, room}) => {
            invite.User = user;
            invite.Room = room;
            this.state.invites.push(invite);
            this.setState({invites: this.state.invites});
            this.forceUpdate();
          });
        })
        .catch(error => {
          if (toggle) {
            this.setState({invites: [], invitesList: !this.state.invitesList});
            this.forceUpdate();
          }
          console.log('error', error)
        });
  }

  toggleInvitesList() {
    if (!this.state.invitesList) {
      this.fetchInvites(true);
    }
    else {
        this.setState({
          invitesList: !this.state.invitesList
        })
    }
  }

  toggleSetupProfile() {
    this.setState({
      firstName: me.firstName,
      lastName: me.lastName,
      setupProfile: !this.state.setupProfile
    })
  }

  toggleAddSurveyLabelModal() {
    this.setState({
      surveyLabel: '',
      addSurveyLabelOpen: !this.state.addSurveyLabelOpen
    });
  }

  toggleAddRoomModal() {
    this.setState({
      roomTitle: '',
      roomDesc: '',
      addRoomOpen: !this.state.addRoomOpen
    });
  }

  toggleInviteUserModal() {
    this.setState({
      inviteTitle: '',
      inviteDesc: '',
      invitePhone: '',
      inviteRoomId: 0,
      inviteExtra: 0,
      inviteUserOpen: !this.state.inviteUserOpen
    });
  }

  togglePoll() {
    this.setState({
      pollRoomId: 0,
      pollQuestion: '',
      pollOptions: [],
      addPollOpen: !this.state.addPollOpen
    });
  }

  toggleInviteQuestModal() {
    this.setState({
      inviteQuestRoomId: 0,
      inviteQuestTitle: '',
      inviteQuestDesc: '',
      inviteQuestSurveyId: 0,
      inviteQuestOpen: !this.state.inviteQuestOpen
    });
  }

  toggle() {
    if (!this.state.drawerOpen) {
      setTimeout(() => {
        this.setState({drawerOpenDelayed: !this.state.drawerOpenDelayed});        
      }, 550);
    } else {
      this.setState({drawerOpenDelayed: !this.state.drawerOpenDelayed});
    }
    this.setState({drawerOpen: !this.state.drawerOpen, currentSubMenuIndex: 0});
  }

  toggleDrawer = (open) => {

    this.setState({drawerOpen: open, currentSubMenuIndex: 0});
  };

  openSubMenu(e, selectedIndex) {
    e.preventDefault();
    this.setState({currentSubMenuIndex: selectedIndex});
  }

  addNewItem() {
    const newItem = {
      title: this.state.surveyTitle,
      details: this.state.surveyDetails,
      labelId: this.state.surveyLabel.value,
      categoryId: this.state.surveyCategory.value,
    };
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({survey: newItem}),
      redirect: 'follow'
    };
    fetch(serverRoot + "/survey/add_survey", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            if (reloadSurveysList !== undefined) {
              reloadSurveysList();
            }
            this.toggleAddSurveyModal();
          }
        })
        .catch(error => console.log('error', error));
  }

  toggleAddSurveyModal() {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/survey/get_labels", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.status === 'success') {
          this.setState({surveyLabels: result.labels});
        }
      })
      .catch(error => console.log('error', error));
    let requestOptions2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        redirect: 'follow'
    };
    fetch(serverRoot + "/survey/get_categories", requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.setState({surveyCategories: result.categories});
          }
        })
        .catch(error => console.log('error', error));
    this.setState({
      surveyTitle: '',
      surveyDetails: '',
      surveyCategory: '',
      surveyLabel: '',
      surveyStatus: '',
      addSurveyOpen: !this.state.addSurveyOpen
    });
  }

  render() {
    return (this.state.isOnline === 2 ? (<>
        <div className="float-sm-left">
            <Modal
                isOpen={this.state.addRoomOpen}
                toggle={this.toggleAddRoomModal}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <div
            style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.toggleAddRoomModal} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleAddRoomModal}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
              <p style={{color: colors.textIcons}}>افزودن روم جدید</p>
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>عنوان</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.roomTitle}
                    onChange={event => {
                      this.setState({roomTitle: event.target.value});
                    }}
                />
                <Label className="mt-4">
                  <p style={{color: colors.textIcons}}>توضیحات</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.roomDesc}
                    onChange={event => {
                      this.setState({roomDesc: event.target.value});
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    style={{background: 'transparent', border: '1px solid ' + colors.textIcons, color: colors.textIcons}}
                    outline
                    onClick={this.toggleAddRoomModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => {
                  let requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': token
                    },
                    body: JSON.stringify({
                      name: this.state.roomTitle,
                      details: this.state.roomDesc
                    }),
                    redirect: 'follow'
                  };
                  fetch(serverRoot + "/room/add_room", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.status === 'success') {
                          if (reloadRoomsList !== undefined) {
                            reloadRoomsList();
                          }
                          this.toggleAddRoomModal();
                        }
                      })
                      .catch(error => console.log('error', error));
                }}>
                  تایید
                </Button>
              </ModalFooter>
              </div>
            </Modal>
            <Modal
                isOpen={this.state.inviteUserOpen}
                toggle={this.toggleInviteUserModal}
                wrapClassName="modal-right"
                backdrop={true}
            ><div
            style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.toggleInviteUserModal} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleInviteUserModal}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
              <p style={{color: colors.textIcons}}>ارسال دعوتنامه ی جدید</p>
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}> عنوان</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.inviteTitle}
                    onChange={event => {
                      this.setState({inviteTitle: event.target.value});
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>توضیحات</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.inviteDesc}
                    onChange={event => {
                      this.setState({inviteDesc: event.target.value});
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>شماره ی تلفن هدف</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.inviteTargetNumber}
                    onChange={event => {
                      this.setState({inviteTargetNumber: event.target.value});
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>آی دی روم</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.inviteRoomId}
                    onChange={event => {
                      this.setState({inviteRoomId: event.target.value});
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>آی دی نظرسنجی</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.inviteExtra}
                    onChange={event => {
                      this.setState({inviteExtra: event.target.value});
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    style={{background: 'transparent', border: '1px solid ' + colors.textIcons, color: colors.textIcons}}
                    color="secondary"
                    outline
                    onClick={this.toggleInviteUserModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => {
                  let requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': token
                    },
                    body: JSON.stringify({
                      title: this.state.inviteTitle,
                      details: this.state.inviteDesc,
                      phone: this.state.inviteTargetNumber,
                      roomId: Number(this.state.inviteRoomId),
                      surveyId: Number(this.state.inviteExtra)
                    }),
                    redirect: 'follow'
                  };
                  fetch(serverRoot + "/room/invite_to_room", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.status === 'success') {
                          this.toggleInviteUserModal();
                        }
                      })
                      .catch(error => console.log('error', error));
                }}>
                  تایید
                </Button>
              </ModalFooter>
              </div>
            </Modal>
            <Modal
                isOpen={this.state.inviteQuestOpen}
                toggle={this.toggleInviteQuestModal}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <ModalHeader toggle={this.toggleInviteQuestModal}>
                ارسال پرسشنامه
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                  عنوان
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.inviteQuestTitle}
                    onChange={event => {
                      this.setState({inviteQuestTitle: event.target.value});
                    }}
                />
                <Label className="mt-4">
                  توضیحات
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.inviteQuestDesc}
                    onChange={event => {
                      this.setState({inviteQuestDesc: event.target.value});
                    }}
                />
                <Label className="mt-4">
                  آی دی نظرسنجی
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.inviteQuestExtra}
                    onChange={event => {
                      this.setState({inviteQuestExtra: event.target.value});
                    }}
                />
                <Label className="mt-4">
                  آی دی روم
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.inviteQuestRoomId}
                    onChange={event => {
                      this.setState({inviteQuestRoomId: event.target.value});
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    color="secondary"
                    outline
                    onClick={this.toggleInviteQuestModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => {
                  let requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': token
                    },
                    body: JSON.stringify({
                      title: this.state.inviteQuestTitle,
                      details: this.state.inviteQuestDesc,
                      roomId: Number(this.state.inviteQuestRoomId),
                      surveyId: Number(this.state.inviteQuestExtra)
                    }),
                    redirect: 'follow'
                  };
                  fetch(serverRoot + "/survey/assign_survey", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.status === 'success') {
                          this.toggleInviteQuestModal();
                        }
                      })
                      .catch(error => console.log('error', error));
                }}>
                  تایید
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
                isOpen={this.state.addPollOpen}
                toggle={this.togglePoll}
                wrapClassName="modal-right"
                backdrop={true}
                style={{zIndex: 999999}}
            >
              <div
            style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.togglePoll} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.togglePoll}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
              <p style={{color: colors.textIcons}}>افزودن رای گیری جدید</p>
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>آی دی روم</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.pollRoomId}
                    onChange={event => {
                      this.setState({pollRoomId: event.target.value});
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>متن سوال</p>
                </Label>
                <Input
                  type="text"
                  style={{background: 'transparent', color: colors.textIcons}}
                  defaultValue={this.state.pollQuestion}
                  onChange={event => {
                    this.setState({pollQuestion: event.target.value});
                  }}
                />
                {this.state.pollOptions.map((option, index) => {
                  return (
                      <>
                        <Label className="mt-4">
                        <p style={{color: colors.textIcons}}>گزینه ی {' ' + (index + 1)}</p>
                        </Label>
                        <div style={{display: 'flex'}}>
                          <Input
                              style={{width: 'calc(100% - 56px)', background: 'transparent', color: colors.textIcons}}
                              type="text"
                              defaultValue={this.state.pollOptions[index].caption}
                              onChange={event => {
                                let options = this.state.pollOptions;
                                options[index].caption = event.target.value;
                                this.setState({pollOptions: options});
                              }}
                          />
                          <IconButton
                              onClick={() => {
                                let options = this.state.pollOptions;
                                options.splice(index, 1);
                                this.setState({pollOptions: options});
                              }}>
                            <CloseIcon
                              style={{fill: colors.textIcons}}/>
                          </IconButton>
                        </div>
                      </>
                  );
                })}
                <Button style={{marginTop: 16}} onClick={() => {
                  let options = this.state.pollOptions;
                  options.push({id: options.length, caption: ''});
                  this.setState({pollOptions: options});
                }}
                style={{marginTop: 16, background: 'transparent', border: '1px solid ' + colors.textIcons, color: colors.textIcons}}>
                  افزودن گزینه
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button
                    color="secondary"
                    outline
                    onClick={this.togglePoll}
                    style={{background: 'transparent', border: '1px solid ' + colors.textIcons, color: colors.textIcons}}>
                  لغو
                </Button>
                <Button color="primary" onClick={() => {
                  let requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': token
                    },
                    body: JSON.stringify({
                      roomId: this.state.pollRoomId,
                      question: this.state.pollQuestion,
                      options: this.state.pollOptions.map(o => o.caption)
                    }),
                    redirect: 'follow'
                  };
                  fetch("../poll/add_poll", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.status === 'success') {
                          this.togglePoll();
                        }
                      })
                      .catch(error => console.log('error', error));
                }}>
                  تایید
                </Button>
              </ModalFooter>
              </div>
            </Modal>
            <Modal
                isOpen={this.state.addSurveyOpen}
                toggle={this.toggleAddSurveyModal}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <ModalHeader toggle={this.toggleAddSurveyModal}>
                ساخت آزمون جدید
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                  عنوان
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.surveyTitle}
                    onChange={event => {
                      this.setState({ surveyTitle: event.target.value });
                    }}
                />
                <Label className="mt-4">
                  توضیحات
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.surveyDetails}
                    onChange={event => {
                      this.setState({ surveyDetails: event.target.value });
                    }}
                />
                <Label className="mt-4">
                  دسته
                </Label>
                <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="form-field-name"
                    options={this.state.surveyCategories.map((x, i) => {
                      return { label: x.name, value: x.id, key: i };
                    })}
                    value={this.state.surveyCategory}
                    onChange={val => {
                      this.setState({ surveyCategory: val });
                    }}
                />
                <Label className="mt-4">
                  برچسب
                </Label>
                <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    name="form-field-name"
                    options={this.state.surveyLabels.map((x, i) => {
                      return {
                        label: x.name,
                        value: x.id,
                        key: i,
                        color: '#00f'
                      };
                    })}
                    value={this.state.surveyLabel}
                    onChange={val => {
                      this.setState({ surveyLabel: val });
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    color="secondary"
                    outline
                    onClick={this.toggleAddSurveyModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => this.addNewItem()}>
                  تایید
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
                isOpen={this.state.addSurveyLabelOpen}
                toggle={this.toggleAddSurveyLabelModal}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <ModalHeader toggle={this.toggleAddSurveyLabelModal}>
                افزودن برچسب نظرسنجی
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                  عنوان
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.surveyLabel}
                    onChange={event => {
                      this.setState({ surveyLabel: event.target.value });
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    color="secondary"
                    outline
                    onClick={this.toggleAddSurveyLabelModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => this.addSurveyLabel()}>
                  تایید
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
                isOpen={this.state.addSurveyCatOpen}
                toggle={this.toggleAddSurveyCatModal}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <ModalHeader toggle={this.toggleAddSurveyCatModal}>
                افزودن دسته ی نظرسنجی
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                  عنوان
                </Label>
                <Input
                    type="text"
                    defaultValue={this.state.surveyCategory}
                    onChange={event => {
                      this.setState({ surveyCategory: event.target.value });
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    color="secondary"
                    outline
                    onClick={this.toggleAddSurveyCatModal}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => this.addSurveyCat()}>
                  تایید
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
                isOpen={this.state.updateRoomPermissions}
                toggle={this.toggleRoomPermission}
                wrapClassName="modal-right"
                backdrop={true}
            >
            <div
          style={{backgroundColor: colors.primaryLight, width: '100%', height: 'auto', minHeight: '100vh'}}>
              <ModalHeader toggle={this.toggleRoomPermission} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleRoomPermission}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
              <p style={{color: colors.textIcons}}>تنظیم دسترسی ها</p>
              </ModalHeader>
              <ModalBody>
                {
                  ((() => {
                    let permissions = [];
                    for (let prop in this.state.permissions) {
                      if (prop.startsWith('can'))
                        permissions.push(prop);
                    }
                    return permissions;
                  })()).map(p => {
                    return (
                      <div style={{display: 'flex'}}>
                        <Label className="mt-4">
                        <p style={{color: colors.textIcons}}>{p}</p>
                        </Label>
                        <Switch
                          className="custom-switch custom-switch-primary"
                          checked={this.state.permissions[p]}
                          onChange={switchCheckedPrimary => {
                            let permissions = this.state.permissions;
                            permissions[p] = switchCheckedPrimary;
                            this.setState({ permissions: permissions });
                            let requestOptions = {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'token': token
                                },
                                body: JSON.stringify({
                                  roomId: roomId,
                                  targetUserId: targetUserId,
                                  permissions: this.state.permissions
                                }),
                                redirect: 'follow'
                            };
                            fetch(serverRoot + "/room/update_permissions", requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                  console.log(JSON.stringify(result));
                                })
                                .catch(error => console.log('error', error));
                          }}
                        />
                      </div>)
                  })
                }
              </ModalBody>
            </div>
            </Modal>
            <Modal
                isOpen={this.state.setupProfile}
                toggle={this.toggleSetupProfile}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <div
            style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              
              <ModalHeader toggle={this.toggleSetupProfile} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleSetupProfile}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
              <span><p style={{color: colors.textIcons}}>ویرایش پروفایل</p></span>
              </ModalHeader>
              <ModalBody>
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>نام</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.firstName}
                    onChange={event => {
                      this.setState({ firstName: event.target.value });
                    }}
                />
                <Label className="mt-4">
                <p style={{color: colors.textIcons}}>نام خانوادگی</p>
                </Label>
                <Input
                    type="text"
                    style={{background: 'transparent', color: colors.textIcons}}
                    defaultValue={this.state.lastName}
                    onChange={event => {
                      this.setState({ lastName: event.target.value });
                    }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    style={{background: 'transparent', border: '1px solid ' + colors.textIcons, color: colors.textIcons}}
                    outline
                    onClick={this.toggleSetupProfile}
                >
                  لغو
                </Button>
                <Button color="primary" onClick={() => this.setupProfile()}>
                  تایید
                </Button>
              </ModalFooter>
              </div>
            </Modal>
            
            <Modal
                isOpen={this.state.roomsList}
                toggle={this.toggleRoomsList}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <div
            style={{backgroundColor: colors.primaryLight, width: '100%', minHeight: '100vh', height: 'auto'}}>
              <ModalHeader toggle={this.toggleRoomsList} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleRoomsList}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
                <p style={{color: colors.textIcons}}>لیست روم ها</p>
              </ModalHeader>
              <ModalBody>
              <PerfectScrollbar
                      option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {this.state.rooms.map((room, index) => {
                      return (
                          <Link key={index} className="d-flex flex-row mb-3" style={{height: 175, position: 'relative', direction: 'rtl'}} onClick={this.toggleRoomsList} to={'/app/conf?room_id=' + room.mainRoomId}>
                            
                            <img id={'roomPreview' + room.id} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 175}} src={'../shots/get_shot?room_id=' + room.mainRoomId}></img>

                            <div className="pl-3 pt-2 pr-2 pb-2" style={{marginTop: 16, zIndex: 1000, backgroundColor: 'blue', position: 'absolute', bottom: -4, right: 4}}>
                              <div>
                                <p className="list-item-heading" style={{color: '#fff'}}>{room.name}</p>
                                <div className="pr-4">
                                  <p className="text-muted mb-1 text-small" style={{color: '#fff'}}>
                                    {room.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                      );
                    })}
                  </PerfectScrollbar>
                  {
                      config !== undefined && config !== null && config.canAddRoom ?
                        <Button color="primary" style={{color: colors.textIcons, border: '1px solid ' + colors.textIcons}} outline onClick={() => {toggleAddRoom(); this.toggleRoomsList()}}>
                          افزودن روم
                        </Button> :
                        null
                  }
              </ModalBody>
              </div>
            </Modal>
            <Modal
                isOpen={this.state.invitesList}
                toggle={this.toggleInvitesList}
                wrapClassName="modal-right"
                backdrop={true}
            >
              <div
                style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.toggleInvitesList} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleInvitesList}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
                <p style={{color: colors.textIcons}}>لیست دعوت ها</p>
              </ModalHeader>
              <ModalBody>
              <PerfectScrollbar
                      option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {this.state.invites.map((invite, index) => {
                      return (
                          <div key={index} className="d-flex flex-row mb-3" style={{direction: 'rtl', width: '100%'}}>
                            <div className="d-block position-relative">
                              <EmailIcon style={{width: 48, height: 48}}/>
                            </div>

                            <div className="pl-3 pt-2 pr-2 pb-2" style={{marginTop: 16}}>
                              <div>
                                <p className="list-item-heading">{invite.Room.name}</p>
                                <div style={{display: 'flex'}}>
                                  <Button outline color="secondary" className="mb-2" style={{fontSize: 14}} onClick={() => {
                                    let requestOptions = {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'token': token
                                      },
                                      body: JSON.stringify({
                                        inviteId: invite.id
                                      }),
                                      redirect: 'follow'
                                    };
                                    fetch("../room/accept_invite", requestOptions)
                                        .then(response => response.json())
                                        .then(result => {
                                          console.log(JSON.stringify(result));
                                          if (result.status === 'success') {
                                            this.fetchInvites();
                                          }
                                        })
                                        .catch(error => console.log('error', error));
                                  }}>
                                    پذیرش
                                  </Button>
                                  <span><pre>   </pre></span>
                                  <Button outline color="secondary" className="mb-2" style={{fontSize: 14}} onClick={() => {
                                    let requestOptions = {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'token': token
                                      },
                                      body: JSON.stringify({
                                        inviteId: invite.id
                                      }),
                                      redirect: 'follow'
                                    };
                                    fetch("../room/decline_invite", requestOptions)
                                        .then(response => response.json())
                                        .then(result => {
                                          console.log(JSON.stringify(result));
                                          if (result.status === 'success') {
                                            this.fetchInvites();
                                          }
                                        })
                                        .catch(error => console.log('error', error));
                                  }}>
                                    رد کرذن
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                      );
                    })}
                  </PerfectScrollbar>
              </ModalBody>
              </div>
            </Modal>
        </div>
        <div style={{top: 64, position: 'absolute', right: 0, transform: this.state.drawerOpen ? 'translateX(0)' : 'translateX(+100%)', transition: 'all .5s ease-in-out', zIndex: 20, height: '100vh'}}>
          <div style={{fontSize: 14, position: 'absolute', top: 0, right: 112, backgroundColor: colors.primaryLight, width: 256, height: '100vh', transform: this.state.currentSubMenuIndex > 0 ? 'translateX(0)' : 'translateX(384px)', transition: 'all .5s ease-in-out'}}>
              <div className="scroll">
                <PerfectScrollbar
                    style={{paddingTop: 16}}
                    option={{suppressScrollX: true, wheelPropagation: false}}
                >
                  <Nav
                      style={{direction: 'rtl', display: this.state.currentSubMenuIndex === 1 ? 'block' : 'none'}}
                      className={classnames({
                        "d-block": (this.state.currentSubMenuIndex === 1)
                      })}
                      data-parent="dashboards"
                  >
                    <NavItem>
                      <NavLink to="/app/home" onClick={this.toggle} style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                        خانه
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/app/conf" onClick={this.toggle} style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                        کنفرانس
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/app/survey" onClick={this.toggle} style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                        نظرسنجی و آزمون
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/app/inventions" onClick={this.toggle} style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                        اختراعات
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Nav
                      style={{direction: 'rtl', display: this.state.currentSubMenuIndex === 2 ? 'block' : 'none'}}
                      className={classnames({
                        "d-block": (this.state.currentSubMenuIndex === 2)
                      })}
                      data-parent="pages"
                  >
                    {
                      config !== undefined && config !== null && config.canAddRoom ? 
                        <NavItem>
                        <NavLink style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}
                          to={""} onClick={(e) => {
                          e.preventDefault();
                          this.toggleAddRoomModal();
                          this.toggle();
                        }}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                          درخواست ساخت روم
                        </NavLink>
                      </NavItem> :
                      null
                    }
                    {
                      config !== undefined && config !== null && config.canAddSurvey ?
                        <NavItem>
                        <NavLink style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}} 
                        to={""} onClick={(e) => {
                            e.preventDefault();
                            this.toggleAddSurveyModal();
                            this.toggle();
                          }}>
                          <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                            درخواست ساخت پرسشنامه
                          </NavLink>
                        </NavItem> :
                        null
                    }
                    {
                      config !== undefined && config !== null && config.canAddSurvey ?
                        <NavItem>
                        <NavLink style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}} 
                            to={""} onClick={(e) => {
                            e.preventDefault();
                            this.toggleInviteQuestModal();
                            this.toggle();
                          }}>
                          <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                            درخواست ارسال پرسشنامه
                          </NavLink>
                        </NavItem> :
                        null
                    }
                    {
                      config !== undefined && config !== null && config.canAddSurveyLabel ?
                      <NavItem>
                      <NavLink style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}
                          to={""} onClick={(e) => {
                          e.preventDefault();
                          this.toggleAddSurveyLabelModal();
                          this.toggle();
                        }}>
                        <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                          درخواست افزودن برچسب نظرسنجی
                        </NavLink>
                      </NavItem> :
                      null
                    }
                    {
                      config !== undefined && config !== null && config.canAddSurveyCat ?
                        <NavItem>
                        <NavLink style={{color: colors.thirdText, textDecoration: 'none'}} activeStyle={{color: colors.textIcons, textDecoration: 'none'}}
                            to={""} onClick={(e) => {
                            e.preventDefault();
                            this.toggleAddSurveyCatModal();
                            this.toggle();
                          }}>
                          <AppsIcon style={{marginLeft: 12, transform: 'translateY(+8px)'}}/>{" "}
                            درخواست افزودن دسته ی نظرسنجی
                          </NavLink>
                        </NavItem> :
                        null
                    }
                    
                  </Nav>
                </PerfectScrollbar>
              </div>
          </div>
          <div style={{fontSize: 14, backgroundColor: colors.primary, position: 'absolute', top: 0, width: 112, height: '100vh', boxShadow: colors.secondaryText, transform: this.state.drawerOpen ? 'translateX(0)' : 'translateX(132px)', transition: 'all .5s ease-in-out'}}>
              <div className="scroll">
                <PerfectScrollbar
                    style={{height: '100vh'}}
                    option={{suppressScrollX: true, wheelPropagation: false}}
                >
                  <div style={{direction: 'rtl', width: '100%'}}>
                    <div style={{position: 'relative', backgroundColor: this.state.currentSubMenuIndex === 1 ? colors.primaryLight : 'transparent', paddingTop: 32, paddingBottom: 32, paddingRight: 40}}>
                      <div style={{
                        display: (this.state.currentSubMenuIndex === 1) ? 'block' : 'none',
                        content: " ",
                        background: getColor(ThemeColor),
                        borderRadius: 10,
                        position: 'absolute',
                        width: 6,
                        height: 60,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: 16
                      }}/>
                      <NavLink
                          to="#"
                          style={{
                            color: this.state.currentSubMenuIndex === 1 ? getColor(ThemeColor) : (ThemeColor.startsWith('light') ? '#000' : '#fff')
                          }}
                          onClick={e => this.openSubMenu(e, 1)}
                      >
                        <AppsIcon style={{fill: colors.textIcons}}/>{" "}
                        <div style={{color: colors.textIcons}}>بخش ها</div>
                      </NavLink>
                    </div>
                    <div style={{position: 'relative', backgroundColor: this.state.currentSubMenuIndex === 2 ? colors.primaryLight : 'transparent', paddingTop: 32, paddingBottom: 32, paddingRight: 40}}>
                      <div style={{
                        display: (this.state.currentSubMenuIndex === 2) ? 'block' : 'none',
                        content: " ",
                        background: getColor(ThemeColor),
                        borderRadius: 10,
                        position: 'absolute',
                        width: 6,
                        height: 60,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: 16
                      }}/>
                      <NavLink
                          to="#"
                          style={{
                            color: this.state.currentSubMenuIndex === 2 ? getColor(ThemeColor) : (ThemeColor.startsWith('light') ? '#000' : '#fff')
                          }}
                          onClick={e => this.openSubMenu(e, 2)}
                      >
                      <AppsIcon style={{fill: colors.textIcons}}/>{" "}
                      <div style={{color: colors.textIcons}}>فرم ها</div>
                      </NavLink>
                    </div>
                    <div style={{position: 'relative', backgroundColor: (window.location.href.endsWith('/app/settings') && this.state.currentSubMenuIndex === 0) ? colors.primaryLight : 'transparent', paddingTop: 32, paddingBottom: 32, paddingRight: 40}}>
                      <div style={{
                        display: (window.location.href.endsWith('/app/settings') && this.state.currentSubMenuIndex === 0) ? 'block' : 'none',
                        content: " ",
                        background: getColor(ThemeColor),
                        borderRadius: 10,
                        position: 'absolute',
                        width: 6,
                        height: 60,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: 16
                      }}/>
                      <NavLink
                          to="#"
                          style={{
                            color: (window.location.href.endsWith('/app/settings') && this.state.currentSubMenuIndex === 0) ? colors.primaryLight : 'transparent'
                          }}
                          onClick={() => {gotoPage('/app/settings'); this.toggle();}}
                      >
                      <AppsIcon style={{fill: colors.textIcons}}/>{" "}
                      <div style={{color: colors.textIcons}}>تنظیمات</div>
                      </NavLink>
                    </div>
                  </div>
                </PerfectScrollbar>
              </div>
            </div>
        </div>
      </>) :
      this.state.isOnline === 1 ?
      <div className="float-sm-left">
        <Modal
                isOpen={this.state.roomsList}
                toggle={this.toggleRoomsList}
                wrapClassName="modal-right"
                backdrop={true}
            >
            <div
          style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.toggleRoomsList} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleRoomsList}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
                <p style={{color: colors.textIcons}}>لیست روم ها</p>
              </ModalHeader>
              <ModalBody>
              <PerfectScrollbar
                      option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {this.state.rooms.map((room, index) => {
                      return (
                          <Link key={index} className="d-flex flex-row mb-3" style={{height: 175, position: 'relative', direction: 'rtl'}} onClick={this.toggleRoomsList} to={'/app/conf?room_id=' + room.mainRoomId}>
                            
                            <img id={'roomPreview' + room.id} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 175}} src={'../shots/get_shot?room_id=' + room.mainRoomId}></img>

                            <div className="pl-3 pt-2 pr-2 pb-2" style={{marginTop: 16, zIndex: 1000, backgroundColor: 'blue', position: 'absolute', bottom: -4, right: 4}}>
                              <div>
                                <p className="list-item-heading" style={{color: '#fff'}}>{room.name}</p>
                                <div className="pr-4">
                                  <p className="text-muted mb-1 text-small" style={{color: '#fff'}}>
                                    {room.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                      );
                    })}
                  </PerfectScrollbar>
                  {
                      config !== undefined && config !== null && config.canAddRoom ?
                        <Button color="primary" style={{color: colors.textIcons, border: '1px solid ' + colors.textIcons}} outline onClick={() => {toggleAddRoom(); this.toggleRoomsList()}}>
                          افزودن روم
                        </Button> :
                        null
                  }
              </ModalBody>
              </div>
            </Modal>
        <Modal
                isOpen={this.state.invitesList}
                toggle={this.toggleInvitesList}
                wrapClassName="modal-right"
                backdrop={true}
            ><div
            style={{backgroundColor: colors.primaryLight, width: '100%', height: '100vh'}}>
              <ModalHeader toggle={this.toggleInvitesList} close={<Button style={{border: 'none', background: 'transparent'}} onClick={this.toggleInvitesList}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
                <p style={{color: colors.textIcons}}>لیست دعوت ها</p>
              </ModalHeader>
              <ModalBody>
              <PerfectScrollbar
                      option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {this.state.invites.map((invite, index) => {
                      return (
                          <div key={index} className="d-flex flex-row mb-3" style={{direction: 'rtl', width: '100%'}}>
                            <div className="d-block position-relative">
                              <EmailIcon style={{width: 48, height: 48}}/>
                            </div>

                            <div className="pl-3 pt-2 pr-2 pb-2" style={{marginTop: 16}}>
                              <div>
                                <p className="list-item-heading">{invite.Room.name}</p>
                                <div style={{display: 'flex'}}>
                                  <Button outline color="secondary" className="mb-2" style={{fontSize: 14}} onClick={() => {
                                    let requestOptions = {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'token': token
                                      },
                                      body: JSON.stringify({
                                        inviteId: invite.id
                                      }),
                                      redirect: 'follow'
                                    };
                                    fetch("../room/accept_invite", requestOptions)
                                        .then(response => response.json())
                                        .then(result => {
                                          console.log(JSON.stringify(result));
                                          if (result.status === 'success') {
                                            this.fetchInvites();
                                          }
                                        })
                                        .catch(error => console.log('error', error));
                                  }}>
                                    پذیرش
                                  </Button>
                                  <span><pre>   </pre></span>
                                  <Button outline color="secondary" className="mb-2" style={{fontSize: 14}} onClick={() => {
                                    let requestOptions = {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'token': token
                                      },
                                      body: JSON.stringify({
                                        inviteId: invite.id
                                      }),
                                      redirect: 'follow'
                                    };
                                    fetch("../room/decline_invite", requestOptions)
                                        .then(response => response.json())
                                        .then(result => {
                                          console.log(JSON.stringify(result));
                                          if (result.status === 'success') {
                                            this.fetchInvites();
                                          }
                                        })
                                        .catch(error => console.log('error', error));
                                  }}>
                                    رد کرذن
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                      );
                    })}
                  </PerfectScrollbar>
              </ModalBody>
              </div>
            </Modal>
      </div> :
      null);
  }
}

export default Sidebar;

