import { Fab, Paper, TextField, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import Add from '@material-ui/icons/Add'
import ArrowForwardTwoTone from '@material-ui/icons/ArrowForwardTwoTone'
import React, { useEffect } from 'react'
import { pathConfig } from '../..'
import {
  gotoPage,
  isDesktop,
  popPage,
  registerDialogOpen
} from '../../App'
import { colors, setToken, token } from '../../util/settings'
import { serverRoot, useForceUpdate } from '../../util/Utils'
import ReCAPTCHA from "react-google-recaptcha";

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

  function onChange(value) {
    while (props.name === undefined || props.name === null || props.name.length === 0) {
      props.name = window.prompt('نام خود را وارد نمایید', '');
    }
    alert('تا چند لحظه ی دیگر به داخل سامانه هدایت می شوید .');
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          recaptchaToken: value,
          token: props.token,
          name: props.name,
          roomId: props.roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + '/room/use_invitation', requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success' && result.token != undefined) {
          localStorage.setItem('token', result.token);
          setToken(result.token);
          setTimeout(() => {
            window.location.href = pathConfig.mainFrontend + '/app/room?room_id=' + result.roomId + '&tab_index=0';
          }, 1000);
        }
      });
  }

  return (
    <ReCAPTCHA
      sitekey={'6Lc1P7odAAAAAE4vJN6tbYWiyibGe0v-PMwu3i8v'}
      onChange={onChange}
    />
  );
}
