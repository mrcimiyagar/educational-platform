import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = {
  input: {
    color: "white"
  }
};

function BlackColorTextField(props) {
  const { classes } = props;

  return (
    <TextField
      defaultValue="color"
      InputProps={{
        className: classes.input
      }}
    />
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedInputs);