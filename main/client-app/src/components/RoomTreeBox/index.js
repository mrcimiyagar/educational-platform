
import React, {useEffect, useState} from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";

import {Avatar, Fab, IconButton} from "@material-ui/core";
import {colors, me, setToken, token} from "../../util/settings";
import {FetchMe, roomId, roothPath, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import {setPermissionState, togglePermissions} from '../../containers/Sidebar';
import { NotificationManager } from "../../components/ReactNotifications";

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

export let reloadUsersList = undefined;

let createNotification = (type, message, title) => {
  let cName = "";
  return () => {
    switch (type) {
      case "primary":
        NotificationManager.primary(
          "This is a notification!",
          "Primary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "secondary":
        NotificationManager.secondary(
          "This is a notification!",
          "Secondary Notification",
          3000,
          null,
          null,
          cName
        );
        break;
      case "info":
        NotificationManager.info("Info message", "", 3000, null, null, cName);
        break;
      case "success":
        NotificationManager.success(
          "Success message",
          "Title here",
          3000,
          null,
          null,
          cName
        );
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000,
          null,
          null,
          cName
        );
        break;
      case "error":
        NotificationManager.error(
          title,
          message,
          3000,
          null,
          null,
          cName
        );
        break;
      default:
        NotificationManager.info("Info message");
        break;
    }
  }
}

let lock = false

export let RoomTreeBox = (props) => {
    let forceUpdate = useForceUpdate();
    let [treeData, setTreeData] = React.useState([]);
    const search = useLocation().search
    let processUsers = (rooms) => {
      rooms.forEach(room => {
        room.expanded = true
        room.title = room.name
        room.head = true
        room.users.forEach(user => {
          user.title = user.firstName
        })
        room.children = room.users
      })
      setTreeData(rooms)
    }
    reloadUsersList = () => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          spaceId: props.room.spaceId,
          roomId: props.room.id
        }),
        redirect: 'follow'
      };
      fetch(serverRoot + "/room/get_room_users", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result))
            processUsers(result.rooms)
          })
          .catch(error => console.log('error', error));
    }
    useEffect(() => {
          reloadUsersList();
          socket.off('user-entered');
          socket.on('user-entered', ({rooms}) => {
            processUsers(rooms)
          });
          socket.off('user-exited');
          socket.on('user-exited', ({rooms}) => {
            processUsers(rooms)
          });
          socket.off('profile_updated');
          socket.on('profile_updated', user => {
            
          });
    }, []);
    return (<div style={{width: '100%', height: 'calc(100% - 64px)', marginTop: 16}}>
      <div>
        <div>
          <span style={{fontSize: 20}}><p style={{color: colors.textIcons}}>ساختار روم</p></span>
          <Button outline className="mb-2" style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 4, paddingRight: 4, 
            color: colors.textIcons, border: '1px solid ' + colors.textIcons, textAlign: 'center', width: 70, fontSize: 12, marginTop: -72, marginRight: 'calc(100% - 70px)'}}
            onClick={() => {
              let roomTitle = prompt('نام روم را وارد نمایید')
              if (roomTitle === null || roomTitle === '') {
                return;
              }
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'token': token
                },
                body: JSON.stringify({
                  name: roomTitle,
                  details: '',
                  spaceId: props.room.spaceId
                }),
                redirect: 'follow'
              };
              fetch(serverRoot + "/room/add_room", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    console.log(JSON.stringify(result));
                    if (result.status === 'success') {
                      reloadUsersList()
                    }
                  })
                  .catch(error => console.log('error', error));
            }}>
            افزودن گروه
          </Button>
        </div>
        <div style={{height: '100%'}}>
          <PerfectScrollbar
              option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div style={{height: 'auto', padding: 8}}>
              <div style={{ height: '100vh' }}>
                <SortableTree rowDirection={'rtl'} canNodeHaveChildren={node => {return node.head === true}} maxDepth={2}
                  generateNodeProps={rowInfo => ({
                    onClick: () => {
                      if (rowInfo.node.head === true) {
                        let requestOptions = {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'token': token
                          },
                          body: JSON.stringify({
                            roomId: rowInfo.node.id
                          }),
                          redirect: 'follow'
                        };
                        fetch(serverRoot + "/room/is_room_accessible", requestOptions)
                          .then(response => response.json())
                          .then(result => {
                            console.log(JSON.stringify(result));
                            if (result.status === 'success') {
                              if (result.isAccessible === true) {
                                let path = '/app/conf?room_id=' + rowInfo.node.id
                                let isGuest = new URLSearchParams(search).get('is_guest')
                                if (isGuest !== null) path += '&is_guest=true'
                                let guestToken = new URLSearchParams(search).get('guest_token')
                                if (guestToken !== null) path += '&guest_token=' + guestToken
                                window.location.href = path
                              }
                              else {
                                createNotification("error", "عدم دسترسی", "دسترسی به منبع مورد نظر مجاز نمی باشد")();
                              }
                            }
                            else {
                              createNotification("error", "عدم دسترسی", "دسترسی به منبع مورد نظر مجاز نمی باشد")();
                            }
                          })
                          .catch(error => console.log('error', error));
                      }
                      else {
                        let requestOptions = {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'token': token
                          },
                          body: JSON.stringify({
                            roomId: props.roomId,
                            targetUserId: rowInfo.node.id
                          }),
                          redirect: 'follow'
                        };
                        fetch(serverRoot + "/room/is_permissions_accessible", requestOptions)
                          .then(response => response.json())
                          .then(result => {
                            console.log(JSON.stringify(result));
                            if (result.status === 'success') {
                              if (result.isAccessible) {
                                setPermissionState(props.roomId, rowInfo.node.id);
                                togglePermissions();
                              }
                              else {
                                createNotification("error", "عدم دسترسی", "دسترسی به منبع مورد نظر مجاز نمی باشد")();
                              }
                            }
                          })
                          .catch(error => console.log('error', error));
                      }
                    }
                  })}
                  onMoveNode={({td, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex}) => {
                    if (node.head !== true && nextParentNode.head === true) {
                      let requestOptions = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'token': token
                        },
                        body: JSON.stringify({
                          spaceId: props.room.spaceId,
                          userId: node.id,
                          toRoomId: nextParentNode.id
                        }),
                        redirect: 'follow'
                      };
                      fetch(serverRoot + "/room/move_user", requestOptions)
                          .then(response => response.json())
                          .then(result => {
                            console.log(JSON.stringify(result));
                            reloadUsersList()
                          })
                          .catch(error => console.log('error', error));
                      }
                      else {
                        reloadUsersList()
                      }
                  }}
                  onChange={td => {
                    reloadUsersList()
                  }} treeData={treeData}/>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>);
}
