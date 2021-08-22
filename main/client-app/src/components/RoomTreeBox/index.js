
import React, {useEffect, useState} from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";

import {colors, token} from "../../util/settings";
import {ConnectToIo, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import { NotificationManager } from "../../components/ReactNotifications";

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import { gotoPage, gotoPageWithDelay } from "../../App";

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
    ConnectToIo()
    let forceUpdate = useForceUpdate();
    let [treeData, setTreeData] = React.useState([]);
    let processUsers = (rooms) => {
      rooms.forEach(room => {
        room.expanded = true
        room.title = room.title
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
    useEffect(() => {
      if (props.room.id !== undefined) {
        reloadUsersList()
      }
    }, [props.room])
    return (<div style={{width: '100%', height: 'calc(100% - 64px)', marginTop: 16}}>
      <div>
        <div style={{height: '100%'}}>
              <div style={{ height: 'calc(100vh - 64px)'}}>
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
                                window.location.href = '/app/room?room_id=' + rowInfo.node.id
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
                            roomId: props.room.id,
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
      </div>
          <Fab style={{position: 'fixed', left: 16, bottom: 24}}
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
                  title: roomTitle,
                  details: '',
                  spaceId: props.room.spaceId
                }),
                redirect: 'follow'
              };
              fetch(serverRoot + "/room/create_room", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    console.log(JSON.stringify(result));
                    if (result.status === 'success') {
                      reloadUsersList()
                    }
                  })
                  .catch(error => console.log('error', error));
            }}>
              <AddIcon/>
          </Fab>
    </div>);
}
