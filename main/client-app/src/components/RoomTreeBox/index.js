
import React, {useEffect, useState} from "react";

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
import { Fab, Menu, MenuItem } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add'
import { gotoPage, gotoPageWithDelay } from "../../App";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PersonIcon from '@material-ui/icons/Person';

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

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      onContextMenu={props.onContextMenu}
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export let RoomTreeBox = (props) => {
  
  const classes = useStyles();

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

    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
      event.preventDefault()
      setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }
    
    return (<div style={{width: '100%', height: '100%', marginTop: 16}}>
      <div>
        <div style={{height: '100%'}}>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
              <TreeView
      className={classes.root}
      defaultExpanded={treeData.map(room => {
        return ('room-' + room.id)
      })}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
    >
      {
        treeData.map(room => {
          return (
            <StyledTreeItem nodeId={'room-' + room.id} labelText={room.title} labelIcon={AccountBalanceIcon} labelInfo={(room.children !== undefined && room.children.length > 0) ? room.children.length : undefined}>
              {
                room.children.map(user => {
                  return (
                    <StyledTreeItem
                      onContextMenu={handleClick}
                      nodeId={'user-' + user.id}
                      labelText={user.title}
                      labelIcon={PersonIcon}
                      color="#1a73e8"
                      bgColor="#e8f0fe"
                    />
                  )
                })
              }
            </StyledTreeItem>
          )
        })
      }
    </TreeView>


                <SortableTree style={{display: 'none'}} rowDirection={'rtl'} canNodeHaveChildren={node => {return node.head === true}} maxDepth={2}
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
          <Fab color={'secondary'} style={{position: 'fixed', left: 450 - 56 - 16, bottom: 24}}
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
