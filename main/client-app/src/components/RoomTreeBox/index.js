import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Settings } from "@material-ui/icons";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import PersonIcon from "@material-ui/icons/Person";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import { Add } from "@mui/icons-material";
import { Fab, IconButton } from "@mui/material";
import "chartjs-plugin-datalabels";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import "react-table/react-table.css";
import { addTab, isDesktop, setInTheGame } from "../../App";
import { NotificationManager } from "../../components/ReactNotifications";
import { colors, me, token } from "../../util/settings";
import {
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";

export let reloadRoomsList = undefined;

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
      {
        backgroundColor: "transparent",
      },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    actionIcon: ActionIcon,
    action,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      onContextMenu={props.onContextMenu}
      label={
        <div className={classes.labelRoot}>
          <LabelIcon
            color="inherit"
            className={classes.labelIcon}
            style={{ color: colors.icon }}
          />
          <Typography
            variant="body2"
            className={classes.labelText}
            style={{ color: colors.text }}
          >
            {labelText}
          </Typography>
          <Typography
            variant="caption"
            color="inherit"
            style={{ color: colors.text }}
          >
            {labelInfo}
          </Typography>
          <IconButton onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            action();
          }}>
          <ActionIcon
            color="inherit"
            className={classes.labelIcon}
            style={{ color: colors.icon }}
          />
          </IconButton>
        </div>
      }
      style={{
        "--tree-view-color": colors.field,
        "--tree-view-bg-color": colors.field,
        color: colors.field,
        widthL: 'calc(100% - 16px)',
        marginLeft: 16
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

let selectedRoomId = 0;

function ConfirmationDialogRaw(props) {
  const { onClose, open, ...other } = props;
  const radioGroupRef = React.useRef(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    
    
  };

  const handleChange = (event) => {
    props.setValue(event.target.value);
  };

  return (
    <Dialog
      maxWidth="xs"
      onEntering={handleEntering}
      fullScreen={props.fullscreen}
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">انتقال کاربر</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={props.value}
          onChange={handleChange}
        >
          {props.rooms.map((room) => (
            <FormControlLabel
              value={room.id}
              key={"room-" + room.id}
              control={<Radio />}
              label={room.title}
              onClick={() => {
                selectedRoomId = room.id;
              }}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          لغو
        </Button>
        <Button onClick={handleOk} color="primary">
          انتقال
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: "auto",
    flexGrow: 1,
    maxWidth: 400,
  },
});

let selectedUserId = 0;

export let RoomTreeBox = (props) => {
  const classes = useStyles();

  let [treeData, setTreeData] = React.useState([]);
  const [isMine, setIsMine] = React.useState(false);
  let processUsers = (rooms) => {
    rooms.forEach((room) => {
      room.expanded = true;
      room.title = room.title;
      room.head = true;
      room.users.forEach((user) => {
        user.title = user.firstName;
      });
      room.children = room.users;
    });
    setTreeData(rooms);
  };
  let fetchSpaceRoomList = () => {
    if (props.room !== undefined) {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          spaceId: props.room.spaceId,
          roomId: props.room.id,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/room/get_room_users", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          processUsers(result.rooms);
        })
        .catch((error) => console.log("error", error));
    } else {
      setTimeout(() => {
        fetchSpaceRoomList();
      }, 500);
    }
  };
  reloadRoomsList = () => {
    fetchSpaceRoomList();
  };

  unregisterEvent("user-entered");
  registerEvent("user-entered", ({ rooms }) => {
    processUsers(rooms);
  });
  unregisterEvent("user-exited");
  registerEvent("user-exited", ({ rooms }) => {
    processUsers(rooms);
  });
  unregisterEvent("profile_updated");
  registerEvent("profile_updated", (user) => {});

  useEffect(() => {
    if (props.room !== undefined && props.room.id !== undefined) {
      reloadRoomsList();
    }
  }, [props.room]);

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        spaceId: props.room.spaceId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/room/is_space_mine", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setIsMine(result.isMine);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleCloseOfDialog = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  const sendUserToRoom = () => {
    for (let i = 0; i < treeData.length; i++) {
      let children = treeData[i].children;
      let found = false;
      for (let j = 0; j < children.length; j++) {
        if (children[j].id === selectedUserId) {
          setValue(treeData[i].id);
          handleClickListItem();
          found = true;
          break;
        }
      }
      if (found) break;
    }
  };

  const editAccess = () => {};

  return (
    <div
      style={{ width: "100%", height: "auto", marginTop: 16, direction: "rtl" }}
    >
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper,
        }}
        spaceId={props.room !== undefined ? props.room.spaceId : 0}
        rooms={treeData}
        keepMounted
        open={open}
        onClose={handleCloseOfDialog}
        value={value}
        setValue={setValue}
        fullscreen={!isDesktop()}
      />

      <div>
        <div style={{ height: "auto" }}>
          <p style={{ color: colors.text, width: 'calc(100% - 16px)', marginTop: 32, textAlign: 'right', marginRight: 24 }}>
            {`اتاق ها (${treeData.length})`}
          </p>
          <TreeView
            className={classes.root}
            defaultExpanded={treeData.map((room) => {
              return "room-" + room.id;
            })}
            defaultEndIcon={<div style={{ width: 24 }} />}
            style={{ marginTop: -24 }}
          >
            {treeData.map((room) => {
              return (
                <StyledTreeItem
                  nodeId={"room-" + room.id}
                  labelText={room.title}
                  labelIcon={AccountBalanceIcon}
                  actionIcon={Settings}
                  action={() => props.openEditRoom(room.id)}
                  labelInfo={
                    room.children !== undefined && room.children.length > 0
                      ? room.children.length
                      : undefined
                  }
                  onClick={(e) => {
                    let requestOptions = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        token: token,
                      },
                      body: JSON.stringify({
                        roomId: room.id
                      }),
                      redirect: "follow",
                    };
                    fetch(serverRoot + "/room/check_room_access", requestOptions)
                      .then((response) => response.json())
                      .then((result) => {
                        console.log(JSON.stringify(result));
                        if (result.canAccess === true) {
                          setInTheGame(false);
                          setTimeout(() => {
                            addTab(room.id);
                          }, 500);
                        }
                      })
                      .catch((error) => console.log("error", error));
                  }}
                >
                </StyledTreeItem>
              );
            })}
            <div style={{ width: "100%", height: 56 }} />
          </TreeView>
        </div>
      </div>
      {isMine ?
        (
          <Fab style={{backgroundColor: colors.accent, position: 'fixed', left: 16, bottom: 16}} onClick={() => {
            props.addRoomClicked();
          }}>
            <Add />
          </Fab>
        ) : null 
      }
    </div>
  );
};
