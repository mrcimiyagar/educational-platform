import React, { Component } from 'react'
import { TextField, Button, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

let self

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: '#fff'
  },
  cssLabel: {
    color: '#fff',
    '&.Mui-focused': {
      color: '#fff',
    },
  },
  cssOutlinedInput: {
    '&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline': {
      borderColor: '#fff', //default
    },
    '&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline': {
      borderColor: '#fff', //hovered #DCDCDC
    },
    '&$cssFocused $notchedOutline': {
      borderColor: '#fff', //focused
    },
  },
  notchedOutline: {},
  cssFocused: {},
  error: {},
  disabled: {},
})
class WhiteColorTextField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      user: '',
      errorMsg: '',
      errorMsgLength: '',
      loginErrorMsg: '',
      flag: false,
      password: '',
      hidden: true,
      valuePassText: 'SHOW',
    }
    self = this
  }

  componentDidMount() {
    this._isMounted = true
    if (this.props.password) {
      this.setState({ password: this.props.password })
    }
  }

  componentDidUpdate(prevProps) {}

  render() {
    const { classes } = this.props
    return (
      <TextField
        type={this.props.type}
        id={this.props.id}
        className={classes.textField}
        onChange={this.props.onChange}
        label={this.props.label}
        variant={this.props.variant}
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
          inputMode: 'numeric',
        }}
        style={this.props.style}
      />
    )
  }
}

WhiteColorTextField.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(WhiteColorTextField)
