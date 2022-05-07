import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ArrowForward from "@material-ui/icons/ArrowForward";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect } from "react";
import { query } from "../../App";
import { colors } from "../../util/settings";

export default function SearchEngineResultsSearchbar(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "calc(100% - 32px)",
      height: 48,
      direction: "rtl",
      backdropFilter: "blur(10px)",
      borderRadius: 24,
      marginLeft: 16,
      marginRight: 16,
      backgroundColor: colors.field,
      color: colors.text
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  let useStylesInput = makeStyles((theme) => ({
    InputBaseStyle: {
      "&::placeholder": {
        color: colors.text,
        textAlign: 'center'
      }
    }
  }));
  const classes = useStyles();
  const classesInput = useStylesInput();

  useEffect(() => {
    let globalSearchInput = document.getElementById("globalSearchInput");
    globalSearchInput.value = query;
  }, []);

  return (
    <Paper className={classes.root}>
      <IconButton
        onClick={() => props.handleClose()}
        className={classes.iconButton}
      >
        <ArrowForward style={{fill: colors.icon}} />
      </IconButton>
      <InputBase
        id={"globalSearchInput"}
        className={classes.input}
        placeholder="جستجو در آسمان"
        onChange={(e) => {
          props.onQueryChange(e.target.value);
        }}
        classes={{
          input: classesInput.InputBaseStyle
        }}
        style={{ color: colors.text, marginRight: 8, textAlign: 'center' }}
      />
      <IconButton className={classes.iconButton}>
        <SearchIcon style={{fill: colors.icon}} />
      </IconButton>
    </Paper>
  );
}
