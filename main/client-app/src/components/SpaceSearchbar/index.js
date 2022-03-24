import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TravelExplore from "@mui/icons-material/TravelExplore";
import { colors } from "../../util/settings";
import { makeStyles } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

export default function SpaceSearchbar(props) {
  let useStyles = makeStyles((theme) => ({
    InputBaseStyle: {
      "&::placeholder": {
        color: colors.text,
        textAlign: 'center'
      }
    }
  }));
  let classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 16,
        marginLeft: props.fixed ? 56 : 32,
        marginRight: props.fixed ? 56 : 32,
        width: props.fixed ? "calc(100% - 112px)" : "calc(100% - 64px)",
        borderRadius: 24,
        background: colors.field,
        height: props.fixed ? 24 : 40,
        transition:
          "width .25s, height .25s, margin-left .25s, margin-right .25s",
      }}
    >
      <IconButton
        sx={{ p: "10px" }}
        aria-label="menu"
        style={{
          marginRight: 16,
          opacity: props.fixed ? 0 : 1,
          transition: "opacity .25s",
        }}
        onClick={props.onMenuClicked}
      >
        {props.backable === true ? <ArrowForward style={{ fill: colors.text }} /> : <MenuIcon style={{ fill: colors.text }} />}
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="جستجو در فضا"
        classes={{
          input: classes.InputBaseStyle
        }}
        style={{ color: colors.text, marginRight: 8, textAlign: 'center' }}
      />
      <IconButton
        sx={{ p: "10px" }}
        aria-label="search"
        style={{
          fill: "#fff",
          marginLeft: 8,
          opacity: props.fixed ? 0 : 1,
          transition: "opacity .25s",
        }}
      >
        <SearchIcon style={{ fill: colors.text }} />
      </IconButton>
      <Divider
        sx={{ height: 28, m: 0.5 }}
        orientation="vertical"
        style={{
          backgroundColor: colors.text,
          opacity: props.fixed ? 0 : 1,
          transition: "opacity .25s",
          marginLeft: 8
        }}
      />
      <IconButton
        sx={{ p: "10px" }}
        aria-label="directions"
        style={{
          fill: colors.text,
          opacity: props.fixed ? 0 : 1,
          transition: "opacity .25s",
          marginLeft: 8
        }}
        onClick={() => props.onSpacesClicked()}
      >
        <TravelExplore style={{fill: colors.accent}} />
      </IconButton>
    </div>
  );
}
