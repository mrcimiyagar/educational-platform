import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Settings from "@material-ui/icons/Settings";
import { Badge, Fab, Paper } from "@material-ui/core";
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
      color: colors.oposText,
      "&$selected": {
        color: colors.oposText,
      },
    },
    /* Styles applied to the root element if selected. */
    selected: {},
  });
  
  const classes = useStyles();
  const classesAction = useStylesAction();

  return (
    <Paper
    style={{
      backgroundColor: colors.primaryMedium,
      backdropFilter: "blur(10px)",
      width: "calc(100% - 48px)",
      height: 64,
      borderRadius: 32,
      position: "fixed",
      bottom: (props.fixed || !inTheGame) ? -104 : 16,
      left: "50%",
      transform: "translateX(-50%)",
      maxWidth: 350,
      transition: 'bottom .5s'
    }}>
    <BottomNavigation
      value={props.currentRoomNav}
      onChange={(event, newValue) => props.setCurrentRoomNav(newValue)}
      showLabels
      className={classes.root}
      style={{
        backgroundColor: 'transparent',
        width: "100%",
        height: '100%'
      }}
    >
      <BottomNavigationAction
        value={0}
        classes={classesAction}
        label="گفتگو ها"
        icon={<Badge color="secondary" badgeContent={10}><ForumIcon style={{fill: colors.oposText}}/></Badge>}
        style={{color: colors.oposText}}
      />
      <BottomNavigationAction
        value={1}
        classes={classesAction}
        label="فروشگاه"
        icon={<StorefrontIcon style={{fill: colors.oposText}} />}
        style={{ marginRight: -24, color: colors.oposText }}
      />
      <BottomNavigationAction
        value={2}
        classes={classesAction}
        label=""
        icon={
          <Fab style={{ marginTop: -56, backgroundColor: colors.accent }}>
            <Badge color="secondary" badgeContent={10}>
              <ChatBubbleIcon />
            </Badge>
          </Fab>
        }
        style={{ marginRight: -24, color: colors.oposText }}
      />
      <BottomNavigationAction
        value={3}
        classes={classesAction}
        label="بات ها"
        icon={<SmartToyIcon style={{fill: colors.oposText}} />}
        style={{ marginRight: -24, color: colors.oposText }}
      />
      <BottomNavigationAction
        value={4}
        classes={classesAction}
        label="تنظیمات"
        icon={<Settings style={{fill: colors.oposText}} />}
        style={{ marginRight: -24, color: colors.oposText }}
      />
    </BottomNavigation>
    </Paper>
  );
}
