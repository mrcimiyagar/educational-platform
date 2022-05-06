import React, { Component } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";

export default function BlackColorTextField(props) {
  const styles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    cssLabel: {
      color: props.style.color,
      "&.Mui-focused": {
        color: props.style.color,
      },
    },
    cssOutlinedInput: {
      "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline":
        {
          borderColor: props.style.color,
        },
      "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
        borderColor: props.style.color,
      },
      "&$cssFocused $notchedOutline": {
        borderColor: props.style.color,
      },
    },
    notchedOutline: {},
    cssFocused: {},
    error: {},
    disabled: {},
  }));
  const classes = styles();
  return (
    <TextField
      className={classes.textField}
      onChange={props.onChange}
      label={props.label}
      variant={props.variant}
      InputLabelProps={{
        classes: {
          root: classes.cssLabel,
          focused: classes.cssFocused,
        },
      }}
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
        },
        inputMode: "numeric",
      }}
      style={props.style}
    />
  );
}
