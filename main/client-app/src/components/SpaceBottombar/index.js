import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Settings from "@material-ui/icons/Settings";
import { Badge, Fab } from "@material-ui/core";
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {colors} from '../../util/settings';
import { inTheGame } from "../../App";

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
});

export default function SpaceBottombar(props) {
  let useStylesAction = makeStyles({
    /* Styles applied to the root element. */
    root: {
      color: colors.textPassive,
      "&$selected": {
        color: colors.text,
      },
    },
    /* Styles applied to the root element if selected. */
    selected: {},
  });
  
  const classes = useStyles();
  const classesAction = useStylesAction();

  return (
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => props.setCurrentRoomNav(newValue)}
      showLabels
      className={classes.root}
      style={{
        backgroundColor: colors.primaryMedium,
        backdropFilter: "blur(10px)",
        width: "calc(100% - 48px)",
        height: 72,
        borderRadius: 24,
        position: "fixed",
        bottom: (props.fixed || !inTheGame) ? -104 : 16,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 350,
        transition: 'bottom .5s'
      }}
    >
      <BottomNavigationAction
        value={0}
        classes={classesAction}
        label="گفتگو ها"
        icon={<Badge color="secondary" badgeContent={10}><ForumIcon /></Badge>}
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
            <Badge color="primary" badgeContent={10}>
              <ChatBubbleIcon style={{ fill: "#fff" }} />
            </Badge>
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
