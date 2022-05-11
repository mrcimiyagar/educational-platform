import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TravelExplore from "@mui/icons-material/TravelExplore";
import { colors } from "../../util/settings";
import { makeStyles, Paper } from "@material-ui/core";
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
    <Paper
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 16,
        marginLeft: 32,
        marginRight: 32,
        width: "calc(100% - 64px)",
        borderRadius: 24,
        background: colors.field,
        backdropFilter: 'blur(10px)',
        height: 48,
        transform: props.fixed ? 'translateY(-300px)' : 'translateY(+16px)',
        transition:
          "transform .5s",
      }}
    >
      <IconButton
        sx={{ p: "10px" }}
        aria-label="menu"
        style={{
          marginRight: 16,
        }}
        onClick={props.onMenuClicked}
      >
        <MenuIcon style={{ fill: colors.text }} />
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
        }}
      >
        <SearchIcon style={{ fill: colors.text }} />
      </IconButton>
      <IconButton
        sx={{ p: "10px" }}
        aria-label="directions"
        style={{
          fill: colors.text,
          marginLeft: 8
        }}
        onClick={() => props.onSpacesClicked()}
      >
        <TravelExplore style={{fill: colors.accent}} />
      </IconButton>
    </Paper>
  );
}
