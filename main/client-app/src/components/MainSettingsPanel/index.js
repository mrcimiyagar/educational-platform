
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  isDesktop,
  isInRoom,
  isTablet,
} from "../../App";
import SettingsList from "../SettingsList";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: isDesktop() && isInRoom() ? 256 + 32 + 32 + 8 + 64 : undefined,
    width: isDesktop() && isInRoom() ? 450 : "100%",
    maxWidth: isDesktop() && isInRoom() ? 450 : "100%",
    height: "100%",
  },
  indicator: {
    backgroundColor: "#fff",
  },
  tab: {
    minWidth: isDesktop() || isTablet() ? 100 : undefined,
    maxWidth: isDesktop() || isTablet() ? 100 : undefined,
    width: isDesktop() || isTablet() ? 100 : undefined,
    color: "#fff",
  },
}));

export default function MainSettingsPanel(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SettingsList onClose={props.onClose} />
    </div>
  );
}
