import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { colors } from "../../util/settings";

function WhiteColorTextField(props) {
  const styles = (theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: 16,
      marginRight: 16,
      color: colors.text,
    },
    cssLabel: {
      color: "#fff",
      "&.Mui-focused": {
        color: colors.text,
      },
    },
    cssOutlinedInput: {
      "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline":
        {
          borderColor: colors.text,
        },
      "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
        borderColor: colors.text,
      },
      "&$cssFocused $notchedOutline": {
        borderColor: colors.text,
      },
    },
    notchedOutline: {},
    cssFocused: {},
    error: {},
    disabled: {},
  });
  const classes = styles();
  return (
    <TextField
      defaultValue={props.defaultValue}
      id={props.id}
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

WhiteColorTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default WhiteColorTextField;
