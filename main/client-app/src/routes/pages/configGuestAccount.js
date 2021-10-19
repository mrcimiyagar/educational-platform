import { Fab, Paper, TextField, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add'
import ArrowForwardTwoTone from '@material-ui/icons/ArrowForwardTwoTone'
import React from 'react'
import { pathConfig } from '../..'
import {
  gotoPage,
  isDesktop,
  popPage,
  registerDialogOpen
} from '../../App'
import { colors, setToken, token } from '../../util/settings'
import { serverRoot, useForceUpdate } from '../../util/Utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1000,
    direction: 'rtl',
  },
  textField: {
    '& .MuiFilledInput-root': {
      background: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 16,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontFamily: 'mainFont',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

export default function ConfigGuestAccount(props) {

  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: props.token,
      name: props.name
    }),
    redirect: 'follow',
  }
  fetch(serverRoot + '/room/use_invitation', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(JSON.stringify(result));
      localStorage.setItem('token', result.token);
      setToken(result.token);
      window.location.href = pathConfig.mainFrontend + '/app/room?room_id=' + result.roomId;
    })
    .catch((error) => console.log('error', error));

  return (<div/>);
}
