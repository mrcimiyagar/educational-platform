import { Avatar, Dialog, Fab } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CloudIcon from "@material-ui/icons/Cloud";
import LanguageIcon from "@material-ui/icons/Language";
import React from "react";
import { gotoPage } from "../../App";
import SearchEngineSearchbar from "../../components/SearchEngineSearchbar";
import SpaceWallpaperLight from "../../images/space-wallpaper-light.jpg";
import SpaceWallpaperDark from "../../images/space-wallpaper-dark.png";
import SearchEngineIcon from "../../images/logo.png";
import { colors, themeMode } from "../../util/settings";
import SearchEngineResults from "./searchEngineResults";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function SearchEngine(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      alignItems: "center",
      direction: "rtl",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      fontFamily: "mainFont",
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const [open, setOpen] = React.useState(true);
  const [showResults, setShowResults] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      props.onClose();
    }, 250);
  };
  let classes = useStyles();
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: "blur(10px)",
        },
      }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
        }}
        src={themeMode === 'light' ? SpaceWallpaperLight : SpaceWallpaperDark}
        alt={"Search Wallpaper"}
      />
      <div className={classes.root}>
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <div
            style={{
              width: 112,
              height: 112,
              position: "absolute",
              left: "50%",
              top: 184,
              transform: "translateX(-50%)",
            }}
          >
            <Avatar
              src={SearchEngineIcon}
              style={{ width: 112, height: 112 }}
            />
          </div>
          <div
            style={{
              width: "100%",
              height: 56,
              position: "absolute",
              left: "50%",
              top: 416 - 56,
              transform: "translateX(-50%)",
              direction: "rtl",
            }}
          >
            <SearchEngineSearchbar onBackClicked={handleClose} />
          </div>
          <div
            style={{
              width: "100%",
              position: "absolute",
              top: 496 - 76,
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Fab
              style={{ backgroundColor: colors.accent }}
              variant={"extended"}
              onClick={() => setShowResults(true)}
            >
              <CloudIcon />
              <div style={{ marginRight: 16 }}>جستجو در ابر</div>
            </Fab>
            <Fab
              variant={"extended"}
              style={{ backgroundColor: colors.accent2, marginRight: 16 }}
            >
              <LanguageIcon style={{fill: '#fff'}} />
              <div style={{ marginRight: 16, color: '#fff' }}>گشت و گذار</div>
            </Fab>
          </div>
        </div>
        {showResults ? <SearchEngineResults onClose={() => setShowResults(false)} onUserSelected={props.onUserSelected}/> : null}
      </div>
    </Dialog>
  );
}
