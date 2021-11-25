import React, { Component } from "react";
import {Drawer, Switch} from "@material-ui/core";

import {colors, me, token} from "../util/settings";
import {Fab, FormControlLabel, FormGroup, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

import { serverRoot } from "../util/Utils";

export let togglePermissions = undefined;

let targetUserId;
let roomId;

export let setPermissionState = (rId, tUserId) => {
  targetUserId = tUserId;
  roomId = rId;
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.toggleRoomPermission = this.toggleRoomPermission.bind(this);

    togglePermissions = this.toggleRoomPermission;

    this.state = {
      updateRoomPermissions: false,
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
      }
    };
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

  render() {
    return (
      <Drawer
          open={this.state.updateRoomPermissions}
          onClose={this.toggleRoomPermission}
          anchor={'right'}
      >
        <div
          style={{backgroundColor: '#fff', width: 320, height: 'auto', minHeight: '100vh', direction: 'rtl'}}>
              <div style={{display: 'flex'}}>
                <p style={{color: '#333'}}>تنظیم دسترسی ها</p>
                <IconButton onClick={this.toggleRoomPermission}>
                  <CloseIcon style={{fill: '#333'}}/>
                </IconButton>
              </div>
              <div>
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
                        <FormGroup>
                          <FormControlLabel control={
                            <Switch checked={this.state.permissions[p]}
                              onChange={e => {
                                this.setState({ permissions: { ...this.state.permissions, [p]: e.target.checked } }, () => {
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
                                });
                            }}/>} label={p} />
                        </FormGroup>
                      </div>)
                  })
                }
              </div>
        </div>
      </Drawer>
    );
  }
}

export default Sidebar;