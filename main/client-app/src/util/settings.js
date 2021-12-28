import { createTheme } from '@material-ui/core'
import { pink, purple } from '@material-ui/core/colors'
import React, { useEffect } from 'react'
import { serverRoot, validateToken } from './Utils'

export let theme = undefined
export let colors = {}
export let setColors = (c) => {}
export let ColorBase = (props) => {
  ;[colors, setColors] = React.useState({
    primaryLight: 'rgba(33, 150, 243, 0.65)',
    primaryMedium: 'rgba(25, 118, 210, 0.65)',
    primaryDark: 'rgba(42, 77, 105, 0.65)',
    accent: 'rgba(231, 239, 246, 1)',
    accentDark: 'rgba(173, 203, 227, 0.65)',
  });
  theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB'
      },
      secondary: {
        main: '#FFC107'
      },
    },
  });
  return <div />
}

export let token = ''
export function setToken(t) {
  token = t
}

export let homeSpaceId = ''
export function setHomeSpaceId(t) {
  homeSpaceId = t
}

export let homeRoomId = ''
export function setHomeRoomId(t) {
  homeRoomId = t
}

export let phone = ''
export function setPhone(t) {
  phone = t
}

export let me = {}
export function setMe(m) {
  me = m
}

export let currentSurvey = {}
export function setCurrentSurvey(m) {
  currentSurvey = m
}
