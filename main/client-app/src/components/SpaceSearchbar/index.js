import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TravelExplore from "@mui/icons-material/TravelExplore";

export default function SpaceSearchbar(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: props.fixed ? 32 : 8,
        marginRight: props.fixed ? 32 : 8,
        width: props.fixed ? "calc(100% - 64px)" : "calc(100% - 16px)",
        borderRadius: 24,
        background: "rgba(255, 255, 255, 0.75)",
        height: props.fixed ? 24 : 56,
        transition: 'width .25s, height .25s, margin-left .25s, margin-right .25s'
      }}
    >
      <IconButton
        sx={{ p: "10px" }}
        aria-label="menu"
        style={{ marginRight: 8, opacity: props.fixed ? 0 : 1, transition: 'opacity .25s' }}
      >
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="جستجو در فضا"
        inputProps={{ "aria-label": "search spaces map" }}
        
      />
      <IconButton
        sx={{ p: "10px" }}
        aria-label="search"
        style={{ marginRight: -16, opacity: props.fixed ? 0 : 1, transition: 'opacity .25s' }}
      >
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" style={{opacity: props.fixed ? 0 : 1, transition: 'opacity .25s'}} />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions" style={{opacity: props.fixed ? 0 : 1, transition: 'opacity .25s'}}>
        <TravelExplore />
      </IconButton>
    </div>
  );
}
