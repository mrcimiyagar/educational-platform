import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Settings from "@material-ui/icons/Settings";
import { Fab } from "@material-ui/core";
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorefrontIcon from '@mui/icons-material/Storefront';

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
});

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: "#333",
    "&$selected": {
      color: "#000",
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
});

export default function SpaceBottombar(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => props.setCurrentRoomNav(newValue)}
      showLabels
      className={classes.root}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        width: "calc(100% - 48px)",
        height: 72,
        borderRadius: 24,
        position: "fixed",
        bottom: props.fixed ? -104 : 16,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 350,
        transition: 'bottom .25s'
      }}
    >
      <BottomNavigationAction
        value={0}
        classes={classesAction}
        label="گفتگو ها"
        icon={<ForumIcon />}
      />
      <BottomNavigationAction
        value={1}
        classes={classesAction}
        label="فروشگاه"
        icon={<StorefrontIcon />}
        style={{ marginRight: -24 }}
      />
      <BottomNavigationAction
        value={2}
        classes={classesAction}
        label=""
        icon={
          <Fab color={"secondary"} style={{ marginTop: -56 }}>
            <ChatBubbleIcon style={{ fill: "#fff" }} />
          </Fab>
        }
        style={{ marginRight: -24 }}
      />
      <BottomNavigationAction
        value={3}
        classes={classesAction}
        label="بات ها"
        icon={<SmartToyIcon />}
        style={{ marginRight: -24 }}
      />
      <BottomNavigationAction
        value={4}
        classes={classesAction}
        label="تنظیمات"
        icon={<Settings />}
        style={{ marginRight: -24 }}
      />
    </BottomNavigation>
  );
}
