
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  isDesktop,
  isTablet,
} from "../../App";
import SettingsList from "../SettingsList";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    maxWidth: "100%",
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
      <SettingsList onClose={props.onClose} onDeveloperModeClicked={props.onDeveloperModeClicked} />
    </div>
  );
}
