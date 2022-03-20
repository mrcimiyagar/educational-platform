import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { colors } from "../../util/settings";

export default function ProfileEditField(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: colors.field,
      backdropFilter: "blur(10px)",
      borderRadius: 24,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      color: colors.text,
      height: props.style.height
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
      },
    },
  }));

  const classes = useStyles();
  const classesInput = useStylesInput();

  return (
    <div className={classes.root} style={props.style}>
      <InputBase
        defaultValue={props.defaultValue}
        className={classes.input}
        placeholder={props.placeholder}
        classes={{
          input: classesInput.InputBaseStyle,
        }}
      />
    </div>
  );
}
